// Media Preloader & Scroll Gate Coordinator for THE STATE OF CLAMOUR
// Truly preloads Section 1 Canvas Frames & Recap Video for stutter-free 120fps scrolling.

export interface PreloaderState {
  loadedBytes: number;
  totalBytes: number;
  percent: number;
  isComplete: boolean;
  isUnlocked: boolean;
}

export const TOTAL_MOBILE_FRAMES = 84;
export const TOTAL_DESKTOP_FRAMES = 192;

export const TARGET_VIDEOS = [
  '/assets/how2026_recap.mp4',
  '/assets/guest_malvin.mp4',
  '/assets/guest_far.mp4'
];

export const getMobileFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_MOBILE_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_mobile_frames/mf_${padded}.jpg`;
};

export const getDesktopFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_DESKTOP_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_frames/f_${padded}.webp`;
};

const preloadedMobileFrames = new Map<number, HTMLImageElement>();
const preloadedDesktopFrames = new Map<number, HTMLImageElement>();
const cachedBlobUrls = new Map<string, string>();
const listeners = new Set<(state: PreloaderState) => void>();

export const getMobileFrame = (index: number): HTMLImageElement | undefined => {
  return preloadedMobileFrames.get(index);
};

export const getDesktopFrame = (index: number): HTMLImageElement | undefined => {
  return preloadedDesktopFrames.get(index);
};

export const getCachedVideoUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  return cachedBlobUrls.get(url) || url;
};

let state: PreloaderState = {
  loadedBytes: 0,
  totalBytes: 100,
  percent: 0,
  isComplete: false,
  isUnlocked: false
};

const notify = () => {
  listeners.forEach((listener) => listener({ ...state }));
};

let preloadPromise: Promise<void> | null = null;

