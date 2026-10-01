// Audio Coordinator for THE STATE OF CLAMOUR (HOUSE OF WITNESSES 2026)
// Guarantees strict mutual exclusion between:
// - Section 1: GuestStorytellingTransition (01 // THE GUESTS - Recap video)
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

let isSilencingSec1 = false;
export const silenceSec1 = () => {
  if (isSilencingSec1 || typeof document === 'undefined') return;
  isSilencingSec1 = true;
  try {
    const storyVideos = document.querySelectorAll<HTMLVideoElement>(
      '.storytelling-photo-img, #the-guests video, .hero-mobile-portal-video, #hero-mobile video'
    );
    let changed = false;
    storyVideos.forEach((v) => {
      if (!v.muted) {
        v.muted = true;
        changed = true;
      }
    });
    if (currentAudioOwner === 'sec1-storytelling') {
      currentAudioOwner = 'none';
      changed = true;
    }
    if (changed && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('how:audio-sec1-silenced'));
    }
  } finally {
    isSilencingSec1 = false;
  }
};

let isSilencingSec2 = false;
export const silenceSec2 = () => {
  if (isSilencingSec2 || typeof document === 'undefined') return;
  isSilencingSec2 = true;
  try {
    const lineupVideos = document.querySelectorAll<HTMLVideoElement>(
      '#lineup video, .lineup-mobile-media-video, .guest-portrait-video'
    );
    let changed = false;
    lineupVideos.forEach((v) => {
      if (!v.muted) {
        v.muted = true;
        changed = true;
      }
    });
    if (currentAudioOwner === 'sec2-lineup') {
      currentAudioOwner = 'none';
      changed = true;
    }
    if (changed && typeof window !== 'undefined') {
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
  if (storyVideo && !storyVideo.muted && !storyVideo.paused && storyVideo.volume > 0) {
    return true;
  }
  return false;
};

/**
 * Checks whether Section 2 is allowed to turn on sound.
 * Guaranteed to return FALSE if Section 1 is still on screen, transitioning, or producing audio.
 */
export const canSec2PlayAudio = (): boolean => {
  if (typeof document === 'undefined') return false;

  // 1. If Section 1 audio is producing sound or owns audio, Section 2 is forbidden
  if (isSec1AudioActive()) {
    return false;
  }

  // 2. Section 1 container position (desktop #the-guests, mobile #hero-mobile)
  const sec1 = document.getElementById('hero-mobile') || document.getElementById('the-guests');
  if (sec1) {
    const r = sec1.getBoundingClientRect();
    if (r.bottom > window.innerHeight * 0.35) {
      return false;
    }
  }

  // 3. Section 2 (#lineup) must have entered sufficiently into view
  const sec2 = document.getElementById('lineup');
  if (sec2) {
    const r2 = sec2.getBoundingClientRect();
    if (r2.top > window.innerHeight * 0.70) {
      return false;
    }
  }

  return true;
};

/**
 * Checks whether Section 1 is allowed to turn on sound.
 * Guaranteed to return FALSE if user has scrolled down into Section 2.
 */
export const canSec1PlayAudio = (): boolean => {
  if (typeof document === 'undefined') return false;

  // If Section 2 owns audio, Section 1 cannot play
  if (currentAudioOwner === 'sec2-lineup') {
    return false;
  }

  // If Section 2 has scrolled up past 40% of viewport, user is viewing Section 2
  const sec2 = document.getElementById('lineup');
  if (sec2) {
    const r2 = sec2.getBoundingClientRect();
    if (r2.top <= window.innerHeight * 0.40) {
      return false;
    }
  }

  return true;
};
