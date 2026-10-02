// Audio Coordinator for THE STATE OF CLAMOUR (HOUSE OF WITNESSES 2026)
// Guarantees strict mutual exclusion between:
// - Section 1: GuestStorytellingTransition / HeroSection (01 // THE GUESTS - Recap video)
// - Section 2: LineupSection (02 // THE RELEASE - The Guests Lineup cards)

export type AudioSection = 'sec1-storytelling' | 'sec2-lineup' | 'none';

let currentAudioOwner: AudioSection = 'none';

export const getAudioOwner = (): AudioSection => currentAudioOwner;

export const setAudioOwner = (owner: AudioSection) => {
  currentAudioOwner = owner;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('how:audio-owner-change', { detail: { owner } }));
  }
};

// Map of active rAF animations per video element to avoid conflicting concurrent fades
const activeFadeMap = new WeakMap<HTMLVideoElement, number>();

/**
 * Cancels any active programmatic volume fade on a video element.
 */
export const cancelVideoFade = (video: HTMLVideoElement) => {
  const currentRaf = activeFadeMap.get(video);
  if (currentRaf !== undefined) {
    cancelAnimationFrame(currentRaf);
    activeFadeMap.delete(video);
  }
};

/**
 * Smoothly ramps video volume towards targetVolume over durationMs using rAF.
 * When target is 0, mutes after reaching 0 to save processing.
 */
export const fadeVideoVolume = (
  video: HTMLVideoElement,
  targetVolume: number,
  durationMs: number = 300,
  onComplete?: () => void
) => {
  cancelVideoFade(video);

  const clampedTarget = Math.max(0, Math.min(1, targetVolume));
  const startVolume = video.muted ? 0 : video.volume;

  if (Math.abs(startVolume - clampedTarget) < 0.01) {
    try {
      video.volume = clampedTarget;
      if (clampedTarget === 0) video.muted = true;
    } catch {}
    onComplete?.();
    return;
  }

  if (video.muted && clampedTarget > 0) {
    try {
      video.volume = 0;
      video.muted = false;
    } catch {}
  }

  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / Math.max(1, durationMs));
    // S-curve smooth interpolation for acoustic naturalness
    const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
    const newVol = startVolume + (clampedTarget - startVolume) * ease;

    try {
      video.volume = Math.max(0, Math.min(1, newVol));
    } catch {}

    if (progress < 1) {
      const raf = requestAnimationFrame(step);
      activeFadeMap.set(video, raf);
    } else {
      activeFadeMap.delete(video);
      try {
        video.volume = clampedTarget;
        if (clampedTarget === 0) {
          video.muted = true;
        }
      } catch {}
      onComplete?.();
    }
  };

  const raf = requestAnimationFrame(step);
  activeFadeMap.set(video, raf);
};

/**
 * Smoothly crossfades between two video elements.
 * Ramps outgoing video volume down to 0 and mutes it.
 * Ramps incoming video volume up to targetVolume.
 */
export const crossfadeVideos = (
  outgoing: HTMLVideoElement | null,
  incoming: HTMLVideoElement | null,
  targetVolume: number = 0.95,
  durationMs: number = 280,
  onComplete?: () => void
) => {
  if (outgoing && outgoing !== incoming && !outgoing.muted) {
    fadeVideoVolume(outgoing, 0, durationMs, () => {
      outgoing.muted = true;
    });
  }
  if (incoming) {
    cancelVideoFade(incoming);
    if (incoming.muted) {
      try {
        incoming.volume = 0;
        incoming.muted = false;
      } catch {}
    }
    if (incoming.paused) {
      incoming.play().catch(() => {});
    }
    fadeVideoVolume(incoming, targetVolume, durationMs, onComplete);
  }
};

export interface SilenceOptions {
  immediate?: boolean;
  duration?: number;
}

