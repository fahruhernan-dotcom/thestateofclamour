import React, { useRef, useEffect } from 'react';
import { EventData } from '../types';
import { HERO_CINEMATIC_BEATS } from '../config/heroTimeline';

interface Props {
  event: EventData;
}

const TOTAL_FRAMES = 360;

const getFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_frames/f_${padded}.webp`;
};

export const HeroSection: React.FC<Props> = ({ event }) => {
  const heroTrackRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posterContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isActive = true;
    let rafId: number | null = null;
    let targetProgress = 0;
    let currentFrame = 0;
    let lastRenderedFrame = -1;

    // Cache preloaded Image objects
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const loadedIndices = new Set<number>();

    // High performance aspect-ratio cover renderer
    const renderImageToCanvas = (img: HTMLImageElement) => {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
      const canvasRatio = cw / ch;
      const imgRatio = imgW / imgH;

      let dw: number, dh: number, dx: number, dy: number;

      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dw = ch * imgRatio;
        dh = ch;
        dx = (cw - dw) / 2;
        dy = 0;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const drawFrame = (frameIndex: number) => {
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
      if (idx === lastRenderedFrame) return;

      let img = images[idx];

      // If exact frame not ready yet, pick nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        let bestIdx = -1;
        let minDiff = Infinity;
        for (const loadedIdx of loadedIndices) {
          const diff = Math.abs(loadedIdx - idx);
          if (diff < minDiff) {
            minDiff = diff;
            bestIdx = loadedIdx;
          }
        }
        if (bestIdx !== -1) {
          img = images[bestIdx];
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        renderImageToCanvas(img);
        lastRenderedFrame = idx;
      }
    };

    // Resize canvas with DPR support
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastRenderedFrame = -1; // Force redraw on resize
        drawFrame(currentFrame);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Step 1: Immediately load Frame 1 (Panel 01 establishing shot)
    const initialImg = new Image();
    initialImg.src = getFramePath(0);
    initialImg.onload = () => {
      images[0] = initialImg;
      loadedIndices.add(0);
      drawFrame(0);
    };

    // Step 2: Prioritize loading next 30 frames for immediate responsiveness
    const loadRemainingFrames = () => {
      // Chunked progressive preloading to avoid bandwidth saturation
      let currentIdx = 1;
      const batchSize = 12;

      const loadNextBatch = () => {
        if (!isActive || currentIdx >= TOTAL_FRAMES) return;
        const end = Math.min(TOTAL_FRAMES, currentIdx + batchSize);

        for (let i = currentIdx; i < end; i++) {
          if (!images[i]) {
            const img = new Image();
            img.src = getFramePath(i);
            const capturedIdx = i;
            img.onload = () => {
              images[capturedIdx] = img;
              loadedIndices.add(capturedIdx);
              // If user is currently waiting on this frame, draw it immediately
              if (Math.round(currentFrame) === capturedIdx) {
                drawFrame(capturedIdx);
              }
            };
          }
        }

        currentIdx = end;
        if (currentIdx < TOTAL_FRAMES && isActive) {
          setTimeout(loadNextBatch, 25);
        }
      };

      loadNextBatch();
    };

    // Defer loading remaining frames slightly so page mount is instantaneous
    const timer = setTimeout(loadRemainingFrames, 100);

    // Step 3: High-frequency LERP Animation Loop (runs at 60Hz / 120Hz display refresh)
    const tick = () => {
      if (!isActive) return;

      const targetFrame = targetProgress * (TOTAL_FRAMES - 1);
      const diff = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.05) {
        currentFrame += diff * 0.22; // Smooth LERP interpolation
        drawFrame(currentFrame);
        rafId = requestAnimationFrame(tick);
      } else {
        currentFrame = targetFrame;
        drawFrame(currentFrame);
        rafId = null;
      }
    };

    const requestTick = () => {
      if (rafId === null && isActive) {
        rafId = requestAnimationFrame(tick);
      }
    };

    // Step 4: Scroll Listener (Computes normalized progress and typography fade)
    const onScroll = () => {
      if (!heroTrackRef.current) return;
      const rect = heroTrackRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      targetProgress = progress;
      requestTick();

      // Direct DOM typography fade at bottom
      if (posterContainerRef.current) {
        const [fadeStart, fadeEnd] = HERO_CINEMATIC_BEATS.scrollMap.typographyFade;

        if (progress <= fadeStart) {
          posterContainerRef.current.style.opacity = '1';
          posterContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
          posterContainerRef.current.style.pointerEvents = 'auto';
        } else if (progress >= fadeEnd) {
          posterContainerRef.current.style.opacity = '0';
          posterContainerRef.current.style.transform = 'translate3d(0, -24px, 0)';
          posterContainerRef.current.style.pointerEvents = 'none';
        } else {
          const ratio = (progress - fadeStart) / (fadeEnd - fadeStart);
          const opacity = (1 - ratio).toFixed(3);
          const translateY = Math.round(-24 * ratio);

          posterContainerRef.current.style.opacity = opacity;
          posterContainerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
          posterContainerRef.current.style.pointerEvents = ratio > 0.85 ? 'none' : 'auto';
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      isActive = false;
      clearTimeout(timer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
    ? `${event.venueCity} · ${event.venueName}`
    : 'BANDUNG · SECRET MONUMENT';

  return (
    <section
      ref={heroTrackRef}
      id="hero"
      className="hero-scroll-track"
      aria-label="The State of Clamour // Swear In Continental"
    >
      <div className="hero-sticky-stage">
        {/* 0. Instant Fallback Poster (Master Key Visual from ffd189ab...png, paints immediately) */}
        <img
          src="/assets/hero_scroll_poster.jpg"
          alt="The State of Clamour // Swear In Continental"
          className="hero-cinematic-poster-fallback"
          aria-hidden="true"
        />

        {/* 1. High-Performance Hardware-Composited Canvas (60/120fps Silky Smooth Scrub) */}
        <canvas
          ref={canvasRef}
          className="hero-cinematic-canvas"
          aria-hidden="true"
        />

        {/* 2. Editorial Film Vignette (Deepens borders while preserving glowing center) */}
        <div className="hero-editorial-vignette" aria-hidden="true" />

        {/* 3. Semantic H1 for SEO & Screen Readers (Zero visual overlap with embedded 3D title) */}
        <h1 className="sr-only">
          THE STATE OF CLAMOUR — SWEAR IN CONTINENTAL
        </h1>

        {/* 4. Film Poster Metadata Layout (Docks cleanly at bottom, dissolves on scroll) */}
        <div ref={posterContainerRef} className="hero-poster-container">
          <div className="hero-poster-bottom">
            <div className="hero-poster-meta">
              <span className="hero-meta-date">30 — 31 OCTOBER 2026</span>
              <span className="hero-meta-venue">{venueLabel}</span>
            </div>

            {/* Subtle Scroll Cue */}
            <div className="hero-scroll-indicator" aria-hidden="true">
              <span className="hero-scroll-cue-text">GULIR UNTUK MEMASUKI GERBANG</span>
              <span className="hero-scroll-cue-arrow">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
