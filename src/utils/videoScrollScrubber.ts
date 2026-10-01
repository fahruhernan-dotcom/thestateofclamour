/**
 * Performance-Oriented Video Scroll Scrubber Utility
 * 
 * Provides smooth, dampening video seeking via requestAnimationFrame and LERP interpolation.
 * Prevents decoder thrashing by enforcing single-RAF loop scheduling and delta thresholding.
 */

export interface VideoScrubberOptions {
  duration: number; // Video duration in seconds
  lerpFactor?: number; // Smoothing factor between 0.05 (heavy damping) and 0.5 (snappy), default 0.18
  seekThreshold?: number; // Minimum time difference in seconds before touching video.currentTime, default 0.035 (~1 frame at 24fps)
  onFrame?: (currentTime: number, progress: number) => void;
}

export interface VideoScrubberController {
  seekToProgress: (progress: number) => void;
  seekToTime: (targetSeconds: number) => void;
  getCurrentTime: () => number;
  getTargetTime: () => number;
  isSeeking: () => boolean;
  destroy: () => void;
}

export function createVideoScrubber(
  video: HTMLVideoElement,
  options: VideoScrubberOptions
): VideoScrubberController {
  const duration = Math.max(0.1, options.duration);
  const lerp = Math.max(0.01, Math.min(1, options.lerpFactor ?? 0.18));
  const threshold = Math.max(0.001, options.seekThreshold ?? 0.035);

  let targetTime = 0;
  let currentTime = 0;
  let rafId: number | null = null;
  let isActive = true;

  const clampTime = (t: number): number => {
    if (isNaN(t)) return 0;
    return Math.max(0, Math.min(duration, t));
  };

  const applySeek = (time: number) => {
    // Only attempt fastSeek where supported and safe; fallback to standard currentTime
    if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
      try {
        (video as any).fastSeek(time);
        return;
      } catch {
        // Fallback to standard property setter if browser rejects fastSeek
      }
    }
    video.currentTime = time;
  };

  const updateLoop = () => {
    if (!isActive) {
      rafId = null;
      return;
    }

    const diff = targetTime - currentTime;

    // Continue interpolating as long as delta exceeds threshold
    if (Math.abs(diff) > threshold) {
      currentTime += diff * lerp;
      applySeek(currentTime);
      options.onFrame?.(currentTime, currentTime / duration);
      rafId = requestAnimationFrame(updateLoop);
    } else {
      // Snap to exact target time to finish the transition smoothly
      currentTime = targetTime;
      applySeek(targetTime);
      options.onFrame?.(targetTime, targetTime / duration);
      rafId = null;
    }
  };

  const scheduleUpdate = () => {
    if (!isActive) return;
    if (rafId === null) {
      rafId = requestAnimationFrame(updateLoop);
    }
  };

  return {
    seekToProgress(progress: number) {
      const clamped = Math.max(0, Math.min(1, progress));
      targetTime = clamped * duration;
      scheduleUpdate();
    },

    seekToTime(seconds: number) {
      targetTime = clampTime(seconds);
      scheduleUpdate();
    },

    getCurrentTime() {
      return currentTime;
    },

    getTargetTime() {
      return targetTime;
    },

    isSeeking() {
      return rafId !== null;
    },

    destroy() {
      isActive = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}
