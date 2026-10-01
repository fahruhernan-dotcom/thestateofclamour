import React, { useRef, useEffect, useCallback } from 'react';
import { EventData } from '../../types';
import { silenceSec1, silenceSec2, setAudioOwner, getAudioOwner, canSec1PlayAudio } from '../../utils/audioCoordinator';
import { getCachedVideoUrl } from '../../utils/mediaPreloader';

interface Props {
  event: EventData;
  onExploreGuests?: () => void;
}

export const HeroSectionMobile: React.FC<Props> = ({ event, onExploreGuests }) => {
  const trackRef = useRef<HTMLElement | null>(null);

  // DOM Layer Refs for GPU-accelerated interpolation
  const posterLayerRef = useRef<HTMLDivElement | null>(null);
  const initialMetaRef = useRef<HTMLDivElement | null>(null);

  const flythroughStageRef = useRef<HTMLDivElement | null>(null);
  const flythroughVideoRef = useRef<HTMLVideoElement | null>(null);

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

  const handleAdvanceToLineup = useCallback(() => {
    silenceSec1();
    isAudioActiveRef.current = false;
    if (onExploreGuests) {
      onExploreGuests();
    } else {
      const el = document.getElementById('lineup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onExploreGuests]);

  useEffect(() => {
    let rafId: number | null = null;
    let isActive = true;

    // Viewport dimensions
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    let targetProgress = 0;
    let targetFlythroughTime = 0;
    let currentFlythroughTime = 0;

    const flythroughVideo = flythroughVideoRef.current;
    const recapVideo = recapVideoRef.current;

    // Ensure flythrough video is paused so it strictly obeys scroll scrub
    if (flythroughVideo) {
      flythroughVideo.pause();
      flythroughVideo.currentTime = 0;
    }

    // Ensure recap video plays muted in loop ready for unmasking
    if (recapVideo) {
      recapVideo.play().catch(() => {});
    }

    const checkAudio = (inRange: boolean) => {
      if (!recapVideo) return;

      if (inRange && canSec1PlayAudio()) {
        silenceSec2();
        setAudioOwner('sec1-storytelling');
        recapVideo.volume = 0.92;
        recapVideo.muted = false;
        const playPromise = recapVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isAudioActiveRef.current = true;
            })
            .catch(() => {
              recapVideo.muted = true;
              isAudioActiveRef.current = false;
              recapVideo.play().catch(() => {});
            });
        }
      } else {
        recapVideo.muted = true;
        isAudioActiveRef.current = false;
        if (getAudioOwner() === 'sec1-storytelling') {
          setAudioOwner('none');
        }
      }
    };

    const render = () => {
      if (!isActive) return;

      const p = targetProgress;

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

      if (posterLayerRef.current) {
        let posterAlpha = 1;
        if (p > 0.08) {
          posterAlpha = Math.max(0, 1 - (p - 0.08) / 0.08);
        }
        posterLayerRef.current.style.opacity = posterAlpha.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // Stage 2: Camera Fly-Through Gothic Doors Video Stage (0.08 -> 0.40)
      // ----------------------------------------------------------------------
      if (flythroughStageRef.current) {
        let stageAlpha = 0;
        if (p >= 0.08 && p <= 0.40) {
          if (p < 0.16) {
            stageAlpha = (p - 0.08) / 0.08;
          } else if (p > 0.34) {
            stageAlpha = Math.max(0, 1 - (p - 0.34) / 0.06);
          } else {
            stageAlpha = 1;
          }
        }
        flythroughStageRef.current.style.opacity = stageAlpha.toFixed(3);
      }

      // Scrub flythrough video to exact door-entering timestamp
      if (p >= 0.08 && p <= 0.38) {
        const scrubNorm = Math.min(1, Math.max(0, (p - 0.08) / 0.28));
        const dur = (flythroughVideo && flythroughVideo.duration) || 8.0;
        targetFlythroughTime = scrubNorm * Math.max(0, dur - 0.1);
      } else if (p > 0.38) {
        const dur = (flythroughVideo && flythroughVideo.duration) || 8.0;
        targetFlythroughTime = Math.max(0, dur - 0.1);
      } else {
        targetFlythroughTime = 0;
      }

      const timeDiff = targetFlythroughTime - currentFlythroughTime;
      if (Math.abs(timeDiff) > 0.03) {
        currentFlythroughTime += timeDiff * 0.35;
        if (flythroughVideo && !flythroughVideo.seeking) {
          flythroughVideo.currentTime = currentFlythroughTime;
        }
      }

      // ----------------------------------------------------------------------
      // Stage 3 & 4: Section 1 Concert Card Emergence & Expansion (0.36 -> 1.00)
      // ----------------------------------------------------------------------
      const baseCardW = Math.min(Math.round(vw * 0.82), 360);
      const baseCardH = Math.min(Math.round(baseCardW * 1.33), Math.round(vh * 0.48));
      const baseCardLeft = Math.round((vw - baseCardW) / 2);
      const baseCardTop = Math.round((vh - baseCardH) / 2);

      if (gpuCanvasRef.current) {
        if (p < 0.36) {
          gpuCanvasRef.current.style.opacity = '0';
          gpuCanvasRef.current.style.pointerEvents = 'none';
          if (photoHairlineRef.current) photoHairlineRef.current.style.opacity = '0';
        } else if (p < 0.46) {
          // Card emerges rapidly from black void with gold hairline & red backlight
          const fadeInP = Math.min(1, (p - 0.36) / 0.08);
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
        } else if (p <= 0.56) {
          // Morphing smoothly to 100vw x 100vh full-bleed
          const expP = (p - 0.46) / 0.10;
          const easedP = Math.pow(expP, 1.25);

          const curLeft = Math.round(baseCardLeft * (1 - easedP));
          const curTop = Math.round(baseCardTop * (1 - easedP));
          const curW = Math.round(baseCardW + (vw - baseCardW) * easedP);
          const curH = Math.round(baseCardH + (vh - baseCardH) * easedP);
          const curRadius = Math.max(0, Math.round(6 * (1 - easedP)));

          gpuCanvasRef.current.style.opacity = '1';
          gpuCanvasRef.current.style.left = `${curLeft}px`;
          gpuCanvasRef.current.style.top = `${curTop}px`;
          gpuCanvasRef.current.style.width = `${curW}px`;
          gpuCanvasRef.current.style.height = `${curH}px`;
          gpuCanvasRef.current.style.borderRadius = `${curRadius}px`;
          gpuCanvasRef.current.style.pointerEvents = 'auto';

          const shadowOp = Math.max(0, 0.45 * (1 - expP * 2));
          gpuCanvasRef.current.style.boxShadow = shadowOp > 0 ? `0 0 35px rgba(220, 20, 40, ${shadowOp.toFixed(3)})` : 'none';

          if (photoHairlineRef.current) {
            const borderOp = Math.max(0, 0.75 * (1 - expP * 2.5));
            photoHairlineRef.current.style.opacity = borderOp.toFixed(3);
          }
        } else {
          // EXTENDED FULLSCREEN PLATEAU (0.56 -> 1.00)
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
      if (recapVideo && p >= 0.36) {
        const vidProgress = Math.max(0, (p - 0.36) / 0.64);
        const scaleVal = (1 + 0.06 * Math.pow(vidProgress, 1.2)).toFixed(4);
        recapVideo.style.transform = `scale(${scaleVal}) translateZ(0)`;
      }

      // Ambient glows
      if (bgAmbientRef.current) {
        const ambientOp = Math.min(1, Math.max(0, (p - 0.34) * 3.0));
        bgAmbientRef.current.style.opacity = ambientOp.toFixed(3);
      }
      if (stageGlowRef.current) {
        const glowOp = Math.min(1, Math.max(0, (p - 0.38) * 2.5));
        stageGlowRef.current.style.opacity = glowOp.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // Editorial Typography Layer (THE GUESTS, MALVIN, FAR)
      // ----------------------------------------------------------------------
      let sec1TextOpacity = 0;
      let expRatio = 0;

      if (p < 0.36) {
        sec1TextOpacity = 0;
      } else if (p < 0.46) {
        sec1TextOpacity = Math.min(1, (p - 0.36) / 0.08);
      } else if (p <= 0.54) {
        expRatio = (p - 0.46) / 0.08;
        sec1TextOpacity = Math.max(0, 1 - expRatio * 1.4);
      } else {
        sec1TextOpacity = 0;
      }

      if (topEditorialRef.current) {
        const driftY = Math.round(-30 * expRatio);
        topEditorialRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        topEditorialRef.current.style.transform = `translate3d(0, ${driftY}px, 0)`;
      }

      if (bottomEditorialRef.current) {
        const driftY = Math.round(30 * expRatio);
        bottomEditorialRef.current.style.opacity = sec1TextOpacity.toFixed(3);
        bottomEditorialRef.current.style.transform = `translate3d(0, ${driftY}px, 0)`;
        bottomEditorialRef.current.style.pointerEvents = sec1TextOpacity > 0.4 ? 'auto' : 'none';
      }

      // ----------------------------------------------------------------------
      // Stage 5: Climax Arrival ("WELCOME TO THE ASSEMBLY") (0.60 -> 0.98)
      // ----------------------------------------------------------------------
      let welcomeOpacity = 0;
      let welcomeTranslateY = 24;

      if (p < 0.60) {
        welcomeOpacity = 0;
        welcomeTranslateY = 24;
      } else if (p < 0.68) {
        const wp = (p - 0.60) / 0.08;
        welcomeOpacity = wp;
        welcomeTranslateY = Math.round(24 * (1 - Math.pow(wp, 0.8)));
      } else if (p <= 0.92) {
        welcomeOpacity = 1;
        welcomeTranslateY = 0;
      } else if (p <= 0.98) {
        const fadeP = (p - 0.92) / 0.06;
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
        videoDimRef.current.style.opacity = (welcomeOpacity * 0.50).toFixed(3);
      }

      // ----------------------------------------------------------------------
      // Audio State Synchronization with Section 1 Runway
      // ----------------------------------------------------------------------
      const isSec1Active = p >= 0.36 && p <= 1.00 && canSec1PlayAudio();
      if (isSec1Active !== isSectionVisibleRef.current) {
        isSectionVisibleRef.current = isSec1Active;
        checkAudio(isSec1Active);
      }

      // Keep RAF alive if flythrough video seeking or lerping is in progress
      if (Math.abs(timeDiff) > 0.03) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const requestTick = () => {
      if (rafId === null && isActive) {
        rafId = requestAnimationFrame(render);
      }
    };

    const onScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      targetProgress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      requestTick();
    };

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      requestTick();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    onScroll();

    // User gesture audio unlock
    const unlockOnGesture = () => {
      if (recapVideo && isSectionVisibleRef.current && canSec1PlayAudio()) {
        silenceSec2();
        setAudioOwner('sec1-storytelling');
        recapVideo.volume = 0.92;
        recapVideo.muted = false;
        recapVideo.play()
          .then(() => {
            isAudioActiveRef.current = true;
          })
          .catch(() => {});
      }
    };

    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec2-lineup') {
        if (recapVideo) recapVideo.muted = true;
        isAudioActiveRef.current = false;
      }
    };

    const handleSec1Silenced = () => {
      if (recapVideo) recapVideo.muted = true;
      isAudioActiveRef.current = false;
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('wheel', unlockOnGesture, { passive: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true });

    return () => {
      isActive = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec1-silenced', handleSec1Silenced);
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('wheel', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };
  }, []);

  const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
    ? `${event.venueCity} · ${event.venueName}`
    : 'BANDUNG · SECRET MONUMENT';

  return (
    <section
      ref={trackRef}
      id="hero-mobile"
      className="hero-mobile-track"
      aria-label="The State of Clamour // Swear In Continental (Mobile)"
    >
      {/* Anchor target for #the-guests linking */}
      <div id="the-guests" style={{ position: 'absolute', top: '38%', pointerEvents: 'none' }} />

      <div className="hero-mobile-sticky">
        {/* Layer 1: Establishing 2K Portrait Poster (1536x2752 px) */}
        <div ref={posterLayerRef} className="hero-mobile-poster-layer">
          <img
            src="/assets/hero_scroll_poster_mobile_2k.jpg"
            alt="The State of Clamour // Swear In Continental"
            className="hero-mobile-poster-img"
          />
        </div>

        {/* Layer 1b: Initial Poster Metadata (Date, Venue, Scroll Cue) */}
        <div ref={initialMetaRef} className="hero-mobile-initial-meta">
          <span className="hero-mobile-meta-date">30 — 31 OCTOBER 2026</span>
          <span className="hero-mobile-meta-venue">{venueLabel}</span>
          <div
            className="hero-mobile-scroll-cue"
            onClick={handleAdvanceToLineup}
            role="button"
            tabIndex={0}
            aria-label="Gulir untuk memasuki gerbang"
          >
            <span>GULIR KE GERBANG</span>
            <span className="hero-mobile-cue-arrow">↓</span>
          </div>
        </div>

        {/* Layer 2: Camera Fly-Through Gothic Doors Video Stage */}
        <div ref={flythroughStageRef} className="hero-mobile-flythrough-stage" style={{ opacity: 0 }}>
          <video
            ref={flythroughVideoRef}
            src="/assets/hero_camera_doors.mp4"
            className="hero-mobile-flythrough-video"
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="hero-mobile-flythrough-vignette" />
        </div>

        {/* Layer 3: Ambient Glow & Atmospheric Background */}
        <div ref={bgAmbientRef} className="hero-mobile-bg-ambient" style={{ opacity: 0 }} />
        <div ref={stageGlowRef} className="hero-mobile-stage-glow" style={{ opacity: 0 }} />

        {/* Layer 4: Section 1 Concert Card (Morphs from Center Card to Full-Bleed) */}
        <div ref={gpuCanvasRef} className="hero-mobile-portal-stage" style={{ opacity: 0 }}>
          <div className="hero-mobile-portal-frame">
            <video
              ref={recapVideoRef}
              src={getCachedVideoUrl('/assets/how2026_recap.mp4')}
              poster="/assets/how2026_recap_poster.jpg"
              className="hero-mobile-portal-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
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

        {/* Layer 5: Mobile Storytelling Editorial Layer */}
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

        {/* Layer 6: Climax Arrival ("WELCOME TO THE ASSEMBLY") */}
        <div ref={climaxOverlayRef} className="hero-mobile-climax-overlay" style={{ opacity: 0 }}>
          <h2 className="hero-mobile-climax-title">
            WELCOME TO<br />THE ASSEMBLY
          </h2>
          <div className="hero-mobile-climax-bar" />
        </div>
      </div>
    </section>
  );
};

export default HeroSectionMobile;
