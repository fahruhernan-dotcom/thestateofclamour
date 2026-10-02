import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * High-performance, passive media-query listener for mobile viewport detection.
 * Only triggers state re-renders when crossing the 768px boundary.
 *
 * Safari iOS note: window.innerWidth can be unreliable during initial paint
 * (especially with virtual keyboard visible). We use matchMedia as source of truth.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Prefer matchMedia over window.innerWidth for Safari reliability
    try {
      return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
    } catch {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    } catch {
      return;
    }

    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Sync state on mount — Safari may have rendered with stale initial value
    updateMatch(mediaQuery);

    // addEventListener is modern; addListener is deprecated but needed for Safari < 14
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatch);
      return () => mediaQuery.removeEventListener('change', updateMatch);
    } else if (typeof (mediaQuery as MediaQueryList & { addListener?: Function }).addListener === 'function') {
      // eslint-disable-next-line deprecation/deprecation
      (mediaQuery as MediaQueryList & { addListener: Function }).addListener(updateMatch);
      return () => (mediaQuery as MediaQueryList & { removeListener: Function }).removeListener(updateMatch);
    }
  }, []);

  return isMobile;
};

export default useIsMobile;
