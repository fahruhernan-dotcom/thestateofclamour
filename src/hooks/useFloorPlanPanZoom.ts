import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseFloorPlanPanZoomOptions {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  dragThreshold?: number; // Pixels moved before considering it a drag instead of a click
}

export function useFloorPlanPanZoom(options: UseFloorPlanPanZoomOptions = {}) {
  const {
    minScale = 1.0,
    maxScale = 3.5,
    scaleStep = 0.35,
    dragThreshold = 6
  } = options;

  const [scale, setScale] = useState<number>(1.0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Drag tracking refs
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);
  const totalMovementRef = useRef<number>(0);

  // Touch tracking refs
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1.0);

  // Clamp position so the map doesn't drift away into void
  const clampPosition = useCallback((pos: { x: number; y: number }, currentScale: number) => {
    if (!containerRef.current || !contentRef.current) return pos;

    const container = containerRef.current.getBoundingClientRect();
    const contentWidth = container.width * currentScale;
    const contentHeight = container.height * currentScale;

    // Maximum pan bounds
    const maxPanX = Math.max(0, (contentWidth - container.width) / 2);
    const maxPanY = Math.max(0, (contentHeight - container.height) / 2);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, pos.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, pos.y))
    };
  }, []);

  const resetView = useCallback(() => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => {
      const next = Math.min(maxScale, Number((prev + scaleStep).toFixed(2)));
      return next;
    });
  }, [maxScale, scaleStep]);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const next = Math.max(minScale, Number((prev - scaleStep).toFixed(2)));
      if (next === minScale) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  }, [minScale, scaleStep]);

  const setZoomLevel = useCallback((targetScale: number) => {
    const clamped = Math.max(minScale, Math.min(maxScale, targetScale));
    setScale(clamped);
    if (clamped === minScale) {
      setPosition({ x: 0, y: 0 });
    }
  }, [minScale, maxScale]);

  // Handle Mouse Down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only primary button
    if (e.button !== 0) return;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
    hasDraggedRef.current = false;
    totalMovementRef.current = 0;
    setIsDragging(true);
  }, [position]);

  // Global mouse move & up listeners when dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalMovementRef.current = dist;

      if (dist > dragThreshold) {
        hasDraggedRef.current = true;
      }

      setPosition(() => {
        const nextPos = {
          x: posStartRef.current.x + dx,
          y: posStartRef.current.y + dy
        };
        return clampPosition(nextPos, scale);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, scale, clampPosition, dragThreshold]);

  // Handle Wheel Zoom with focal point at cursor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default page scroll when interacting with the canvas
      e.preventDefault();

      // Normalize deltaY (dampens large trackpad/mouse flicks)
      const rawDelta = e.deltaY;
      const normalizedDelta = Math.max(-100, Math.min(100, rawDelta));
      // Gentle linear zoom delta: capped at ±0.06 (6% scale change per notch)
      const zoomDelta = Math.max(-0.06, Math.min(0.06, -normalizedDelta * 0.0008));

      setScale(prevScale => {
        const targetScale = Math.max(minScale, Math.min(maxScale, Number((prevScale + zoomDelta).toFixed(3))));

        if (Math.abs(targetScale - prevScale) < 0.001) return prevScale;
        if (targetScale === minScale) {
          setPosition({ x: 0, y: 0 });
          return minScale;
        }

        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        setPosition(prevPos => {
          const ratio = targetScale / prevScale;
          const newX = cursorX - (cursorX - prevPos.x) * ratio;
          const newY = cursorY - (cursorY - prevPos.y) * ratio;
          return clampPosition({ x: newX, y: newY }, targetScale);
        });

        return targetScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [minScale, maxScale, clampPosition]);

  // Handle Touch Events (1 finger pan, 2 fingers pinch)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartPos = { x: 0, y: 0 };
    let touchStartPosRef = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPosRef = { ...position };
        hasDraggedRef.current = false;
        totalMovementRef.current = 0;
        setIsDragging(true);
      } else if (e.touches.length === 2) {
        // Pinch start
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialTouchDistanceRef.current = dist;
        initialScaleRef.current = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        const dx = e.touches[0].clientX - touchStartPos.x;
        const dy = e.touches[0].clientY - touchStartPos.y;
        const dist = Math.hypot(dx, dy);
        totalMovementRef.current = dist;

        if (dist > dragThreshold) {
          hasDraggedRef.current = true;
        }

        setPosition(() => {
          const nextPos = {
            x: touchStartPosRef.x + dx,
            y: touchStartPosRef.y + dy
          };
          return clampPosition(nextPos, scale);
        });
      } else if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / initialTouchDistanceRef.current;
        const newScale = Math.max(minScale, Math.min(maxScale, Number((initialScaleRef.current * factor).toFixed(2))));
        setScale(newScale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        setIsDragging(false);
        initialTouchDistanceRef.current = null;
      } else if (e.touches.length === 1) {
        initialTouchDistanceRef.current = null;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scale, position, isDragging, minScale, maxScale, clampPosition, dragThreshold]);

  // Double Click / Double Tap quick zoom toggle
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (scale > 1.2) {
      resetView();
    } else {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;
      const targetScale = 2.0;

      setScale(targetScale);
      setPosition(clampPosition({ x: -cursorX * 0.8, y: -cursorY * 0.8 }, targetScale));
    }
  }, [scale, resetView, clampPosition]);

  return {
    scale,
    position,
    isDragging,
    hasDragged: hasDraggedRef.current,
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
