import { useEffect, useRef, useCallback } from 'react';

interface UseCarouselOffsetOptions {
  enabled?: boolean;
  onActiveIndexChange?: (index: number) => void;
  maxOffsetDistance?: number; // pixel distance for 1-step offset transition (default: 420)
  minScale?: number; // minimum scale for peripheral cards (default: 0.62)
  maxBlur?: number; // maximum blur in px for peripheral cards (default: 6)
  minOpacity?: number; // minimum opacity for peripheral cards (default: 0.25)
  maxParallaxX?: number; // max inner parallax translation in % (default: 30)
  maxTranslateY?: number; // vertical ascent/descent along the diagonal path (default: 135)
  maxRotateZ?: number; // rotational tilt along the diagonal path in deg (default: 8.5)
}

/**
 * High-performance, GPU-accelerated offset-linked animation hook for carousels.
 * Exact mathematical replication of Motion.dev `Carousel: Offset-linked animations`:
 * - scale: [-range, 0, range] -> [minScale, 1.0, minScale]
 * - blur: [-range, 0, range] -> [maxBlur, 0, maxBlur]
 * - opacity: [-range, 0, range] -> [minOpacity, 1.0, minOpacity]
 * - parallaxX: [-range, 0, range] -> [maxParallaxX, 0, -maxParallaxX]
 * - translateY: [-range, 0, range] -> [-maxTranslateY, 0, +maxTranslateY] (diagonal ribbon)
 * - rotateZ: [-range, 0, range] -> [-maxRotateZ, 0, +maxRotateZ] (slanted along ribbon)
 */
export function useCarouselOffset(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseCarouselOffsetOptions = {}
) {
  const {
    enabled = true,
    onActiveIndexChange,
    maxOffsetDistance = 420,
    minScale = 0.62,
    maxBlur = 6,
    minOpacity = 0.25,
    maxParallaxX = 30,
    maxTranslateY = 135,
    maxRotateZ = 8.5,
  } = options;

  const rafIdRef = useRef<number | null>(null);
  const lastActiveIndexRef = useRef<number>(-1);
  const lastValuesRef = useRef<WeakMap<HTMLElement, { s: string; b: string; f: string; o: string; p: string; y: string; r: string }>>(new WeakMap());
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);

  useEffect(() => {
    onActiveIndexChangeRef.current = onActiveIndexChange;
  }, [onActiveIndexChange]);

  const updateOffsets = useCallback(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    if (containerWidth === 0) return;

    const scrollCenter = container.scrollLeft + containerWidth / 2;
    const range = maxOffsetDistance > 0 ? maxOffsetDistance : Math.max(380, containerWidth * 0.4);

    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minAbsOffset = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child || child.offsetWidth === 0) continue;

      const cardCenter = child.offsetLeft + child.offsetWidth / 2;
      const offset = cardCenter - scrollCenter;
      const absOffset = Math.abs(offset);

      if (absOffset < minAbsOffset) {
        minAbsOffset = absOffset;
        closestIndex = i;
      }

      // Generous 90px spotlight deadzone: center card is 100% razor-sharp, zero blur, scale 1.0, full opacity
      const DEADZONE = 90;
      const isCenterSpotlight = absOffset <= DEADZONE;

      const effOffset = isCenterSpotlight ? 0 : (absOffset - DEADZONE) * Math.sign(offset);
      const effAbsOffset = Math.abs(effOffset);
      const effectiveRange = Math.max(200, range - DEADZONE);

      // Normalized offset for radial properties (scale, opacity, blur)
      const absNorm = Math.min(1, effAbsOffset / effectiveRange);
      const norm = Math.max(-1, Math.min(1, effOffset / effectiveRange));

      // Trajectory norm extends beyond ±1 so peripheral cards continue along the diagonal path
      const normPath = Math.max(-2.5, Math.min(2.5, effOffset / effectiveRange));

      // Sine easing for organic physical momentum matching Motion.dev
      const easeNorm = Math.sin((absNorm * Math.PI) / 2);

      const scale = isCenterSpotlight ? 1 : 1 - easeNorm * (1 - minScale);
      const blur = isCenterSpotlight ? 0 : easeNorm * maxBlur;
      const opacity = isCenterSpotlight ? 1 : 1 - easeNorm * (1 - minOpacity);
      const parallaxX = isCenterSpotlight ? 0 : -norm * maxParallaxX;
      const translateY = isCenterSpotlight ? 0 : normPath * maxTranslateY;
      const rotateZ = isCenterSpotlight ? 0 : normPath * maxRotateZ;

      const sStr = scale.toFixed(3);
      const bStr = blur <= 0.15 ? '0' : blur.toFixed(1);
      const fStr = blur <= 0.15 ? 'none' : `blur(${blur.toFixed(1)}px)`;
      const oStr = opacity.toFixed(3);
      const pStr = parallaxX.toFixed(1);
      const yStr = translateY.toFixed(1);
      const rStr = rotateZ.toFixed(2);

      const cached = lastValuesRef.current.get(child);
      if (
        !cached ||
        cached.s !== sStr ||
        cached.b !== bStr ||
        cached.f !== fStr ||
        cached.o !== oStr ||
        cached.p !== pStr ||
        cached.y !== yStr ||
        cached.r !== rStr
      ) {
        child.style.setProperty('--card-scale', sStr);
        child.style.setProperty('--card-blur', bStr);
        child.style.setProperty('--card-filter', fStr);
        child.style.setProperty('--card-opacity', oStr);
        child.style.setProperty('--media-parallax-x', pStr);
        child.style.setProperty('--card-translate-y', yStr);
        child.style.setProperty('--card-rotate-z', rStr);
        lastValuesRef.current.set(child, { s: sStr, b: bStr, f: fStr, o: oStr, p: pStr, y: yStr, r: rStr });
      }
    }

    if (closestIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = closestIndex;
      if (onActiveIndexChangeRef.current) {
        onActiveIndexChangeRef.current(closestIndex);
      }
    }
  }, [
    enabled,
    containerRef,
    maxOffsetDistance,
    minScale,
    maxBlur,
    minOpacity,
    maxParallaxX,
    maxTranslateY,
    maxRotateZ,
  ]);

  const scheduleUpdate = useCallback(() => {
    if (!enabled) return;
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      updateOffsets();
    });
  }, [enabled, updateOffsets]);

  useEffect(() => {
    if (!enabled) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Run initial offset layout
    updateOffsets();

    const handleScroll = () => {
      scheduleUpdate();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [enabled, containerRef, scheduleUpdate, updateOffsets]);

  return {
    updateOffsets,
    scheduleUpdate,
  };
}
