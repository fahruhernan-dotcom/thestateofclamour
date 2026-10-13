import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseFloorPlanPanZoomOptions {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  dragThreshold?: number;
}

export function useFloorPlanPanZoom(options: UseFloorPlanPanZoomOptions = {}) {
  const {
    minScale = 1.0,
    maxScale = 3.5,
    scaleStep = 0.35,
    dragThreshold = 8
  } = options;

  const [scale, setScale] = useState<number>(1.0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasDragged, setHasDragged] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Synchronized refs to avoid stale closures in stable event listeners
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scaleRef = useRef<number>(1.0);
  const hasDraggedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Sync state changes with refs
  useEffect(() => {
    posRef.current = position;
  }, [position]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  // Extended leeway pan clamping: allows corners of venue to be pulled comfortably into mobile view center
  const clampPosition = useCallback((pos: { x: number; y: number }, currentScale: number) => {
    if (!containerRef.current) return pos;

    const container = containerRef.current.getBoundingClientRect();
    const contentWidth = container.width * currentScale;
    const contentHeight = container.height * currentScale;

    // Generous leeway margin: 40% of container size so edge tables can be centered on phones
    const extraLeewayX = container.width * 0.4;
    const extraLeewayY = container.height * 0.4;

    const maxPanX = Math.max(extraLeewayX, (contentWidth - container.width) / 2 + extraLeewayX);
    const maxPanY = Math.max(extraLeewayY, (contentHeight - container.height) / 2 + extraLeewayY);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, pos.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, pos.y))
    };
  }, []);

  const resetView = useCallback(() => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    posRef.current = { x: 0, y: 0 };
    scaleRef.current = 1.0;
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => {
      const next = Math.min(maxScale, Number((prev + scaleStep).toFixed(2)));
      scaleRef.current = next;
      return next;
    });
  }, [maxScale, scaleStep]);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const next = Math.max(minScale, Number((prev - scaleStep).toFixed(2)));
      scaleRef.current = next;
      if (next === minScale) {
        setPosition({ x: 0, y: 0 });
        posRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  }, [minScale, scaleStep]);

  const setZoomLevel = useCallback((targetScale: number) => {
    const clamped = Math.max(minScale, Math.min(maxScale, targetScale));
    setScale(clamped);
    scaleRef.current = clamped;
    if (clamped === minScale) {
      setPosition({ x: 0, y: 0 });
      posRef.current = { x: 0, y: 0 };
    }
  }, [minScale, maxScale]);

  // DESKTOP: Mouse Drag Handling
  const mouseDragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mousePosStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;

    mouseDragStartRef.current = { x: e.clientX, y: e.clientY };
    mousePosStartRef.current = { ...posRef.current };
    hasDraggedRef.current = false;
    setHasDragged(false);
    isDraggingRef.current = true;
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - mouseDragStartRef.current.x;
      const dy = e.clientY - mouseDragStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > dragThreshold && !hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setHasDragged(true);
      }

      const nextPos = clampPosition(
        {
          x: mousePosStartRef.current.x + dx,
          y: mousePosStartRef.current.y + dy
        },
        scaleRef.current
      );

      posRef.current = nextPos;
      setPosition(nextPos);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, clampPosition, dragThreshold]);

  // DESKTOP: Wheel Zoom with focal point at cursor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rawDelta = e.deltaY;
      const normalizedDelta = Math.max(-100, Math.min(100, rawDelta));
      const zoomDelta = Math.max(-0.06, Math.min(0.06, -normalizedDelta * 0.0008));

      const prevScale = scaleRef.current;
      const targetScale = Math.max(minScale, Math.min(maxScale, Number((prevScale + zoomDelta).toFixed(3))));

      if (Math.abs(targetScale - prevScale) < 0.001) return;

      if (targetScale === minScale) {
        scaleRef.current = minScale;
        posRef.current = { x: 0, y: 0 };
        setScale(minScale);
        setPosition({ x: 0, y: 0 });
        return;
      }

      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;
      const ratio = targetScale / prevScale;

      const prevPos = posRef.current;
      const newX = cursorX - (cursorX - prevPos.x) * ratio;
      const newY = cursorY - (cursorY - prevPos.y) * ratio;
      const clampedPos = clampPosition({ x: newX, y: newY }, targetScale);

      scaleRef.current = targetScale;
      posRef.current = clampedPos;
      setScale(targetScale);
      setPosition(clampedPos);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [minScale, maxScale, clampPosition]);

  // MOBILE: Touch Events (1-finger pan, 2-finger pinch zoom with focal point, tap detection)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartClient = { x: 0, y: 0 };
    let touchStartPos = { x: 0, y: 0 };
    let initialPinchDist: number | null = null;
    let initialPinchScale = 1.0;
    let initialPinchFocal = { x: 0, y: 0 };
    let initialPinchPos = { x: 0, y: 0 };
    let lastTapTimestamp = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartClient = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPos = { ...posRef.current };
        hasDraggedRef.current = false;
        setHasDragged(false);
        isDraggingRef.current = true;
        setIsDragging(true);
        initialPinchDist = null;
      } else if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchScale = scaleRef.current;

        const rect = container.getBoundingClientRect();
        initialPinchFocal = {
          x: (t1.clientX + t2.clientX) / 2 - rect.left - rect.width / 2,
          y: (t1.clientY + t2.clientY) / 2 - rect.top - rect.height / 2
        };
        initialPinchPos = { ...posRef.current };
        hasDraggedRef.current = true;
        setHasDragged(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // 1 Finger Pan: Move canvas freely in all zoom levels
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - touchStartClient.x;
        const dy = e.touches[0].clientY - touchStartClient.y;
        const dist = Math.hypot(dx, dy);

        if (dist > dragThreshold && !hasDraggedRef.current) {
          hasDraggedRef.current = true;
          setHasDragged(true);
        }

        e.preventDefault();

        const nextPos = clampPosition(
          {
            x: touchStartPos.x + dx,
            y: touchStartPos.y + dy
          },
          scaleRef.current
        );

        posRef.current = nextPos;
        setPosition(nextPos);
      }
      // 2 Fingers Pinch to Zoom with Focal Point Center
      else if (e.touches.length === 2 && initialPinchDist !== null && initialPinchDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = currentDist / initialPinchDist;
        const targetScale = Math.max(minScale, Math.min(maxScale, Number((initialPinchScale * factor).toFixed(2))));

        const ratio = targetScale / initialPinchScale;
        const focalX = initialPinchFocal.x;
        const focalY = initialPinchFocal.y;
        const newX = focalX - (focalX - initialPinchPos.x) * ratio;
        const newY = focalY - (focalY - initialPinchPos.y) * ratio;

        const clampedPos = clampPosition({ x: newX, y: newY }, targetScale);

        scaleRef.current = targetScale;
        posRef.current = clampedPos;
        setScale(targetScale);
        setPosition(clampedPos);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDraggingRef.current = false;
        setIsDragging(false);
        initialPinchDist = null;

        // Double-tap zoom toggle on touch screens (< 300ms without dragging)
        const now = Date.now();
        if (now - lastTapTimestamp < 300 && !hasDraggedRef.current) {
          if (scaleRef.current > 1.2) {
            resetView();
          } else {
            const targetScale = 2.0;
            scaleRef.current = targetScale;
            setScale(targetScale);
          }
          lastTapTimestamp = 0;
        } else {
          lastTapTimestamp = now;
        }
      } else if (e.touches.length === 1) {
        // Switch back to 1 finger pan smoothly
        touchStartClient = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPos = { ...posRef.current };
        initialPinchDist = null;
        isDraggingRef.current = true;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [clampPosition, minScale, maxScale, dragThreshold, resetView]);

  // Double Click / Double Tap quick zoom toggle
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (scaleRef.current > 1.2) {
      resetView();
    } else {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;
      const targetScale = 2.0;

      const clampedPos = clampPosition({ x: -cursorX * 0.8, y: -cursorY * 0.8 }, targetScale);
      scaleRef.current = targetScale;
      posRef.current = clampedPos;
      setScale(targetScale);
      setPosition(clampedPos);
    }
  }, [resetView, clampPosition]);

  return {
    scale,
    position,
    isDragging,
    hasDragged,
    containerRef,
    contentRef,
    handleMouseDown,
    handleDoubleClick,
    zoomIn,
    zoomOut,
    setZoomLevel,
    resetView
  };
}
