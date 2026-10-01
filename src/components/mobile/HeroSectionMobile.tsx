import React, { useRef, useEffect, useCallback } from 'react';
import { EventData } from '../../types';
import { silenceSec1, setAudioOwner, canSec1PlayAudio } from '../../utils/audioCoordinator';
import { getCachedVideoUrl } from '../../utils/mediaPreloader';

interface Props {
  event: EventData;
  onExploreGuests?: () => void;
}

export const HeroSectionMobile: React.FC<Props> = ({ event, onExploreGuests }) => {
  const trackRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Layer references for smooth 60fps transform interpolation
  const posterLayerRef = useRef<HTMLDivElement | null>(null);
  const initialMetaRef = useRef<HTMLDivElement | null>(null);
  const portalStageRef = useRef<HTMLDivElement | null>(null);
  const portalFrameRef = useRef<HTMLDivElement | null>(null);
  const editorialLayerRef = useRef<HTMLDivElement | null>(null);
  const climaxOverlayRef = useRef<HTMLDivElement | null>(null);

  const isAudioActiveRef = useRef<boolean>(false);

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

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!isActive || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const totalDist = rect.height - vh;
        const rawProgress = totalDist > 0 ? -rect.top / totalDist : 0;
        const p = Math.max(0, Math.min(1, rawProgress));

        // 1. Initial Poster Metadata: Dissolves between progress 0.00 -> 0.12
        if (initialMetaRef.current) {
          const metaOpacity = Math.max(0, 1 - p / 0.12);
          initialMetaRef.current.style.opacity = metaOpacity.toFixed(3);
          initialMetaRef.current.style.transform = `translateY(${(p * 40).toFixed(1)}px)`;
        }

        // 2. Establishing Poster Crossfade into Portal: 0.10 -> 0.26
        if (posterLayerRef.current) {
          let posterAlpha = 1;
          if (p > 0.10) {
            posterAlpha = Math.max(0, 1 - (p - 0.10) / 0.16);
          }
          posterLayerRef.current.style.opacity = posterAlpha.toFixed(3);
        }

        // 3. Portal Video Stage Unmasking & Sizing: 0.12 -> 0.72
        if (portalStageRef.current && portalFrameRef.current) {
          let portalOpacity = 0;
          if (p >= 0.10 && p <= 0.88) {
            if (p < 0.24) {
              portalOpacity = (p - 0.10) / 0.14;
            } else if (p > 0.76) {
              portalOpacity = Math.max(0, 1 - (p - 0.76) / 0.12);
            } else {
              portalOpacity = 1;
            }
          }
          portalStageRef.current.style.opacity = portalOpacity.toFixed(3);

          // Morph portal frame from compact center card to expanded cinematic viewport
          if (p >= 0.12 && p <= 0.76) {
            const morphProgress = Math.max(0, Math.min(1, (p - 0.12) / 0.44));
            const cardW = 76 + morphProgress * 24; // 76vw -> 100vw
            const cardH = 46 + morphProgress * 54; // 46vh -> 100vh
            const borderRadius = Math.max(0, (1 - morphProgress) * 6);
            portalFrameRef.current.style.width = `${cardW.toFixed(1)}vw`;
            portalFrameRef.current.style.height = `${cardH.toFixed(1)}vh`;
            portalFrameRef.current.style.borderRadius = `${borderRadius.toFixed(1)}px`;
          }
        }

        // 4. Section 1 Guest Storytelling Editorial Layer: 0.20 -> 0.68
        if (editorialLayerRef.current) {
          let editOpacity = 0;
          if (p >= 0.20 && p <= 0.68) {
            if (p < 0.32) {
              editOpacity = (p - 0.20) / 0.12;
            } else if (p > 0.58) {
              editOpacity = Math.max(0, 1 - (p - 0.58) / 0.10);
            } else {
              editOpacity = 1;
            }
          }
          editorialLayerRef.current.style.opacity = editOpacity.toFixed(3);
        }

        // 5. Climax Arrival Overlay ("WELCOME TO THE ASSEMBLY"): 0.66 -> 0.94
        if (climaxOverlayRef.current) {
          let climaxOpacity = 0;
          if (p >= 0.66 && p <= 0.96) {
            if (p < 0.76) {
              climaxOpacity = (p - 0.66) / 0.10;
            } else if (p > 0.88) {
              climaxOpacity = Math.max(0, 1 - (p - 0.88) / 0.08);
            } else {
              climaxOpacity = 1;
            }
          }
          climaxOverlayRef.current.style.opacity = climaxOpacity.toFixed(3);
        }

        // 6. Audio Ambience Activation within Portal
        if (p > 0.22 && p < 0.88) {
          if (!isAudioActiveRef.current && canSec1PlayAudio() && video) {
            video.muted = false;
            video.volume = 0.85;
            setAudioOwner('sec1-storytelling');
            isAudioActiveRef.current = true;
          }
        } else {
          if (isAudioActiveRef.current && video) {
            video.muted = true;
            isAudioActiveRef.current = false;
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // User gesture audio unlock
    const unlockAudio = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('click', unlockAudio, { passive: true, once: true });

    return () => {
      isActive = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
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
      <div id="the-guests" style={{ position: 'absolute', top: '35%', pointerEvents: 'none' }} />

      <div className="hero-mobile-sticky">
        {/* Layer 1: Establishing Portrait Poster (Perfect 9:16 Uncropped Framing) */}
        <div ref={posterLayerRef} className="hero-mobile-poster-layer">
          <img
            src="/assets/hero_scroll_poster_mobile.jpg"
            alt="The State of Clamour // Swear In Continental"
            className="hero-mobile-poster-img"
          />
        </div>

        {/* Layer 1b: Initial Poster Metadata Overlay (Date, Venue, Scroll Cue) */}
        <div ref={initialMetaRef} className="hero-mobile-initial-meta">
          <span className="hero-mobile-meta-date">30 — 31 OCTOBER 2026</span>
          <span className="hero-mobile-meta-venue">{venueLabel}</span>
          <div
            className="hero-mobile-scroll-cue"
            onClick={handleAdvanceToLineup}
            role="button"
            tabIndex={0}
            aria-label="Masuki Gerbang Acara"
          >
            <span>GULIR KE GERBANG</span>
            <span className="hero-mobile-cue-arrow">↓</span>
          </div>
        </div>

        {/* Layer 2: Central Portal Video Stage */}
        <div ref={portalStageRef} className="hero-mobile-portal-stage" style={{ opacity: 0 }}>
          <div ref={portalFrameRef} className="hero-mobile-portal-frame">
            <video
              ref={videoRef}
              src={getCachedVideoUrl('/assets/how2026_recap.mp4')}
              poster="/assets/how2026_recap_poster.jpg"
              className="hero-mobile-portal-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="hero-mobile-portal-hairline" />
            <div className="hero-mobile-portal-vignette" />
          </div>
        </div>

        {/* Layer 3: Mobile Storytelling Editorial Layer */}
        <div ref={editorialLayerRef} className="hero-mobile-editorial-layer" style={{ opacity: 0 }}>
          <div className="hero-mobile-top-editorial">
            <h2 className="hero-mobile-monument-title text-gold-metallic">
              <span>THE</span>
              <span>GUESTS</span>
            </h2>
            <div className="hero-mobile-sub-venue">
              SWEAR IN CONTINENTAL · MIZU COMMONROOM
            </div>
          </div>

          <div className="hero-mobile-bottom-editorial">
            <div className="hero-mobile-divider" />
            <div className="hero-mobile-schedule-dock">
              <div className="hero-mobile-schedule-item">
                <span className="hero-mobile-sched-date">30 OCT</span>
                <span className="hero-mobile-sched-artist">MALVIN</span>
                <span className="hero-mobile-sched-meta">22:00 · MIZU</span>
              </div>

              <div className="hero-mobile-schedule-item align-right">
                <span className="hero-mobile-sched-date">31 OCT</span>
                <span className="hero-mobile-sched-artist">FAR</span>
                <span className="hero-mobile-sched-meta">23:30 · MIZU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 4: Climax Arrival ("WELCOME TO THE ASSEMBLY") */}
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
