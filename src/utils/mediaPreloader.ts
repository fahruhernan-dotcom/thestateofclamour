// Media Preloader & Scroll Gate Coordinator for THE STATE OF CLAMOUR
// Ensures Section 2 (and transition) videos are 100% preloaded before unlocking scroll.

export interface PreloaderState {
  loadedBytes: number;
  totalBytes: number;
  percent: number;
  isComplete: boolean;
  isUnlocked: boolean;
}

export const TARGET_VIDEOS = [
  '/assets/how2026_recap.mp4',
  '/assets/guest_malvin.mp4',
  '/assets/guest_far.mp4'
];

const cachedBlobUrls = new Map<string, string>();
const listeners = new Set<(state: PreloaderState) => void>();

let state: PreloaderState = {
  loadedBytes: 0,
  totalBytes: 22390571, // 4.9MB + 6.1MB + 11.4MB
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
    // Safety maximum timeout: unlock after 12s so slow connections are never trapped
    const timeoutId = setTimeout(() => {
      if (!state.isUnlocked) {
        state = { ...state, isUnlocked: true, isComplete: true, percent: 100 };
        notify();
      }
    }, 12000);

    try {
      const fileProgress: Record<string, number> = {};
      const fileTotals: Record<string, number> = {
        '/assets/how2026_recap.mp4': 4906734,
        '/assets/guest_malvin.mp4': 6080651,
        '/assets/guest_far.mp4': 11403186
      };

      const updateProgress = () => {
        const total = Object.values(fileTotals).reduce((a, b) => a + b, 0) || 22390571;
        const loaded = Object.values(fileProgress).reduce((a, b) => a + b, 0);
        const percent = Math.min(100, Math.round((loaded / total) * 100));
        state = {
          ...state,
          loadedBytes: loaded,
          totalBytes: total,
          percent,
          isComplete: percent >= 100,
          isUnlocked: state.isUnlocked || percent >= 100
        };
        notify();
      };

      await Promise.all(
        TARGET_VIDEOS.map(async (url) => {
          try {
            const resp = await fetch(url);
            if (!resp.ok) return;

            const cl = +(resp.headers.get('content-length') || 0);
            if (cl > 0) {
              fileTotals[url] = cl;
            }

            const reader = resp.body?.getReader();
            if (!reader) {
              const blob = await resp.blob();
              cachedBlobUrls.set(url, URL.createObjectURL(blob));
              fileProgress[url] = fileTotals[url] || blob.size;
              updateProgress();
              return;
            }

            const chunks: BlobPart[] = [];
            let received = 0;
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                chunks.push(value);
                received += value.length;
                fileProgress[url] = received;
                updateProgress();
              }
            }

            const blob = new Blob(chunks, { type: 'video/mp4' });
            cachedBlobUrls.set(url, URL.createObjectURL(blob));
          } catch (e) {
            console.warn('Preload failed for', url, e);
          }
        })
      );

      clearTimeout(timeoutId);
      state = { ...state, percent: 100, isComplete: true, isUnlocked: true };
      notify();
    } catch {
      clearTimeout(timeoutId);
      state = { ...state, percent: 100, isComplete: true, isUnlocked: true };
      notify();
    }
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
