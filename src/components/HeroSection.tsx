import React, { useRef, useEffect, useCallback } from 'react';
import { EventData } from '../types';
import { silenceSec1, silenceSec2, setAudioOwner, getAudioOwner, canSec1PlayAudio } from '../utils/audioCoordinator';
import { getCachedVideoUrl } from '../utils/mediaPreloader';

interface Props {
  event: EventData;
  onExploreGuests?: () => void;
}

const TOTAL_FRAMES = 192;

const getFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_frames/f_${padded}.webp`;
};

export const HeroSection: React.FC<Props> = ({ event, onExploreGuests }) => {
  const heroTrackRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroPosterContainerRef = useRef<HTMLDivElement | null>(null);

  // Section 1 Direct DOM Refs
  const gpuCanvasRef = useRef<HTMLDivElement | null>(null);
  const photoImgRef = useRef<HTMLVideoElement | null>(null);
  const photoHairlineRef = useRef<HTMLDivElement | null>(null);
  const photoVignetteRef = useRef<HTMLDivElement | null>(null);
  const welcomeOverlayRef = useRef<HTMLDivElement | null>(null);
  const stageGlowRef = useRef<HTMLDivElement | null>(null);
  const bgAmbientRef = useRef<HTMLDivElement | null>(null);
  const videoDimRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);

  // Section 1 Desktop Clusters
  const clusterTopLeftRef = useRef<HTMLDivElement | null>(null);
  const clusterTopRightRef = useRef<HTMLDivElement | null>(null);
  const clusterLeftMidRef = useRef<HTMLDivElement | null>(null);
  const clusterBottomRightRef = useRef<HTMLDivElement | null>(null);

  // Section 1 Mobile Layout Refs
  const mobileTopRef = useRef<HTMLDivElement | null>(null);
  const mobileCueRef = useRef<HTMLDivElement | null>(null);
  const mobileBottomRef = useRef<HTMLDivElement | null>(null);

  // Audio State
  const isPlayingAudioRef = useRef(false);
  const isSectionVisibleRef = useRef(false);

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

    // Cache preloaded Image objects for Hero Canvas
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const loadedIndices = new Set<number>();

    // Dimensions
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // Audio Coordinator logic
    const checkAudioPlayback = (inView: boolean) => {
      const video = photoImgRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
      }

      if (inView && canSec1PlayAudio()) {
        silenceSec2();
        setAudioOwner('sec1-storytelling');
        video.volume = 0.95;
        video.muted = false;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => { isPlayingAudioRef.current = true; })
            .catch(() => {
              video.muted = true;
              isPlayingAudioRef.current = false;
              video.play().catch(() => {});
            });
        }
      } else {
        video.muted = true;
        isPlayingAudioRef.current = false;
        if (getAudioOwner() === 'sec1-storytelling') {
          setAudioOwner('none');
        }
      }
    };

    // Unified Stage Animation Choreography (60Hz / 120Hz display refresh)
    const renderStageElements = (progress: number, _frame: number) => {
      // 1. Initial Hero Poster Typography Dissolve (0.00 -> 0.14)
      if (heroPosterContainerRef.current) {
        const heroPosterOp = Math.max(0, 1 - progress / 0.12);
        const heroPosterY = Math.round(-50 * (progress / 0.12));
        heroPosterContainerRef.current.style.opacity = heroPosterOp.toFixed(3);
        heroPosterContainerRef.current.style.transform = `translate3d(0, ${heroPosterY}px, 0)`;
        heroPosterContainerRef.current.style.pointerEvents = heroPosterOp > 0.1 ? 'auto' : 'none';
      }

      // Base card dimensions for Section 1 (centered editorial concert card)
      const isMobile = vw < 768;
      const baseCardW = isMobile ? Math.min(vw * 0.84, 380) : Math.min(vw * 0.44, 480);
      const baseCardH = Math.round(baseCardW * 1.33); // 3:4 portrait concert frame
      const baseCardLeft = Math.round((vw - baseCardW) / 2);
      const baseCardTop = Math.round((vh - baseCardH) / 2);

      // 2. Section 1 Video Card & Unmasking Expansion
      // progress < 0.34: Hidden while camera approaches and enters cathedral doors into black
      // progress 0.34 -> 0.44: Small card emerges quickly over dark atmosphere with editorial text
      // progress 0.44 -> 0.54: Swift, smooth expansion to 100vw x 100vh full-bleed
      // progress 0.54 -> 1.00: EXTENDED FULLSCREEN RUNWAY (46% of total track) with Welcome Climax & continuous audio
      if (progress < 0.34) {
        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = '0';
          gpuCanvasRef.current.style.pointerEvents = 'none';
        }
        if (photoHairlineRef.current) {
          photoHairlineRef.current.style.opacity = '0';
        }
      } else if (progress < 0.44) {
        // Section 1 Fades In quickly and smoothly over the dark atmosphere
        const fadeInP = Math.min(1, (progress - 0.34) / 0.08);

        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = fadeInP.toFixed(3);
          gpuCanvasRef.current.style.left = `${baseCardLeft}px`;
          gpuCanvasRef.current.style.top = `${baseCardTop}px`;
          gpuCanvasRef.current.style.width = `${baseCardW}px`;
          gpuCanvasRef.current.style.height = `${baseCardH}px`;
          gpuCanvasRef.current.style.borderRadius = '6px';
          gpuCanvasRef.current.style.clipPath = 'none';
          gpuCanvasRef.current.style.setProperty('-webkit-clip-path', 'none');
          gpuCanvasRef.current.style.pointerEvents = fadeInP > 0.5 ? 'auto' : 'none';
          gpuCanvasRef.current.style.boxShadow = `0 0 40px rgba(220, 20, 40, ${(fadeInP * 0.45).toFixed(3)})`;
        }

        if (photoHairlineRef.current) {
          photoHairlineRef.current.style.opacity = (fadeInP * 0.75).toFixed(3);
        }
      } else if (progress <= 0.54) {
        // Smoothly and swiftly expand from centered card to 100vw x 100vh full-bleed
        const expP = (progress - 0.44) / 0.10;
        const easedP = Math.pow(expP, 1.25);

        const curLeft = Math.round(baseCardLeft * (1 - easedP));
        const curTop = Math.round(baseCardTop * (1 - easedP));
        const curWidth = Math.round(baseCardW + (vw - baseCardW) * easedP);
        const curHeight = Math.round(baseCardH + (vh - baseCardH) * easedP);
        const curRadius = Math.max(0, Math.round(6 * (1 - easedP)));

        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = '1';
          gpuCanvasRef.current.style.left = `${curLeft}px`;
          gpuCanvasRef.current.style.top = `${curTop}px`;
          gpuCanvasRef.current.style.width = `${curWidth}px`;
          gpuCanvasRef.current.style.height = `${curHeight}px`;
          gpuCanvasRef.current.style.borderRadius = `${curRadius}px`;
          gpuCanvasRef.current.style.clipPath = 'none';
          gpuCanvasRef.current.style.setProperty('-webkit-clip-path', 'none');
          gpuCanvasRef.current.style.pointerEvents = 'auto';

          const shadowOp = Math.max(0, 0.45 * (1 - expP * 2));
          gpuCanvasRef.current.style.boxShadow = shadowOp > 0 ? `0 0 35px rgba(220, 20, 40, ${shadowOp.toFixed(3)})` : 'none';
        }

        if (photoHairlineRef.current) {
          const borderOp = Math.max(0, 0.75 * (1 - expP * 2.5));
          photoHairlineRef.current.style.opacity = borderOp.toFixed(3);
        }
      } else {
        // EXTENDED FULLSCREEN PLATEAU (0.54 -> 1.00)
        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = '1';
          gpuCanvasRef.current.style.left = '0px';
          gpuCanvasRef.current.style.top = '0px';
          gpuCanvasRef.current.style.width = '100vw';
          gpuCanvasRef.current.style.height = '100vh';
          gpuCanvasRef.current.style.borderRadius = '0px';
          gpuCanvasRef.current.style.clipPath = 'none';
          gpuCanvasRef.current.style.setProperty('-webkit-clip-path', 'none');
          gpuCanvasRef.current.style.pointerEvents = 'auto';
          gpuCanvasRef.current.style.boxShadow = 'none';
        }
        if (photoHairlineRef.current) {
          photoHairlineRef.current.style.opacity = '0';
        }
      }

      // Camera push-in scale for video
      if (photoImgRef.current && progress >= 0.34) {
        const vidProgress = Math.max(0, (progress - 0.34) / 0.66);
        const scaleVal = (1 + 0.05 * Math.pow(vidProgress, 1.2)).toFixed(4);
        photoImgRef.current.style.transform = `scale(${scaleVal}) translateZ(0)`;
      }

      // 3. Section 1 Editorial Typography (THE GUESTS, MALVIN, FAR)
      // Fades in alongside the small card (0.34 -> 0.44), drifts & dissolves during expansion (0.44 -> 0.52)
      let sec1TextOpacity = 0;
      let expRatio = 0;

      if (progress < 0.34) {
        sec1TextOpacity = 0;
      } else if (progress < 0.44) {
        sec1TextOpacity = Math.min(1, (progress - 0.34) / 0.08);
      } else if (progress <= 0.52) {
        expRatio = (progress - 0.44) / 0.08;
        sec1TextOpacity = Math.max(0, 1 - expRatio * 1.4);
      } else {
        sec1TextOpacity = 0;
      }

      const drift1X = Math.round(-50 * expRatio);
      const drift1Y = Math.round(-30 * expRatio);
      const rot1 = (-1.5 * expRatio).toFixed(2);

      const drift2X = Math.round(55 * expRatio);
      const drift2Y = Math.round(-25 * expRatio);
      const rot2 = (1.8 * expRatio).toFixed(2);

      const drift3X = Math.round(-55 * expRatio);
      const drift4X = Math.round(55 * expRatio);
      const drift4Y = Math.round(30 * expRatio);
      const rot4 = (1.5 * expRatio).toFixed(2);

      if (clusterTopLeftRef.current) {
        clusterTopLeftRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        clusterTopLeftRef.current.style.transform = `translate3d(${drift1X}px, ${drift1Y}px, 0) rotate(${rot1}deg)`;
        clusterTopLeftRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }
      if (clusterTopRightRef.current) {
        clusterTopRightRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        clusterTopRightRef.current.style.transform = `translate3d(${drift2X}px, ${drift2Y}px, 0) rotate(${rot2}deg)`;
        clusterTopRightRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }
      if (clusterLeftMidRef.current) {
        clusterLeftMidRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        clusterLeftMidRef.current.style.transform = `translate3d(${drift3X}px, -50%, 0)`;
      }
      if (clusterBottomRightRef.current) {
        clusterBottomRightRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        clusterBottomRightRef.current.style.transform = `translate3d(${drift4X}px, ${drift4Y}px, 0) rotate(${rot4}deg)`;
        clusterBottomRightRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = (sec1TextOpacity * (1 - expRatio * 1.5)).toFixed(3);
      }

      // Mobile Editorial
      if (mobileTopRef.current) {
        mobileTopRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        mobileTopRef.current.style.transform = `translate3d(0, ${drift1Y}px, 0)`;
      }
      if (mobileBottomRef.current) {
        mobileBottomRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        mobileBottomRef.current.style.transform = `translate3d(0, ${drift4Y}px, 0)`;
        mobileBottomRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }

      // Ambient glows
      if (bgAmbientRef.current) {
        const ambientOp = Math.min(1, Math.max(0, (progress - 0.34) * 3.0));
        bgAmbientRef.current.style.opacity = ambientOp.toFixed(3);
      }
      if (stageGlowRef.current) {
        const glowOp = Math.min(1, Math.max(0, (progress - 0.38) * 2.5));
        stageGlowRef.current.style.opacity = glowOp.toFixed(3);
      }

      // 4. Welcome Assembly Climax Reveal (Inside the Fullscreen Runway)
      // Reveal at 0.58 -> 0.66, holds steady 0.66 -> 0.92, soft exit at 0.92 -> 0.98
      let welcomeOpacity = 0;
      let welcomeTranslateY = 24;

      if (progress < 0.58) {
        welcomeOpacity = 0;
        welcomeTranslateY = 24;
      } else if (progress < 0.66) {
        const wp = (progress - 0.58) / 0.08;
        welcomeOpacity = wp;
        welcomeTranslateY = Math.round(24 * (1 - Math.pow(wp, 0.8)));
      } else if (progress <= 0.92) {
        welcomeOpacity = 1;
        welcomeTranslateY = 0;
      } else if (progress <= 0.98) {
        const fadeP = (progress - 0.92) / 0.06;
        welcomeOpacity = Math.max(0, 1 - fadeP);
        welcomeTranslateY = Math.round(-16 * fadeP);
      } else {
        welcomeOpacity = 0;
        welcomeTranslateY = -16;
      }

      if (welcomeOverlayRef.current) {
        welcomeOverlayRef.current.style.opacity = welcomeOpacity.toFixed(3);
        welcomeOverlayRef.current.style.transform = `translate3d(0, ${welcomeTranslateY}px, 0)`;
        welcomeOverlayRef.current.style.pointerEvents = welcomeOpacity > 0.4 ? 'auto' : 'none';
      }

      if (videoDimRef.current) {
        videoDimRef.current.style.opacity = (welcomeOpacity * 0.55).toFixed(3);
      }

      // 5. Section 1 Audio State Synchronization (Continuously active through Section 1)
      const isSec1Active = progress >= 0.34 && progress <= 1.00 && canSec1PlayAudio();
      if (isSec1Active !== isSectionVisibleRef.current) {
        isSectionVisibleRef.current = isSec1Active;
        checkAudioPlayback(isSec1Active);
      }
    };

    // High performance adaptive full-bleed cinematic renderer (Zero pillarbox bars)
    const renderImageToCanvas = (img: HTMLImageElement, progress: number = 0) => {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const imgW = img.naturalWidth || 1280;
      const imgH = img.naturalHeight || 720;
      const canvasRatio = cw / ch;
      const imgRatio = imgW / imgH;

      let dw: number, dh: number, dx: number, dy: number;

      // Immersive Full-Bleed Framing: Fills 100% of viewport without black side bars
      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        const overflowY = dh - ch;
        // Dynamic vertical anchor:
        // At progress=0, anchor at 10% from top so spire & "THE STATE OF CLAMOR" have headroom and are not cut off.
        // As scroll approaches the red gate, smoothly shift vertical focus towards the doorway (0.50).
        const verticalBias = 0.10 + 0.40 * Math.min(1.0, progress * 2.2);
        dx = 0;
        dy = -overflowY * verticalBias;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        const overflowX = dw - cw;
        dx = -overflowX * 0.5;
        dy = 0;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);

      // Deepen to pure black underneath expanding Section 1 video
      if (progress >= 0.44) {
        const fadeRatio = Math.min(1, (progress - 0.44) / 0.10);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeRatio})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    };

    const drawFrame = (frameIndex: number, progress: number = 0) => {
      const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
      if (idx === lastRenderedFrame && progress < 0.44) return;

      let img = images[idx];

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
        renderImageToCanvas(img, progress);
        lastRenderedFrame = idx;
      }
    };

    // Resize canvas with DPR support
    const resizeCanvas = () => {
      if (!canvas) return;
      vw = window.innerWidth;
      vh = window.innerHeight;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastRenderedFrame = -1;
        drawFrame(currentFrame, targetProgress);
      }
      renderStageElements(targetProgress, currentFrame);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Step 1: Immediately load Frame 1 (establishing shot)
    const initialImg = new Image();
    initialImg.src = getFramePath(0);
    initialImg.onload = () => {
      images[0] = initialImg;
      loadedIndices.add(0);
      drawFrame(0, 0);
    };

    // Step 2: Progressive preloading of all 122 frames
    const loadRemainingFrames = () => {
      let currentIdx = 1;
      const batchSize = 10;

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
              if (Math.round(currentFrame) === capturedIdx) {
                drawFrame(capturedIdx, targetProgress);
              }
            };
          }
        }

        currentIdx = end;
        if (currentIdx < TOTAL_FRAMES && isActive) {
          setTimeout(loadNextBatch, 20);
        }
      };

      loadNextBatch();
    };

    const timer = setTimeout(loadRemainingFrames, 80);

    // Animation Tick Loop
    const tick = () => {
      if (!isActive) return;

      // Pacing mapping with new cinematic video (192 frames):
      // 0.00 -> 0.22: Frames 0 -> 100 (Glide down avenue towards cathedral, doors open)
      // 0.22 -> 0.34: Frames 100 -> 140 (Camera flies through doors into red mist, mist dissolves into darkness)
      // 0.34 -> 0.44: Frames 140 -> 191 (Pitch black background with subtle embers, Section 1 card emerges)
      // > 0.44: Frame 191 locked (Embers in darkness, Section 1 expands to fullscreen and holds)
      let targetFrame: number;
      if (targetProgress <= 0.22) {
        targetFrame = (targetProgress / 0.22) * 100;
      } else if (targetProgress <= 0.34) {
        targetFrame = 100 + ((targetProgress - 0.22) / 0.12) * (140 - 100);
      } else if (targetProgress <= 0.44) {
        targetFrame = 140 + ((targetProgress - 0.34) / 0.10) * (TOTAL_FRAMES - 1 - 140);
      } else {
        targetFrame = TOTAL_FRAMES - 1;
      }

      const diff = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.05) {
        currentFrame += diff * 0.22;
        drawFrame(currentFrame, targetProgress);
        renderStageElements(targetProgress, currentFrame);
        rafId = requestAnimationFrame(tick);
      } else {
        currentFrame = targetFrame;
        drawFrame(currentFrame, targetProgress);
        renderStageElements(targetProgress, currentFrame);
        rafId = null;
      }
    };

    const requestTick = () => {
      if (rafId === null && isActive) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      if (!heroTrackRef.current) return;
      const rect = heroTrackRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      targetProgress = progress;
      requestTick();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Global gesture listener to unlock audio when user interacts
    const unlockOnGesture = () => {
      const video = photoImgRef.current;
      if (video && isSectionVisibleRef.current && canSec1PlayAudio()) {
        silenceSec2();
        setAudioOwner('sec1-storytelling');
        video.volume = 0.95;
        video.muted = false;
        video.play()
          .then(() => { isPlayingAudioRef.current = true; })
          .catch(() => {});
      }
    };

    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec2-lineup') {
        const video = photoImgRef.current;
        if (video) video.muted = true;
        isPlayingAudioRef.current = false;
      }
    };

    const handleSec1Silenced = () => {
      const video = photoImgRef.current;
      if (video) video.muted = true;
      isPlayingAudioRef.current = false;
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });
    window.addEventListener('wheel', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });

    return () => {
      isActive = false;
      clearTimeout(timer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec1-silenced', handleSec1Silenced);
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
      window.removeEventListener('wheel', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };
  }, []);

  const handleLineupScroll = useCallback(() => {
    silenceSec1();
    isPlayingAudioRef.current = false;
    if (onExploreGuests) {
      onExploreGuests();
    } else {
      const el = document.getElementById('lineup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onExploreGuests]);

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
      {/* Anchor target for #the-guests linking */}
      <div id="the-guests" style={{ position: 'absolute', top: '38%', pointerEvents: 'none' }} />

      <div className="hero-sticky-stage">
        {/* 0. Instant Fallback Poster (Master Key Visual) */}
        <img
          src="/assets/hero_scroll_poster.jpg"
          alt="The State of Clamour // Swear In Continental"
          className="hero-cinematic-poster-fallback"
          aria-hidden="true"
        />

        {/* 1. Hardware-Composited Hero Canvas (Frames 1 -> 122) */}
        <canvas
          ref={canvasRef}
          className="hero-cinematic-canvas"
          aria-hidden="true"
        />

        {/* 2. Editorial Film Vignette for Hero */}
        <div className="hero-editorial-vignette" aria-hidden="true" />

        {/* 3. Semantic H1 for SEO */}
        <h1 className="sr-only">
          THE STATE OF CLAMOUR — SWEAR IN CONTINENTAL
        </h1>

        {/* 4. Initial Hero Poster Metadata (Dissolves between 0.00 -> 0.18) */}
        <div ref={heroPosterContainerRef} className="hero-poster-container">
          <div className="hero-poster-bottom">
            <div className="hero-poster-meta">
              <span className="hero-meta-date">30 — 31 OCTOBER 2026</span>
              <span className="hero-meta-venue">{venueLabel}</span>
            </div>

            <div className="hero-scroll-indicator" aria-hidden="true">
              <span className="hero-scroll-cue-text">GULIR UNTUK MEMASUKI GERBANG</span>
              <span className="hero-scroll-cue-arrow">↓</span>
            </div>
          </div>
        </div>

        {/* 5. Section 1 Ambient Background & Volumetric Stage Glow */}
        <div ref={bgAmbientRef} className="storytelling-bg-ambient" style={{ opacity: 0 }} />
        <div ref={stageGlowRef} className="storytelling-stage-glow" style={{ opacity: 0 }} />

        {/* 6. Section 1 GPU-Accelerated Unmasking Canvas with Video */}
        <div ref={gpuCanvasRef} className="storytelling-gpu-canvas" style={{ opacity: 0 }}>
          <div className="storytelling-photo-frame">
            <video
              ref={photoImgRef}
              src={getCachedVideoUrl('/assets/how2026_recap.mp4')}
              poster="/assets/how2026_recap_poster.jpg"
              className="storytelling-photo-img"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onEnded={() => {
                if (photoImgRef.current) {
                  photoImgRef.current.currentTime = 0;
                  photoImgRef.current.play().catch(() => {});
                }
              }}
            />

            {/* Cinematic Video Dim Overlay */}
            <div ref={videoDimRef} className="storytelling-video-dim" style={{ opacity: 0 }} />

            {/* Cinematic Radial Vignette & Edge Atmosphere */}
            <div ref={photoVignetteRef} className="storytelling-photo-vignette" />

            {/* Initial Frame Gold Hairline */}
            <div ref={photoHairlineRef} className="storytelling-photo-hairline" />
          </div>
        </div>

        {/* 7. Section 1 Editorial Typography (Desktop & Tablet) */}
        <div className="storytelling-editorial-layer story-desktop-only">
          <div className="storytelling-editorial-bounds">
            {/* Top-Left Cluster: THE GUESTS */}
            <div ref={clusterTopLeftRef} className="story-cluster-top-left" style={{ opacity: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-monumental)', fontSize: '1.65rem', letterSpacing: '0.18em', fontWeight: 600, color: 'var(--color-ivory)', textTransform: 'uppercase', lineHeight: 1.1 }}>
                THE GUESTS
              </h2>
              <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--color-muted)', marginTop: '0.35rem', letterSpacing: '0.04em' }}>
                The monumental silence breaks into nocturnal sound.
              </p>
              <div style={{ marginTop: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.22em', color: 'var(--color-ivory)', textTransform: 'uppercase' }}>
                30 — 31 OKTOBER 2026
              </div>
            </div>

            {/* Top-Right Cluster: MALVIN */}
            <div ref={clusterTopRightRef} className="story-cluster-top-right" style={{ opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--color-gold-antique)', lineHeight: 1 }}>
                MALVIN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ivory)' }}>
                <span>30 OKTOBER</span>
                <span style={{ color: 'var(--color-oxblood)' }}>·</span>
                <span style={{ color: 'var(--color-gold-antique)' }}>22:00 WIB</span>
              </div>
              <div style={{ marginTop: '0.35rem', fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.24em', color: 'var(--color-crimson)', textTransform: 'uppercase', fontWeight: 600 }}>
                MIZU COMMONROOM
              </div>
            </div>

            {/* Left-Mid Cluster: HOUSE OF WITNESSES */}
            <div ref={clusterLeftMidRef} className="story-cluster-left-mid" style={{ opacity: 0 }}>
              <div style={{ width: '1px', height: '2.5rem', backgroundColor: 'rgba(197, 168, 105, 0.25)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-monumental)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.32em',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                HOUSE OF WITNESSES · PURWOSARI
              </span>
            </div>

            {/* Bottom-Right Cluster: FAR */}
            <div ref={clusterBottomRightRef} className="story-cluster-bottom-right" style={{ opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--color-gold-antique)', lineHeight: 1 }}>
                FAR
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ivory)' }}>
                <span>31 OKTOBER</span>
                <span style={{ color: 'var(--color-oxblood)' }}>·</span>
                <span style={{ color: 'var(--color-gold-antique)' }}>23:30 WIB</span>
              </div>
              <div style={{ marginTop: '0.35rem', fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.24em', color: 'var(--color-crimson)', textTransform: 'uppercase', fontWeight: 600 }}>
                MIZU COMMONROOM
              </div>
            </div>
          </div>
        </div>

        {/* 8. Section 1 Mobile Layout */}
        <div className="storytelling-mobile-layer story-mobile-only">
          <div ref={mobileTopRef} className="story-mobile-top-editorial" style={{ opacity: 0 }}>
            <h2 className="story-mobile-monument-title text-gold-metallic">
              <span className="story-mobile-title-line">THE</span>
              <span className="story-mobile-title-line">GUESTS</span>
            </h2>
            <div className="story-mobile-sub-venue-block">
              <span className="story-mobile-sub-line">SWEAR IN CONTINENTAL</span>
              <span className="story-mobile-sub-line">MIZU COMMONROOM</span>
            </div>
          </div>

          <div ref={mobileBottomRef} className="story-mobile-bottom-editorial" style={{ opacity: 0 }}>
            <div
              ref={mobileCueRef}
              className="story-mobile-enter-cue"
              onClick={handleLineupScroll}
              role="button"
              tabIndex={0}
              aria-label="Enter The Guests"
            >
              <span className="story-mobile-cue-text">ENTER THE GUESTS</span>
              <span className="story-mobile-cue-arrow">↓</span>
            </div>

            <div className="story-mobile-horizontal-divider" />

            <div className="story-mobile-schedule-grid">
              <div className="story-mobile-schedule-col text-left">
                <span className="schedule-date-tag">30 OCT</span>
                <span className="schedule-artist-name">MALVIN</span>
                <span className="schedule-time-tag">22:00</span>
                <span className="schedule-venue-tag">MIZU</span>
              </div>

              <div className="story-mobile-schedule-col text-right">
                <span className="schedule-date-tag">31 OCT</span>
                <span className="schedule-artist-name">FAR</span>
                <span className="schedule-time-tag">23:30</span>
                <span className="schedule-venue-tag">MIZU</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Climax Arrival Overlay: "WELCOME TO THE ASSEMBLY" */}
        <div ref={welcomeOverlayRef} className="storytelling-arrival-overlay" style={{ opacity: 0 }}>
          <div className="story-welcome-content">
            <h2 className="story-welcome-title">
              WELCOME TO<br />THE ASSEMBLY
            </h2>
            <div className="story-welcome-divider" />
          </div>
        </div>

        {/* 10. Scroll Cue (Desktop) */}
        <div ref={scrollCueRef} className="storytelling-scroll-cue story-desktop-only" style={{ opacity: 0 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.35em', color: 'rgba(197, 168, 105, 0.85)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            GULIR UNTUK MELANGKAH MASUK KE PERTEMUAN
          </span>
          <div className="storytelling-scroll-cue-line" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
