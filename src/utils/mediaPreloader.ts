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
    const videoWeight = isMobile ? 18 : 25; // Weight recap video in progress calculation
    const totalUnits = totalFrames + criticalImages.length + videoWeight;

    let loadedUnits = 0;
    let resolved = false;

    const checkProgress = () => {
      if (resolved) return;
      loadedUnits++;
      const currentPct = Math.min(100, Math.round((loadedUnits / totalUnits) * 100));
      state = {
        ...state,
        loadedBytes: loadedUnits,
        totalBytes: totalUnits,
        percent: currentPct,
        isComplete: currentPct >= 100,
        isUnlocked: currentPct >= 100
      };
      notify();

      if (currentPct >= 100) {
        resolved = true;
        clearTimeout(safetyTimerId);
        resolve();
      }
    };

    // 1. Preload Critical Images
    criticalImages.forEach((src) => {
      const img = new Image();
      img.onload = checkProgress;
      img.onerror = checkProgress;
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
        checkProgress();
      };
      img.onerror = () => {
        checkProgress();
      };
      img.src = src;
    };

    // Fire all frames (browsers automatically pipeline HTTP/2 requests)
    for (let i = 0; i < totalFrames; i++) {
      loadFrame(i);
    }

    // 3. Preload Section 1 Recap Video (/assets/how2026_recap.mp4)
    if (isMobile) {
      // Mobile devices stream natively via HTML5 <video> with HTTP Range requests
      // Avoid fetching 33MB into mobile RAM/cellular bandwidth
      for (let w = 0; w < videoWeight; w++) {
        checkProgress();
      }
    } else {
      fetch('/assets/how2026_recap.mp4')
        .then(async (resp) => {
          if (resp.ok) {
            const blob = await resp.blob();
            cachedBlobUrls.set('/assets/how2026_recap.mp4', URL.createObjectURL(blob));
          }
          // Account for video weight in progress
          for (let w = 0; w < videoWeight; w++) {
            checkProgress();
          }
        })
        .catch(() => {
          for (let w = 0; w < videoWeight; w++) {
            checkProgress();
          }
        });
    }

    // 4. Safety maximum timeout: 4s to never trap user on slow connections
    const safetyTimerId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        state = { ...state, percent: 100, isComplete: true, isUnlocked: true };
        notify();
        resolve();
      }
    }, 4000);
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

