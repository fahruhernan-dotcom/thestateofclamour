// Media Preloader & Scroll Gate Coordinator for THE STATE OF CLAMOUR
// Fast & lightweight critical asset preloading for instant luxury entrance.

export interface PreloaderState {
  loadedBytes: number;
  totalBytes: number;
  percent: number;
  isComplete: boolean;
  isUnlocked: boolean;
}

export const TARGET_VIDEOS = [
  '/assets/hero_scroll_cinematic.mp4',
  '/assets/how2026_recap.mp4',
  '/assets/guest_malvin.mp4',
  '/assets/guest_far.mp4'
];

const cachedBlobUrls = new Map<string, string>();
const listeners = new Set<(state: PreloaderState) => void>();

let state: PreloaderState = {
  loadedBytes: 0,
  totalBytes: 100,
  percent: 0,
  isComplete: false,
  isUnlocked: false
};

export const getCachedVideoUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  return cachedBlobUrls.get(url) || url;
};

const notify = () => {
  listeners.forEach((listener) => listener({ ...state }));
};

let preloadPromise: Promise<void> | null = null;

export const startPreload = (): Promise<void> => {
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    // Critical visual assets required for immediate pristine paint
    const criticalImages = [
      '/assets/tsoc_logo_transparent.png',
      '/assets/hero_scroll_poster_mobile_2k.jpg',
      '/assets/how2026_recap_poster.jpg'
    ];

    let loadedCount = 0;
    const totalAssets = criticalImages.length + 1; // images + font check

    const onAssetLoaded = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
      state = {
        ...state,
        loadedBytes: loadedCount,
        totalBytes: totalAssets,
        percent: pct,
        isComplete: pct >= 100,
        isUnlocked: pct >= 100
      };
      notify();
    };

    // Preload critical images in parallel
    criticalImages.forEach((src) => {
      const img = new Image();
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded;
      img.src = src;
    });

    // Check fonts readiness
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready
        .then(() => onAssetLoaded())
        .catch(() => onAssetLoaded());
    } else {
      onAssetLoaded();
    }

    // Failsafe guarantee: ensure 100% within 1.2s max under all network conditions
    setTimeout(() => {
      if (!state.isComplete) {
        state = { ...state, percent: 100, isComplete: true, isUnlocked: true };
        notify();
      }
    }, 1200);
  })();

  return preloadPromise;
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

