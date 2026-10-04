import React, { useRef, useEffect } from 'react';
import { EventData } from '../types';
import { silenceSec2, setAudioOwner, getAudioOwner, canSec1PlayAudio, fadeVideoVolume, cancelVideoFade } from '../utils/audioCoordinator';
import { getDesktopFrame } from '../utils/mediaPreloader';
import { IS_LINEUP_TEASER_MODE } from '../data/eventData';
import { useIsMobile } from '../hooks/useIsMobile';
import { HeroSectionMobile } from './mobile/HeroSectionMobile';

interface Props {
  event: EventData;
}

const TOTAL_FRAMES = 192;

const getFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_frames/f_${padded}.webp`;
};

const HeroSectionDesktop: React.FC<Props> = ({ event }) => {

  const userInteractedRef = useRef<boolean>(false);
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

  // Section 1 Desktop Clusters
  const clusterTopLeftRef = useRef<HTMLDivElement | null>(null);
  const clusterTopRightRef = useRef<HTMLDivElement | null>(null);
  const clusterLeftMidRef = useRef<HTMLDivElement | null>(null);
  const clusterBottomRightRef = useRef<HTMLDivElement | null>(null);

  // Section 1 Mobile Layout Refs
  const mobileTopRef = useRef<HTMLDivElement | null>(null);
  const mobileBottomRef = useRef<HTMLDivElement | null>(null);

  // Audio State
  const isPlayingAudioRef = useRef(false);
  const isSectionVisibleRef = useRef(false);
  const isPlayPendingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isActive = true;
    let rafId: number | null = null;
    let targetProgress = 0;
    let smoothProgress = 0;
    let currentFrame = 0;
    let lastRenderedFrame = -1;
    let isInitialized = false;

    // Cache preloaded Image objects for Hero Canvas
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    const loadedIndices = new Set<number>();
    let mobilePosterImg: HTMLImageElement | null = null;

    // Dimensions
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // Audio Coordinator logic with smooth boundary fade
    const updateAudioVolume = (p: number, trackRect?: DOMRect | null) => {
      const video = photoImgRef.current;
      if (!video) return;

      // Always guarantee visual playback whenever Section 1 card is emerging or active
      if (p >= 0.26 && video.paused && !isPlayPendingRef.current) {
        isPlayPendingRef.current = true;
        video.play()
          .then(() => {
            isPlayPendingRef.current = false;
          })
          .catch(() => {
            isPlayPendingRef.current = false;
            video.muted = true;
            video.play().catch(() => {});
          });
      }

      if (!userInteractedRef.current) {
        if (!video.muted) video.muted = true;
        isPlayingAudioRef.current = false;
        return;
      }

      if (!canSec1PlayAudio()) {
        if (!video.muted) {
          fadeVideoVolume(video, 0, 250, () => {
            isPlayingAudioRef.current = false;
            if (getAudioOwner() === 'sec1-storytelling') setAudioOwner('none');
          });
        }
        return;
      }

      const baseVolume = 0.95;
      let targetVol = 0;

      const rect = trackRect || (heroTrackRef.current ? heroTrackRef.current.getBoundingClientRect() : null);
      const isExiting = rect ? rect.bottom < window.innerHeight : false;

      if (isExiting && rect) {
        // Boundary transition between Sec 1 and Sec 2:
        // As hero track scrolls off screen (rect.bottom from 100vh down to 15vh),
        // smoothly fade audio out to zero in direct proportion to scroll.
        const exitRange = window.innerHeight * 0.85;
        const exitProgress = Math.max(0, (rect.bottom - window.innerHeight * 0.15) / exitRange);
        const exitFade = Math.pow(exitProgress, 1.25);
        targetVol = baseVolume * 0.85 * exitFade;
      } else if (p < 0.28) {
        // Complete silence before cathedral doors entrance
        targetVol = 0;
      } else if (p < 0.44) {
        // Smooth cinematic swell as doors open & card emerges (0.28 -> 0.44)
        const inFactor = (p - 0.28) / 0.16;
        const acousticCurve = Math.sin((inFactor * Math.PI) / 2);
        targetVol = baseVolume * acousticCurve;
      } else if (p <= 0.82) {
        // Core full-immersion concert storytelling
        targetVol = baseVolume;
      } else if (p < 0.96) {
        // Noticeable, cinematic decrescendo fade-out before Section 2 arrives (0.82 -> 0.96)
        const outFactor = (0.96 - p) / 0.14;
        const acousticCurve = Math.sin((outFactor * Math.PI) / 2);
        targetVol = baseVolume * acousticCurve;
      } else {
        // Complete silence before Section 2 (The Lineup) takes over
        targetVol = 0;
      }

      if (targetVol <= 0.01) {
        if (!video.muted) {
          fadeVideoVolume(video, 0, 200, () => {
            video.muted = true;
            isPlayingAudioRef.current = false;
            if (getAudioOwner() === 'sec1-storytelling') setAudioOwner('none');
          });
        }
      } else {
        cancelVideoFade(video);
        if (video.muted) {
          silenceSec2();
          setAudioOwner('sec1-storytelling');
          video.volume = targetVol;
          video.muted = false;
          video.play().then(() => {
            isPlayingAudioRef.current = true;
            isSectionVisibleRef.current = true;
          }).catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        } else {
          video.volume = targetVol;
          isPlayingAudioRef.current = true;
          isSectionVisibleRef.current = true;
          if (video.paused) {
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
          if (getAudioOwner() !== 'sec1-storytelling') {
            setAudioOwner('sec1-storytelling');
          }
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
      const baseCardH = isMobile
        ? Math.min(Math.round(baseCardW * 1.33), Math.round(vh * 0.48))
        : Math.round(baseCardW * 1.33); // 3:4 portrait concert frame
      const baseCardLeft = (vw - baseCardW) / 2;
      const baseCardTop = (vh - baseCardH) / 2;

      // 2. Section 1 Video Card & Unmasking Expansion
      // progress < 0.34: Hidden while camera approaches and enters cathedral doors into black
      // progress 0.34 -> 0.44: Small card emerges quickly over dark atmosphere with editorial text
      // progress 0.44 -> 0.55: Swift, liquid-smooth expansion to 100vw x 100vh full-bleed (Smootherstep S-curve)
      // progress 0.55 -> 1.00: EXTENDED FULLSCREEN RUNWAY with Welcome Climax & continuous audio
      const EXP_START = 0.44;
      const EXP_END = 0.55;

      if (progress < 0.34) {
        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = '0';
          gpuCanvasRef.current.style.pointerEvents = 'none';
        }
        if (photoHairlineRef.current) {
          photoHairlineRef.current.style.opacity = '0';
        }
      } else if (progress < EXP_START) {
        // Section 1 Fades In quickly and smoothly over the dark atmosphere
        const fadeInP = Math.min(1, (progress - 0.34) / 0.08);

        if (gpuCanvasRef.current) {
          gpuCanvasRef.current.style.opacity = fadeInP.toFixed(3);
          gpuCanvasRef.current.style.left = `${baseCardLeft.toFixed(2)}px`;
          gpuCanvasRef.current.style.top = `${baseCardTop.toFixed(2)}px`;
          gpuCanvasRef.current.style.width = `${baseCardW.toFixed(2)}px`;
          gpuCanvasRef.current.style.height = `${baseCardH.toFixed(2)}px`;
          gpuCanvasRef.current.style.borderRadius = '6px';
          gpuCanvasRef.current.style.clipPath = 'none';
          gpuCanvasRef.current.style.setProperty('-webkit-clip-path', 'none');
          gpuCanvasRef.current.style.pointerEvents = fadeInP > 0.5 ? 'auto' : 'none';
          gpuCanvasRef.current.style.boxShadow = `0 0 35px rgba(220, 20, 40, ${(fadeInP * 0.40).toFixed(3)})`;
        }

        if (photoHairlineRef.current) {
          photoHairlineRef.current.style.opacity = (fadeInP * 0.75).toFixed(3);
        }
      } else if (progress <= EXP_END) {
        // Liquid-smooth expansion from centered card to 100vw x 100vh full-bleed
        const expP = (progress - EXP_START) / (EXP_END - EXP_START);
        // Ken Perlin's Smootherstep: 6t^5 - 15t^4 + 10t^3 (zero 1st & 2nd derivatives at both 0 and 1)
        const easedP = expP * expP * expP * (expP * (expP * 6 - 15) + 10);

        const curLeft = (baseCardLeft * (1 - easedP)).toFixed(2);
        const curTop = (baseCardTop * (1 - easedP)).toFixed(2);
        const curWidth = (baseCardW + (vw - baseCardW) * easedP).toFixed(2);
        const curHeight = (baseCardH + (vh - baseCardH) * easedP).toFixed(2);
        const curRadius = Math.max(0, 6 * (1 - easedP)).toFixed(2);

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

          const shadowOp = (0.40 * Math.pow(1 - easedP, 1.5)).toFixed(3);
          gpuCanvasRef.current.style.boxShadow = Number(shadowOp) > 0.005 ? `0 0 35px rgba(220, 20, 40, ${shadowOp})` : 'none';
        }

        if (photoHairlineRef.current) {
          const borderOp = Math.max(0, 0.75 * (1 - easedP * 2.0));
          photoHairlineRef.current.style.opacity = borderOp.toFixed(3);
        }
      } else {
        // EXTENDED FULLSCREEN PLATEAU (EXP_END -> 1.00)
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
        videoDimRef.current.style.opacity = '0';
      }

      // 5. Section 1 Audio State Synchronization with Video Runway & Sec 2 Boundary
      if (heroTrackRef.current) {
        const rect = heroTrackRef.current.getBoundingClientRect();
        updateAudioVolume(progress, rect);
      } else {
        updateAudioVolume(progress, null);
      }
    };

    // High performance adaptive full-bleed cinematic renderer (Zero pillarbox bars)
    const renderImageToCanvas = (
      img: HTMLImageElement,
      progress: number = 0,
      clearCanvas: boolean = true
    ) => {
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

      if (clearCanvas) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.drawImage(img, dx, dy, dw, dh);

      // Deepen to pure black underneath expanding Section 1 video
      if (progress >= 0.44) {
        const fadeRatio = Math.min(1, (progress - 0.44) / 0.10);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeRatio})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    };

    const drawFrame = (frameIndex: number, progress: number = 0) => {
      const isMobile = vw < 768;

      if (isMobile) {
        // Stage A: Pure uncropped portrait poster (progress 0.00 -> 0.12)
        if (progress <= 0.12) {
          if (mobilePosterImg && mobilePosterImg.complete && mobilePosterImg.naturalWidth > 0) {
            renderImageToCanvas(mobilePosterImg, progress, true);
            lastRenderedFrame = -1;
            return;
          }
        }

        // Stage B: Smooth cinematic crossfade into clean Frame 48 (progress 0.12 -> 0.20)
        // Frame 48 has NO text, so mobile poster fades away with zero double-text ghosting
        if (progress > 0.12 && progress < 0.20) {
          const baseImg = images[48] || images[Math.max(48, Math.round(frameIndex))];
          if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
            renderImageToCanvas(baseImg, progress, true);

            if (mobilePosterImg && mobilePosterImg.complete && mobilePosterImg.naturalWidth > 0) {
              const posterAlpha = Math.max(0, 1 - (progress - 0.12) / 0.08);
              ctx.save();
              ctx.globalAlpha = posterAlpha;
              renderImageToCanvas(mobilePosterImg, progress, false);
              ctx.restore();
            }
            lastRenderedFrame = 48;
            return;
          }
        }
      }

      // Stage C: Standard video frame sequence (Desktop: 0 -> 191; Mobile: 48 -> 191)
      const minFrame = isMobile ? 48 : 0;
      const idx = Math.max(minFrame, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
      if (idx === lastRenderedFrame && progress < 0.44) return;

      let img = images[idx];

      if (!img || !img.complete || img.naturalWidth === 0) {
        let bestIdx = -1;
        let minDiff = Infinity;
        for (const loadedIdx of loadedIndices) {
          if (isMobile && loadedIdx < 48) continue; // Never fallback to wide text frames on mobile
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
        renderImageToCanvas(img, progress, true);
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
        drawFrame(currentFrame, smoothProgress);
      }
      renderStageElements(smoothProgress, currentFrame);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Step 0: Preload mobile portrait poster if on mobile device
    if (window.innerWidth < 768) {
      const mobImg = new Image();
      mobImg.src = '/assets/hero_scroll_poster_mobile.jpg';
      mobImg.onload = () => {
        mobilePosterImg = mobImg;
        if (targetProgress === 0) {
          drawFrame(0, 0);
        }
      };
    }

    // Step 0: Sync all desktop frames already preloaded by mediaPreloader
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const preloaded = getDesktopFrame(i);
      if (preloaded && preloaded.complete && preloaded.naturalWidth > 0) {
        images[i] = preloaded;
        loadedIndices.add(i);
      }
    }

    // Step 1: Ensure Frame 1 is ready and rendered immediately
    if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
      drawFrame(0, 0);
    } else {
      const initialImg = new Image();
      initialImg.src = getFramePath(0);
      initialImg.onload = () => {
        images[0] = initialImg;
        loadedIndices.add(0);
        drawFrame(0, 0);
      };
    }

    // Step 1b: Set recap video properties and initiate playback
    const videoEl = photoImgRef.current;
    if (videoEl) {
      videoEl.defaultMuted = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('webkit-playsinline', '');
      if (!videoEl.src || !videoEl.src.includes('/assets/how2026_recap.mp4')) {
        videoEl.src = '/assets/how2026_recap.mp4';
      }
      videoEl.play().catch(() => {});
    }

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
      if (smoothProgress <= 0.22) {
        targetFrame = (smoothProgress / 0.22) * 100;
      } else if (smoothProgress <= 0.34) {
        targetFrame = 100 + ((smoothProgress - 0.22) / 0.12) * (140 - 100);
      } else if (smoothProgress <= 0.44) {
        targetFrame = 140 + ((smoothProgress - 0.34) / 0.10) * (TOTAL_FRAMES - 1 - 140);
      } else {
        targetFrame = TOTAL_FRAMES - 1;
      }

      const pDiff = targetProgress - smoothProgress;
      const fDiff = targetFrame - currentFrame;

      const pNeedsUpdate = Math.abs(pDiff) > 0.0001;
      const fNeedsUpdate = Math.abs(fDiff) > 0.04;

      if (pNeedsUpdate || fNeedsUpdate) {
        // Continuous smooth exponential damping
        smoothProgress += pDiff * 0.18;
        currentFrame += fDiff * 0.24;
        drawFrame(currentFrame, smoothProgress);
        renderStageElements(smoothProgress, currentFrame);
        rafId = requestAnimationFrame(tick);
      } else {
        smoothProgress = targetProgress;
        currentFrame = targetFrame;
        drawFrame(currentFrame, smoothProgress);
        renderStageElements(smoothProgress, currentFrame);
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

      if (!isInitialized) {
        isInitialized = true;
        smoothProgress = progress;
        if (progress <= 0.22) {
          currentFrame = (progress / 0.22) * 100;
        } else if (progress <= 0.34) {
          currentFrame = 100 + ((progress - 0.22) / 0.12) * (140 - 100);
        } else if (progress <= 0.44) {
          currentFrame = 140 + ((progress - 0.34) / 0.10) * (TOTAL_FRAMES - 1 - 140);
        } else {
          currentFrame = TOTAL_FRAMES - 1;
        }
      }

      // Synchronous scroll-based volume update (smooth fade out at Section 1 & 2 border)
      updateAudioVolume(smoothProgress, rect);

      requestTick();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Global gesture listener to unlock audio when user interacts
    const unlockOnGesture = () => {
      userInteractedRef.current = true;
      const video = photoImgRef.current;
      if (video && video.paused) {
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
      if (!heroTrackRef.current) return;
      const rect = heroTrackRef.current.getBoundingClientRect();
      updateAudioVolume(targetProgress, rect);
    };

    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec2-lineup') {
        const video = photoImgRef.current;
        if (video && !video.muted) {
          fadeVideoVolume(video, 0, 200, () => {
            video.muted = true;
            isPlayingAudioRef.current = false;
          });
        }
      }
    };

    const handleSec1Silenced = () => {
      const video = photoImgRef.current;
      if (video && !video.muted) {
        fadeVideoVolume(video, 0, 200, () => {
          video.muted = true;
          isPlayingAudioRef.current = false;
        });
      }
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });

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
    };
  }, []);

  const venueLabel = event.venueCity && event.venueName
    ? `${event.venueCity} · ${event.venueName}`
    : 'SURAKARTA · MIZU COMMONROOM';

  return (
    <section
      ref={heroTrackRef}
      id="hero"
      className="hero-scroll-track"
      aria-label="The State of Clamour // Swear In Continental"
    >
      <div className="hero-sticky-stage">
        {/* 0. Instant Fallback Poster (Master Key Visual) */}
        <picture className="hero-cinematic-poster-fallback" aria-hidden="true">
          <source media="(max-width: 768px)" srcSet="/assets/hero_scroll_poster_mobile.jpg" />
          <img
            src="/assets/hero_scroll_poster.jpg"
            alt="The State of Clamour // Swear In Continental"
            className="hero-cinematic-poster-fallback-img"
            aria-hidden="true"
          />
        </picture>

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
              src="/assets/how2026_recap.mp4"
              poster="/assets/how2026_recap_poster.jpg"
              className="storytelling-photo-img"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
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

            {/* Top-Right Cluster: MALVIN / ? */}
            <div ref={clusterTopRightRef} className="story-cluster-top-right" style={{ opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--color-gold-antique)', lineHeight: 1 }}>
                {IS_LINEUP_TEASER_MODE ? '?' : 'MALVIN'}
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

            {/* Bottom-Right Cluster: FAR / ? */}
            <div ref={clusterBottomRightRef} className="story-cluster-bottom-right" style={{ opacity: 0 }}>
              <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--color-gold-antique)', lineHeight: 1 }}>
                {IS_LINEUP_TEASER_MODE ? '?' : 'FAR'}
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
      </div>
    </section>
  );
};

export const HeroSection: React.FC<Props> = (props) => {
  const isMobile = useIsMobile();
  return isMobile ? <HeroSectionMobile {...props} /> : <HeroSectionDesktop {...props} />;
};

export default HeroSection;