let isSilencingSec1 = false;
export const silenceSec1 = (options?: SilenceOptions) => {
  if (isSilencingSec1 || typeof document === 'undefined') return;
  isSilencingSec1 = true;
  const immediate = options?.immediate ?? false;
  const duration = options?.duration ?? 350;

  try {
    const storyVideos = document.querySelectorAll<HTMLVideoElement>(
      '.storytelling-photo-img, #the-guests video, .hero-mobile-portal-video, #hero-mobile video'
    );

    if (currentAudioOwner === 'sec1-storytelling') {
      currentAudioOwner = 'none';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('how:audio-owner-change', { detail: { owner: 'none' } }));
      }
    }

    storyVideos.forEach((v) => {
      if (immediate) {
        cancelVideoFade(v);
        v.muted = true;
        v.volume = 0;
      } else {
        fadeVideoVolume(v, 0, duration, () => {
          v.muted = true;
        });
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('how:audio-sec1-silenced'));
    }
  } finally {
    isSilencingSec1 = false;
  }
};

let isSilencingSec2 = false;
export const silenceSec2 = (options?: SilenceOptions) => {
  if (isSilencingSec2 || typeof document === 'undefined') return;
  isSilencingSec2 = true;
  const immediate = options?.immediate ?? false;
  const duration = options?.duration ?? 350;

  try {
    const lineupVideos = document.querySelectorAll<HTMLVideoElement>(
      '#lineup video, .lineup-mobile-media-video, .guest-portrait-video'
    );

    if (currentAudioOwner === 'sec2-lineup') {
      currentAudioOwner = 'none';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('how:audio-owner-change', { detail: { owner: 'none' } }));
      }
    }

    lineupVideos.forEach((v) => {
      if (immediate) {
        cancelVideoFade(v);
        v.muted = true;
        v.volume = 0;
      } else {
        fadeVideoVolume(v, 0, duration, () => {
          v.muted = true;
        });
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('how:audio-sec2-silenced'));
    }
  } finally {
    isSilencingSec2 = false;
  }
};

/**
 * Checks whether Section 1's audio is currently producing sound.
 */
export const isSec1AudioActive = (): boolean => {
  if (typeof document === 'undefined') return false;
  if (currentAudioOwner === 'sec1-storytelling') return true;

  const storyVideo = document.querySelector<HTMLVideoElement>(
    '.storytelling-photo-img, #the-guests video, .hero-mobile-portal-video, #hero-mobile video'
  );
  if (storyVideo && !storyVideo.muted && !storyVideo.paused && storyVideo.volume > 0.02) {
    return true;
  }
  return false;
};

/**
 * Checks whether Section 2 is allowed to turn on sound.
 * Guaranteed to return FALSE if Section 1 is still producing audible sound.
 */
export const canSec2PlayAudio = (): boolean => {
  if (typeof document === 'undefined') return false;

  // 1. If Section 1 audio is producing sound or owns audio, Section 2 waits
  if (isSec1AudioActive()) {
    return false;
  }

  // 2. Section 1 container position (desktop #hero, mobile #hero-mobile)
  const sec1 = document.getElementById('hero-mobile') || document.getElementById('hero');
  if (sec1) {
    const r = sec1.getBoundingClientRect();
    if (r.bottom > window.innerHeight * 0.25) {
      return false;
    }
  }

  // 3. Section 2 (#lineup) must have entered sufficiently into view
  const sec2 = document.getElementById('lineup');
  if (sec2) {
    const r2 = sec2.getBoundingClientRect();
    if (r2.top > window.innerHeight * 0.75) {
      return false;
    }
  }

  return true;
};

/**
 * Checks whether Section 1 is allowed to produce sound.
 * Returns FALSE when Section 2 has largely taken over the screen.
 */
export const canSec1PlayAudio = (): boolean => {
  if (typeof document === 'undefined') return false;

  // If Section 2 owns audio, Section 1 cannot play
  if (currentAudioOwner === 'sec2-lineup') {
    return false;
  }

  // If Section 2 has scrolled up past 20% of viewport, Section 1 is completely faded out
  const sec2 = document.getElementById('lineup');
  if (sec2) {
    const r2 = sec2.getBoundingClientRect();
    if (r2.top <= window.innerHeight * 0.20) {
      return false;
    }
  }

  return true;
};