export const startPreload = (): Promise<void> => {
  if (preloadPromise) return preloadPromise;

  preloadPromise = new Promise<void>((resolve) => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    // Critical visual assets
    const criticalImages = isMobile
      ? ['/assets/tsoc_logo_transparent.png', '/assets/hero_scroll_poster_mobile_2k.jpg', '/assets/how2026_recap_poster.jpg']
      : ['/assets/tsoc_logo_transparent.png', '/assets/how2026_recap_poster.jpg'];

    const totalFrames = isMobile ? TOTAL_MOBILE_FRAMES : TOTAL_DESKTOP_FRAMES;
    
    let loadedFrames = 0;
    let loadedImages = 0;
    let videoRatio = 0;
    let isVideoReady = false;
    let resolved = false;

    const computeAndNotify = () => {
      if (resolved) return;

      const framesRatio = totalFrames > 0 ? loadedFrames / totalFrames : 1;
      const imagesRatio = criticalImages.length > 0 ? loadedImages / criticalImages.length : 1;

      // Real Weighted Distribution:
      // 50% Canvas frames + 35% Section 1 Video Buffer + 15% Core Posters
      const calculatedPct = Math.min(100, Math.round(
        (framesRatio * 50) +
        (videoRatio * 35) +
        (imagesRatio * 15)
      ));

      const isReadyToUnlock = calculatedPct >= 99 && (videoRatio >= 0.8 || isVideoReady);

      state = {
        ...state,
        loadedBytes: loadedFrames + loadedImages,
        totalBytes: totalFrames + criticalImages.length,
        percent: calculatedPct,
        isComplete: isReadyToUnlock,
        isUnlocked: isReadyToUnlock
      };
      notify();

      if (isReadyToUnlock) {
        resolved = true;
        clearTimeout(safetyTimerId);
        resolve();
      }
    };

    // 1. Preload Critical Images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedImages++;
        computeAndNotify();
      };
      img.onerror = () => {
        loadedImages++;
        computeAndNotify();
      };
      img.src = src;
    });

    // 2. Preload Canvas Frames in parallel batches
    const loadFrame = (idx: number) => {
      const img = new Image();
      const src = isMobile ? getMobileFramePath(idx) : getDesktopFramePath(idx);
      img.onload = () => {
        if (isMobile) {
          preloadedMobileFrames.set(idx, img);
        } else {
          preloadedDesktopFrames.set(idx, img);
        }
        loadedFrames++;
        computeAndNotify();
      };
      img.onerror = () => {
        loadedFrames++;
        computeAndNotify();
      };
      img.src = src;
    };

    // Fire all frames (browsers automatically pipeline HTTP/2 requests)
    for (let i = 0; i < totalFrames; i++) {
      loadFrame(i);
    }

    // 3. Genuine HTML5 Video Preload & Buffer Gate for Section 1 Recap Video
    // Instead of faking progress, instantiate an HTML5 video and listen to real buffer ranges
    try {
      const videoPreloadEl = document.createElement('video');
      videoPreloadEl.preload = 'auto';
      videoPreloadEl.muted = true;
      videoPreloadEl.playsInline = true;
      videoPreloadEl.setAttribute('playsinline', '');
      videoPreloadEl.setAttribute('webkit-playsinline', '');

      const checkVideoBuffer = () => {
        if (isVideoReady) return;
        if (videoPreloadEl.buffered.length > 0) {
          const bufferedSeconds = videoPreloadEl.buffered.end(videoPreloadEl.buffered.length - 1);
          const duration = videoPreloadEl.duration || 28;
          // Target: At least 6 seconds buffered ahead (or 100% of duration) guarantees zero-lag start
          const targetBuffer = Math.min(duration, 6);
          const currentBufferRatio = Math.min(1, bufferedSeconds / targetBuffer);
          videoRatio = Math.max(videoRatio, currentBufferRatio);
          computeAndNotify();
        }
      };

      videoPreloadEl.addEventListener('loadedmetadata', () => {
        checkVideoBuffer();
      });

      videoPreloadEl.addEventListener('progress', () => {
        checkVideoBuffer();
      });

      videoPreloadEl.addEventListener('loadeddata', () => {
        videoRatio = Math.max(videoRatio, 0.45);
        checkVideoBuffer();
      });

      videoPreloadEl.addEventListener('canplay', () => {
        videoRatio = Math.max(videoRatio, 0.85);
        checkVideoBuffer();
      });

      videoPreloadEl.addEventListener('canplaythrough', () => {
        // canplaythrough: Browser heuristic certifies video can play through without buffering
        videoRatio = 1.0;
        isVideoReady = true;
        computeAndNotify();
      });

      videoPreloadEl.addEventListener('error', () => {
        // Network fallback: Don't trap user if video fails
        videoRatio = 1.0;
        isVideoReady = true;
        computeAndNotify();
      });

      videoPreloadEl.src = '/assets/how2026_recap.mp4';
      videoPreloadEl.load();
    } catch {
      // In non-DOM environment or if video constructor fails
      videoRatio = 1.0;
      isVideoReady = true;
      computeAndNotify();
    }

    // 4. Safety maximum failsafe timeout: 10s on severely throttled 2G networks
    const safetyTimerId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        state = { ...state, percent: 100, isComplete: true, isUnlocked: true };
        notify();
        resolve();
      }
    }, 10000);
  });

  return preloadPromise;
};

// Background prefetch for Section 2 videos after Section 1 entrance is unsealed
export const startBackgroundPreloadRemaining = () => {
  // Mobile devices stream video progressively via native HTML5 Range requests.
  // Avoid buffering 17.5MB of background video blobs into mobile RAM/cellular data.
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  if (isMobile) return;

  const remaining = ['/assets/guest_malvin.mp4', '/assets/guest_far.mp4'];
  remaining.forEach(async (url) => {
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const blob = await resp.blob();
        cachedBlobUrls.set(url, URL.createObjectURL(blob));
      }
    } catch {
      // Non-critical fallback
    }
  });
};

export const unlockScrollManually = () => {
  state = { ...state, isUnlocked: true };
  notify();
};

export const getPreloaderState = () => ({ ...state });

export const subscribePreloader = (listener: (s: PreloaderState) => void) => {
  listeners.add(listener);
  listener({ ...state });
  return () => {
    listeners.delete(listener);
  };
};

