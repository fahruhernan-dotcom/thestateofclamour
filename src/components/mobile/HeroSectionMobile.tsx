import React, { useRef, useEffect } from 'react';
import { EventData } from '../../types';
import { silenceSec2, setAudioOwner, getAudioOwner, canSec1PlayAudio, fadeVideoVolume, cancelVideoFade } from '../../utils/audioCoordinator';
import { getMobileFrame } from '../../utils/mediaPreloader';

interface Props {
  event: EventData;
}

const TOTAL_MOBILE_FRAMES = 84;

const getMobileFramePath = (index: number): string => {
  const frameNum = Math.max(1, Math.min(TOTAL_MOBILE_FRAMES, index + 1));
  const padded = String(frameNum).padStart(3, '0');
  return `/assets/hero_mobile_frames/mf_${padded}.jpg`;
};

export const HeroSectionMobile: React.FC<Props> = ({ event }) => {

  const trackRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial poster metadata ref
  const initialMetaRef = useRef<HTMLDivElement | null>(null);

  // Section 1 card & overlays
  const bgAmbientRef = useRef<HTMLDivElement | null>(null);
  const stageGlowRef = useRef<HTMLDivElement | null>(null);

  const gpuCanvasRef = useRef<HTMLDivElement | null>(null);
  const recapVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoDimRef = useRef<HTMLDivElement | null>(null);
  const photoHairlineRef = useRef<HTMLDivElement | null>(null);

  const topEditorialRef = useRef<HTMLDivElement | null>(null);
  const bottomEditorialRef = useRef<HTMLDivElement | null>(null);
  const climaxOverlayRef = useRef<HTMLDivElement | null>(null);

  const isAudioActiveRef = useRef<boolean>(false);
  const isSectionVisibleRef = useRef<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);
  const isPlayPendingRef = useRef<boolean>(false);


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

    // Viewport dimensions
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    // Frame cache
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_MOBILE_FRAMES).fill(null);
    const loadedIndices = new Set<number>();

    const recapVideo = recapVideoRef.current;
    if (recapVideo) {
      // Force mobile Safari & WebKit autoplay attributes
      recapVideo.defaultMuted = true;
      recapVideo.muted = true;
      recapVideo.playsInline = true;
      recapVideo.setAttribute('playsinline', '');
      recapVideo.setAttribute('webkit-playsinline', '');
      if (!recapVideo.src || !recapVideo.src.includes('/assets/how2026_recap.mp4')) {
        recapVideo.src = '/assets/how2026_recap.mp4';
      }
      recapVideo.play().catch(() => {});
    }

    const updateAudioVolume = (p: number, trackRect?: DOMRect | null) => {
      if (!recapVideo) return;

      // Always guarantee visual playback whenever Section 1 card is emerging or active
      if (p >= 0.26 && recapVideo.paused && !isPlayPendingRef.current) {
        isPlayPendingRef.current = true;
        recapVideo.play()
          .then(() => {
            isPlayPendingRef.current = false;
          })
          .catch(() => {
            isPlayPendingRef.current = false;
            recapVideo.muted = true;
            recapVideo.play().catch(() => {});
          });
      }

      if (!userInteractedRef.current) {
        if (!recapVideo.muted) recapVideo.muted = true;
        isAudioActiveRef.current = false;
        return;
      }

      if (!canSec1PlayAudio()) {
        if (!recapVideo.muted) {
          fadeVideoVolume(recapVideo, 0, 250, () => {
            isAudioActiveRef.current = false;
            if (getAudioOwner() === 'sec1-storytelling') setAudioOwner('none');
          });
        }
        return;
      }

      const baseVolume = 0.92;
      let targetVol = 0;

      const rect = trackRect || (trackRef.current ? trackRef.current.getBoundingClientRect() : null);
      const isExiting = rect ? rect.bottom < window.innerHeight : false;

      if (isExiting && rect) {
        // Boundary transition: smoothly fade audio out to zero if track is exiting viewport
        const exitRange = window.innerHeight * 0.85;
        const exitProgress = Math.max(0, (rect.bottom - window.innerHeight * 0.15) / exitRange);
        const exitFade = Math.pow(exitProgress, 1.25);
        targetVol = baseVolume * 0.85 * exitFade;
      } else if (p < 0.22) {
        // Absolute silence before cathedral doors entrance
        targetVol = 0;
      } else if (p < 0.40) {
        // Smooth cinematic swell as card emerges & expands to full-bleed (0.22 -> 0.40)
        const inFactor = (p - 0.22) / 0.18;
        const acousticCurve = Math.sin((inFactor * Math.PI) / 2);
        targetVol = baseVolume * acousticCurve;
      } else if (p <= 0.80) {
        // Core full-immersion concert storytelling
        targetVol = baseVolume;
      } else if (p < 0.96) {
        // Noticeable, cinematic decrescendo fade-out before Section 2 arrives (0.80 -> 0.96)
        const outFactor = (0.96 - p) / 0.16;
        const acousticCurve = Math.sin((outFactor * Math.PI) / 2);
        targetVol = baseVolume * acousticCurve;
      } else {
        // Complete silence before Section 2 (The Lineup) takes over
        targetVol = 0;
      }

      if (targetVol <= 0.01) {
        if (!recapVideo.muted) {
          fadeVideoVolume(recapVideo, 0, 200, () => {
            recapVideo.muted = true;
            isAudioActiveRef.current = false;
            if (getAudioOwner() === 'sec1-storytelling') setAudioOwner('none');
          });
        }
      } else {
        cancelVideoFade(recapVideo);
        if (recapVideo.muted) {
          silenceSec2();
          setAudioOwner('sec1-storytelling');
          recapVideo.volume = targetVol;
          recapVideo.muted = false;
          recapVideo.play().then(() => {
            isAudioActiveRef.current = true;
            isSectionVisibleRef.current = true;
          }).catch(() => {
            // CRITICAL MOBILE AUTOPLAY REJECTION SAFEGUARD:
            // Mobile Safari & Chrome reject unmuted play during scroll.
            // Immediately restore muted playback so the visual video keeps running!
            recapVideo.muted = true;
            isAudioActiveRef.current = false;
            recapVideo.play().catch(() => {});
          });
        } else {
          recapVideo.volume = targetVol;
          isAudioActiveRef.current = true;
          isSectionVisibleRef.current = true;
          if (recapVideo.paused) {
            recapVideo.play().catch(() => {
              recapVideo.muted = true;
              recapVideo.play().catch(() => {});
            });
          }
          if (getAudioOwner() !== 'sec1-storytelling') {
            setAudioOwner('sec1-storytelling');
          }
        }
      }
    };

    // Full-bleed cover draw to canvas
    const renderImageToCanvas = (img: HTMLImageElement, progress: number) => {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const imgW = img.naturalWidth || 540;
      const imgH = img.naturalHeight || 960;
      const canvasRatio = cw / ch;
      const imgRatio = imgW / imgH;

      let dw: number, dh: number, dx: number, dy: number;

      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = -(dh - ch) * 0.5;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        dx = -(dw - cw) * 0.5;
        dy = 0;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);

      // Deepen to pure black void when Section 1 begins expanding
      if (progress >= 0.44) {
        const fadeRatio = Math.min(1, (progress - 0.44) / 0.08);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeRatio})`;
        ctx.fillRect(0, 0, cw, ch);
      }
    };

    const drawFrame = (frameIndex: number, progress: number) => {
      const idx = Math.max(0, Math.min(TOTAL_MOBILE_FRAMES - 1, Math.round(frameIndex)));
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

    const renderStageElements = (p: number) => {
      // ----------------------------------------------------------------------
      // Stage 1: Initial Establishing Shot & Poster Metadata (0.00 -> 0.16)
      // ----------------------------------------------------------------------
      if (initialMetaRef.current) {
        const metaOp = Math.max(0, 1 - p / 0.10);
        const metaY = Math.round(-35 * (p / 0.10));
        initialMetaRef.current.style.opacity = metaOp.toFixed(3);
        initialMetaRef.current.style.transform = `translate3d(0, ${metaY}px, 0)`;
        initialMetaRef.current.style.pointerEvents = metaOp > 0.15 ? 'auto' : 'none';
      }

      // ----------------------------------------------------------------------
      // Stage 3 & 4: Section 1 Concert Card Emergence & Expansion (0.26 -> 1.00)
      // Video card appears alongside editorial text, expands to full-bleed by 0.44
      // ----------------------------------------------------------------------
      const baseCardW = Math.min(Math.round(vw * 0.82), 360);
      const baseCardH = Math.min(Math.round(baseCardW * 1.33), Math.round(vh * 0.48));
      const baseCardLeft = Math.round((vw - baseCardW) / 2);
      const baseCardTop = Math.round((vh - baseCardH) / 2);

      if (gpuCanvasRef.current) {
        if (p < 0.26) {
          gpuCanvasRef.current.style.opacity = '0';
          gpuCanvasRef.current.style.pointerEvents = 'none';
          if (photoHairlineRef.current) photoHairlineRef.current.style.opacity = '0';
        } else if (p < 0.34) {
          // Card emerges rapidly from black void with gold hairline & red backlight
          const fadeInP = Math.min(1, (p - 0.26) / 0.08);
          gpuCanvasRef.current.style.opacity = fadeInP.toFixed(3);
          gpuCanvasRef.current.style.left = `${baseCardLeft}px`;
          gpuCanvasRef.current.style.top = `${baseCardTop}px`;
          gpuCanvasRef.current.style.width = `${baseCardW}px`;
          gpuCanvasRef.current.style.height = `${baseCardH}px`;
          gpuCanvasRef.current.style.borderRadius = '6px';
          gpuCanvasRef.current.style.boxShadow = `0 0 35px rgba(220, 20, 40, ${(fadeInP * 0.45).toFixed(3)})`;
          gpuCanvasRef.current.style.pointerEvents = fadeInP > 0.5 ? 'auto' : 'none';

          if (photoHairlineRef.current) {
            photoHairlineRef.current.style.opacity = (fadeInP * 0.75).toFixed(3);
          }
        } else if (p <= 0.44) {
          // Morphing smoothly to 100vw x 100vh full-bleed
          const expP = Math.min(1, Math.max(0, (p - 0.34) / 0.10));
          // Ken Perlin's Smootherstep: 6t^5 - 15t^4 + 10t^3
          const easedP = expP * expP * expP * (expP * (expP * 6 - 15) + 10);

          const curLeft = (baseCardLeft * (1 - easedP)).toFixed(2);
          const curTop = (baseCardTop * (1 - easedP)).toFixed(2);
          const curW = (baseCardW + (vw - baseCardW) * easedP).toFixed(2);
          const curH = (baseCardH + (vh - baseCardH) * easedP).toFixed(2);
          const curRadius = Math.max(0, 6 * (1 - easedP)).toFixed(2);

          gpuCanvasRef.current.style.opacity = '1';
          gpuCanvasRef.current.style.left = `${curLeft}px`;
          gpuCanvasRef.current.style.top = `${curTop}px`;
          gpuCanvasRef.current.style.width = `${curW}px`;
          gpuCanvasRef.current.style.height = `${curH}px`;
          gpuCanvasRef.current.style.borderRadius = `${curRadius}px`;
          gpuCanvasRef.current.style.pointerEvents = 'auto';

          const shadowOp = (0.40 * Math.pow(1 - easedP, 1.5)).toFixed(3);
          gpuCanvasRef.current.style.boxShadow = Number(shadowOp) > 0.005 ? `0 0 35px rgba(220, 20, 40, ${shadowOp})` : 'none';

          if (photoHairlineRef.current) {
            const borderOp = Math.max(0, 0.75 * (1 - easedP * 2.0));
            photoHairlineRef.current.style.opacity = borderOp.toFixed(3);
          }
        } else {
          // EXTENDED FULLSCREEN PLATEAU (0.44 -> 1.00)
          gpuCanvasRef.current.style.opacity = '1';
          gpuCanvasRef.current.style.left = '0px';
          gpuCanvasRef.current.style.top = '0px';
          gpuCanvasRef.current.style.width = '100vw';
          gpuCanvasRef.current.style.height = '100vh';
          gpuCanvasRef.current.style.borderRadius = '0px';
          gpuCanvasRef.current.style.pointerEvents = 'auto';
          gpuCanvasRef.current.style.boxShadow = 'none';

          if (photoHairlineRef.current) {
            photoHairlineRef.current.style.opacity = '0';
          }
        }
      }

      // Camera push-in scale for recap concert video
      if (recapVideo && p >= 0.26) {
        const vidProgress = Math.max(0, (p - 0.26) / 0.74);
        const scaleVal = (1 + 0.06 * Math.pow(vidProgress, 1.2)).toFixed(4);
        recapVideo.style.transform = `scale(${scaleVal}) translateZ(0)`;
      }

      // Ambient glows
      if (bgAmbientRef.current) {
        const ambientOp = Math.min(1, Math.max(0, (p - 0.20) * 3.0));
        bgAmbientRef.current.style.opacity = ambientOp.toFixed(3);
      }
      if (stageGlowRef.current) {
        const glowOp = Math.min(1, Math.max(0, (p - 0.24) * 2.5));
        stageGlowRef.current.style.opacity = glowOp.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // Editorial Typography Layer (THE GUESTS, MALVIN, FAR)
      // Muncul saat kamera menembus pintu gotik & masuk kabut merah (p = 0.20 -> 0.28)
      // Video card muncul bersamaan (p = 0.26 -> 0.34), teks larut saat card expand (0.34 -> 0.42)
      // ----------------------------------------------------------------------
      let sec1TextOpacity = 0;
      let topDriftY = 0;
      let bottomDriftY = 0;

      if (p < 0.20) {
        sec1TextOpacity = 0;
        topDriftY = 16;
        bottomDriftY = -16;
      } else if (p < 0.28) {
        // Teks muncul mulus di atas kabut merah
        const enterP = (p - 0.20) / 0.08;
        sec1TextOpacity = enterP;
        topDriftY = Math.round(16 * (1 - enterP));
        bottomDriftY = Math.round(-16 * (1 - enterP));
      } else if (p <= 0.34) {
        // Teks terbaca jelas & mantap di layar; video card muncul bersamaan
        sec1TextOpacity = 1;
        topDriftY = 0;
        bottomDriftY = 0;
      } else if (p <= 0.42) {
        // Saat video card membesar ke full-bleed, teks bergeser keluar & larut
        const expRatio = (p - 0.34) / 0.08;
        sec1TextOpacity = Math.max(0, 1 - expRatio * 1.4);
        topDriftY = Math.round(-32 * expRatio);
        bottomDriftY = Math.round(32 * expRatio);
      } else {
        sec1TextOpacity = 0;
        topDriftY = -32;
        bottomDriftY = 32;
      }

      if (topEditorialRef.current) {
        topEditorialRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        topEditorialRef.current.style.transform = `translate3d(0, ${topDriftY}px, 0)`;
      }

      if (bottomEditorialRef.current) {
        bottomEditorialRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        bottomEditorialRef.current.style.transform = `translate3d(0, ${bottomDriftY}px, 0)`;
        bottomEditorialRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }

      // ----------------------------------------------------------------------
      // Stage 5: Climax Arrival ("WELCOME TO THE ASSEMBLY") (0.52 -> 0.96)
      // ----------------------------------------------------------------------
      let welcomeOpacity = 0;
      let welcomeTranslateY = 24;

      if (p < 0.52) {
        welcomeOpacity = 0;
        welcomeTranslateY = 24;
      } else if (p < 0.60) {
        const wp = (p - 0.52) / 0.08;
        welcomeOpacity = wp;
        welcomeTranslateY = Math.round(24 * (1 - Math.pow(wp, 0.8)));
      } else if (p <= 0.88) {
        welcomeOpacity = 1;
        welcomeTranslateY = 0;
      } else if (p <= 0.96) {
        const fadeP = (p - 0.88) / 0.08;
        welcomeOpacity = Math.max(0, 1 - fadeP);
        welcomeTranslateY = Math.round(-16 * fadeP);
      } else {
        welcomeOpacity = 0;
        welcomeTranslateY = -16;
      }

      if (climaxOverlayRef.current) {
        climaxOverlayRef.current.style.opacity = welcomeOpacity.toFixed(3);
        climaxOverlayRef.current.style.transform = `translate3d(0, ${welcomeTranslateY}px, 0)`;
      }

      if (videoDimRef.current) {
        videoDimRef.current.style.opacity = '0';
      }

      // ----------------------------------------------------------------------
      // Audio State Synchronization with Section 1 Video Runway & Sec 2 Boundary
      // Continuously calculates smooth volume based on video visibility & scroll boundary.
      // ----------------------------------------------------------------------
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        updateAudioVolume(p, rect);
      } else {
        updateAudioVolume(p, null);
      }
    };

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
      renderStageElements(smoothProgress);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Step 0: Sync all frames already preloaded by mediaPreloader
    for (let i = 0; i < TOTAL_MOBILE_FRAMES; i++) {
      const preloaded = getMobileFrame(i);
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
      initialImg.src = getMobileFramePath(0);
      initialImg.onload = () => {
        images[0] = initialImg;
        loadedIndices.add(0);
        drawFrame(0, 0);
      };
    }

    // Step 2: Progressive background preloading of remaining frames
    const loadRemainingFrames = () => {
      let currentIdx = 1;
      const batchSize = 12;

      const loadNextBatch = () => {
        if (!isActive || currentIdx >= TOTAL_MOBILE_FRAMES) return;
        const end = Math.min(TOTAL_MOBILE_FRAMES, currentIdx + batchSize);

        for (let i = currentIdx; i < end; i++) {
          if (!images[i]) {
            const img = new Image();
            img.src = getMobileFramePath(i);
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
        if (currentIdx < TOTAL_MOBILE_FRAMES && isActive) {
          setTimeout(loadNextBatch, 20);
        }
      };

      loadNextBatch();
    };

    const preloadTimer = setTimeout(loadRemainingFrames, 60);

    // Animation Tick Loop
    const tick = () => {
      if (!isActive) return;

      // Map progress to frames:
      // 0.00 -> 0.38: Frames 0 -> 83 (kamera bergerak maju ke gerbang menara gotik, menembus pintu, masuk kegelapan)
      // > 0.38: Frame 83 (keheningan kegelapan di mana kartu konser muncul)
      let targetFrame: number;
      if (smoothProgress <= 0.38) {
        targetFrame = (smoothProgress / 0.38) * (TOTAL_MOBILE_FRAMES - 1);
      } else {
        targetFrame = TOTAL_MOBILE_FRAMES - 1;
      }

      const pDiff = targetProgress - smoothProgress;
      const fDiff = targetFrame - currentFrame;

      const pNeedsUpdate = Math.abs(pDiff) > 0.0001;
      const fNeedsUpdate = Math.abs(fDiff) > 0.04;

      if (pNeedsUpdate || fNeedsUpdate) {
        smoothProgress += pDiff * 0.22;
        currentFrame += fDiff * 0.28;
        drawFrame(currentFrame, smoothProgress);
        renderStageElements(smoothProgress);
        rafId = requestAnimationFrame(tick);
      } else {
        smoothProgress = targetProgress;
        currentFrame = targetFrame;
        drawFrame(currentFrame, smoothProgress);
        renderStageElements(smoothProgress);
        rafId = null;
      }
    };

    const requestTick = () => {
      if (rafId === null && isActive) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();

      // Viewport culling: If hero section is completely offscreen (scrolled past),
      // pause recap video to free mobile GPU/CPU/battery and skip offscreen canvas rAF
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
        if (recapVideo && !recapVideo.paused) {
          recapVideo.pause();
        }
        return;
      }

      // Resume recap video playback if user scrolled back into view
      if (recapVideo && recapVideo.paused && targetProgress >= 0.26) {
        recapVideo.play().catch(() => {});
      }

      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / scrollableDistance;
      targetProgress = Math.max(0, Math.min(1, rawProgress));

      if (!isInitialized) {
        isInitialized = true;
        smoothProgress = targetProgress;
        if (targetProgress <= 0.38) {
          currentFrame = (targetProgress / 0.38) * (TOTAL_MOBILE_FRAMES - 1);
        } else {
          currentFrame = TOTAL_MOBILE_FRAMES - 1;
        }
      }

      // Synchronous scroll-based volume update (smooth fade out at Section 1 & 2 border)
      updateAudioVolume(smoothProgress, rect);

      requestTick();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // User gesture audio unlock (triggered on touch/click)
    const unlockOnGesture = () => {
      userInteractedRef.current = true;
      if (!recapVideo || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      // Only interact with recap video if Hero section is currently in viewport
      const isInHeroView = rect.bottom >= 0 && rect.top <= window.innerHeight;
      if (!isInHeroView) return;

      // In touch/click gesture: ensure video is playing
      if (recapVideo.paused && targetProgress >= 0.26) {
        recapVideo.play().catch(() => {
          recapVideo.muted = true;
          recapVideo.play().catch(() => {});
        });
      }

      // If user is currently in Section 1, attempt unmuting inside this direct user gesture!
      if (targetProgress >= 0.22 && targetProgress < 0.96 && canSec1PlayAudio()) {
        silenceSec2();
        setAudioOwner('sec1-storytelling');
        recapVideo.muted = false;
        recapVideo.play().then(() => {
          isAudioActiveRef.current = true;
        }).catch(() => {
          recapVideo.muted = true;
          recapVideo.play().catch(() => {});
        });
      }

      updateAudioVolume(targetProgress, rect);
    };

    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec2-lineup') {
        if (recapVideo && !recapVideo.muted) {
          fadeVideoVolume(recapVideo, 0, 200, () => {
            recapVideo.muted = true;
            isAudioActiveRef.current = false;
          });
        }
      }
    };

    const handleSec1Silenced = () => {
      if (recapVideo && !recapVideo.muted) {
        fadeVideoVolume(recapVideo, 0, 200, () => {
          recapVideo.muted = true;
          isAudioActiveRef.current = false;
        });
      }
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });

    return () => {
      isActive = false;
      clearTimeout(preloadTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec1-silenced', handleSec1Silenced);
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
    };
  }, []);

  const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
    ? `${event.venueCity} · ${event.venueName}`
    : 'BANDUNG · SECRET MONUMENT';

  return (
    <section
      ref={trackRef}
      id="hero"
      data-section="hero-mobile"
      className="hero-mobile-track"
      aria-label="The State of Clamour // Swear In Continental (Mobile)"
    >
      <div className="hero-mobile-sticky">
        {/* Layer 0: Instant Fallback Poster (Zero-delay Paint, identical to Frame 1) */}
        <div className="hero-mobile-poster-fallback">
          <img
            src="/assets/hero_scroll_poster_mobile_2k.jpg"
            alt="The State of Clamour // Swear In Continental"
            className="hero-mobile-poster-fallback-img"
          />
        </div>

        {/* Layer 1: Hardware-Composited Mobile Canvas (Frames 1 -> 84, locked 60/120fps) */}
        <canvas
          ref={canvasRef}
          className="hero-mobile-canvas"
          aria-hidden="true"
        />

        {/* Layer 1b: Editorial Film Vignette */}
        <div className="hero-mobile-vignette" />

        {/* Layer 1c: Initial Poster Metadata (Date, Venue) */}
        <div ref={initialMetaRef} className="hero-mobile-initial-meta">
          <span className="hero-mobile-meta-date">30 — 31 OCTOBER 2026</span>
          <span className="hero-mobile-meta-venue">{venueLabel}</span>
        </div>

        {/* Layer 2: Ambient Glow & Atmospheric Background for Section 1 */}
        <div ref={bgAmbientRef} className="hero-mobile-bg-ambient" style={{ opacity: 0 }} />
        <div ref={stageGlowRef} className="hero-mobile-stage-glow" style={{ opacity: 0 }} />

        {/* Layer 3: Section 1 Concert Card (Morphs from Center Card to Full-Bleed) */}
        <div
          ref={gpuCanvasRef}
          className="hero-mobile-portal-stage"
          style={{ opacity: 0 }}
        >

          <div className="hero-mobile-portal-frame">
            <video
              ref={recapVideoRef}
              src="/assets/how2026_recap.mp4"
              poster="/assets/how2026_recap_poster.jpg"
              className="hero-mobile-portal-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onEnded={() => {
                if (recapVideoRef.current) {
                  recapVideoRef.current.currentTime = 0;
                  recapVideoRef.current.play().catch(() => {});
                }
              }}
            />

            {/* Video Dimmer for Welcome Climax readability */}
            <div ref={videoDimRef} className="hero-mobile-video-dim" style={{ opacity: 0 }} />

            {/* Edge Vignette */}
            <div className="hero-mobile-portal-vignette" />

            {/* Antique Gold Hairline */}
            <div ref={photoHairlineRef} className="hero-mobile-portal-hairline" />
          </div>
        </div>

        {/* Layer 4: Mobile Storytelling Editorial Layer */}
        <div className="hero-mobile-editorial-layer">
          {/* Top Cluster: THE GUESTS */}
          <div ref={topEditorialRef} className="hero-mobile-top-editorial" style={{ opacity: 0 }}>
            <h2 className="hero-mobile-monument-title text-gold-metallic">
              <span>THE</span>
              <span>GUESTS</span>
            </h2>
            <p className="hero-mobile-title-subtext">
              The monumental silence breaks into nocturnal sound.
            </p>
            <div className="hero-mobile-sub-venue">
              SWEAR IN CONTINENTAL · MIZU COMMONROOM
            </div>
          </div>

          {/* Bottom Cluster: Schedule Grid */}
          <div ref={bottomEditorialRef} className="hero-mobile-bottom-editorial" style={{ opacity: 0 }}>
            <div className="hero-mobile-divider" />
            <div className="hero-mobile-schedule-dock">

              <div className="hero-mobile-schedule-item">
                <span className="hero-mobile-sched-date">30 OKTOBER</span>
                <span className="hero-mobile-sched-artist">MALVIN</span>
                <span className="hero-mobile-sched-meta">22:00 WIB</span>
                <span className="hero-mobile-sched-venue">MIZU COMMONROOM</span>
              </div>

              <div className="hero-mobile-schedule-item align-right">
                <span className="hero-mobile-sched-date">31 OKTOBER</span>
                <span className="hero-mobile-sched-artist">FAR</span>
                <span className="hero-mobile-sched-meta">23:30 WIB</span>
                <span className="hero-mobile-sched-venue">MIZU COMMONROOM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionMobile;
