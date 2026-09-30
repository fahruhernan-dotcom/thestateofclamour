import React, { useRef, useEffect, useCallback } from 'react';
import { silenceSec1, silenceSec2, setAudioOwner, getAudioOwner, canSec1PlayAudio } from '../utils/audioCoordinator';

interface Props {
  onExploreGuests?: () => void;
}

export const GuestStorytellingTransition: React.FC<Props> = ({ onExploreGuests }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Direct DOM Refs (Zero React Re-renders on scroll)
  const gpuCanvasRef = useRef<HTMLDivElement | null>(null);
  const photoImgRef = useRef<HTMLVideoElement | null>(null);
  const photoHairlineRef = useRef<HTMLDivElement | null>(null);
  const photoVignetteRef = useRef<HTMLDivElement | null>(null);
  const welcomeOverlayRef = useRef<HTMLDivElement | null>(null);
  const stageGlowRef = useRef<HTMLDivElement | null>(null);
  const bgAmbientRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const videoDimRef = useRef<HTMLDivElement | null>(null);

  // Audio State & Persistence
  const isPlayingAudioRef = useRef(false);
  const isSectionVisibleRef = useRef(false);

  // Desktop/Tablet Clusters
  const clusterTopLeftRef = useRef<HTMLDivElement | null>(null);
  const clusterTopRightRef = useRef<HTMLDivElement | null>(null);
  const clusterLeftMidRef = useRef<HTMLDivElement | null>(null);
  const clusterBottomRightRef = useRef<HTMLDivElement | null>(null);

  // Mobile Layout Refs
  const mobileTopRef = useRef<HTMLDivElement | null>(null);
  const mobileCueRef = useRef<HTMLDivElement | null>(null);
  const mobileBottomRef = useRef<HTMLDivElement | null>(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  useEffect(() => {
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let isMob = vw < 768;
    let isSmallMob = vw < 480;
    let isTab = vw >= 768 && vw < 1024;

    // High performance direct DOM mutation (0ms React Overhead, locked 60/120fps)
    const renderFrame = (progress: number) => {
      // Dimensions
      const initialHeight = isSmallMob
        ? Math.min(vh * 0.42, 340)
        : isMob
        ? Math.min(vh * 0.46, 380)
        : isTab
        ? Math.min(vh * 0.52, 470)
        : Math.min(vh * 0.58, 550);
      const initialWidth = initialHeight * (9 / 16);

      // Expansion reaches full coverage early (progress = 0.42)
      const expansionProgress = Math.min(1, Math.max(0, progress / 0.42));
      const easedP = Math.pow(expansionProgress, 1.3);

      const currentWidth = initialWidth + (vw - initialWidth) * easedP;
      const currentHeight = initialHeight + (vh - initialHeight) * easedP;

      // Pure hardware-composited integer scissor insets (Zero re-tessellation)
      const insetY = Math.max(0, Math.round((vh - currentHeight) / 2));
      const insetX = Math.max(0, Math.round((vw - currentWidth) / 2));

      if (gpuCanvasRef.current) {
        const clipStr = `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px)`;
        gpuCanvasRef.current.style.clipPath = clipStr;
        gpuCanvasRef.current.style.setProperty('-webkit-clip-path', clipStr);
      }

      // Camera push-in
      if (photoImgRef.current) {
        const scaleVal = (1 + 0.09 * Math.pow(progress, 1.2)).toFixed(4);
        photoImgRef.current.style.transform = `scale(${scaleVal}) translateZ(0)`;
      }

      // Initial border & vignette
      if (photoHairlineRef.current) {
        const borderOp = Math.max(0, 1 - progress * 2.8);
        photoHairlineRef.current.style.opacity = borderOp.toFixed(3);
      }
      if (photoVignetteRef.current) {
        photoVignetteRef.current.style.opacity = (1 - progress * 0.35).toFixed(3);
      }

      // Background void & stage glow
      if (bgAmbientRef.current) {
        bgAmbientRef.current.style.opacity = (1 - progress * 0.4).toFixed(3);
      }
      if (stageGlowRef.current) {
        const glowOp = Math.min(1, Math.max(0, (progress - 0.08) * 1.5));
        stageGlowRef.current.style.opacity = glowOp.toFixed(3);
      }

      // Desktop initial typography fading & drifting (0.0 -> 0.22)
      const op1 = Math.max(0, 1 - progress / 0.20);
      const drift1X = Math.round(-55 * progress);
      const drift1Y = Math.round(-35 * progress);
      const rot1 = (-1.5 * progress).toFixed(2);

      const op2 = Math.max(0, 1 - Math.max(0, progress - 0.02) / 0.22);
      const drift2X = Math.round(60 * progress);
      const drift2Y = Math.round(-25 * progress);
      const rot2 = (1.8 * progress).toFixed(2);

      const op3 = Math.max(0, 1 - Math.max(0, progress - 0.03) / 0.20);
      const drift3X = Math.round(-60 * progress);

      const op4 = Math.max(0, 1 - Math.max(0, progress - 0.03) / 0.22);
      const drift4X = Math.round(60 * progress);
      const drift4Y = Math.round(35 * progress);
      const rot4 = (1.5 * progress).toFixed(2);

      const opCue = Math.max(0, 1 - progress / 0.10);

      // Desktop clusters
      if (clusterTopLeftRef.current) {
        clusterTopLeftRef.current.style.opacity = op1.toFixed(3);
        clusterTopLeftRef.current.style.transform = `translate3d(${drift1X}px, ${drift1Y}px, 0) rotate(${rot1}deg)`;
        clusterTopLeftRef.current.style.pointerEvents = op1 > 0.05 ? 'auto' : 'none';
      }
      if (clusterTopRightRef.current) {
        clusterTopRightRef.current.style.opacity = op2.toFixed(3);
        clusterTopRightRef.current.style.transform = `translate3d(${drift2X}px, ${drift2Y}px, 0) rotate(${rot2}deg)`;
        clusterTopRightRef.current.style.pointerEvents = op2 > 0.05 ? 'auto' : 'none';
      }
      if (clusterLeftMidRef.current) {
        clusterLeftMidRef.current.style.opacity = op3.toFixed(3);
        clusterLeftMidRef.current.style.transform = `translate3d(${drift3X}px, -50%, 0)`;
        clusterLeftMidRef.current.style.pointerEvents = op3 > 0.05 ? 'auto' : 'none';
      }
      if (clusterBottomRightRef.current) {
        clusterBottomRightRef.current.style.opacity = op4.toFixed(3);
        clusterBottomRightRef.current.style.transform = `translate3d(${drift4X}px, ${drift4Y}px, 0) rotate(${rot4}deg)`;
        clusterBottomRightRef.current.style.pointerEvents = op4 > 0.05 ? 'auto' : 'none';
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = opCue.toFixed(3);
      }

      // Mobile clusters — extended smooth fade (0.0 -> 0.30) to eliminate any black dead zone
      const mobOp1 = Math.max(0, 1 - progress / 0.30);
      const mobOp4 = Math.max(0, 1 - Math.max(0, progress - 0.04) / 0.30);
      const mobCueOp = Math.max(0, 1 - progress / 0.18);

      if (mobileTopRef.current) {
        mobileTopRef.current.style.opacity = mobOp1.toFixed(3);
        mobileTopRef.current.style.transform = `translate3d(0, ${drift1Y}px, 0)`;
      }
      if (mobileCueRef.current) {
        mobileCueRef.current.style.opacity = mobCueOp.toFixed(3);
      }
      if (mobileBottomRef.current) {
        mobileBottomRef.current.style.opacity = mobOp4.toFixed(3);
        mobileBottomRef.current.style.transform = `translate3d(0, ${drift4Y}px, 0)`;
      }

      // Welcome Climax Reveal (Progress 0.30 -> 0.46 -> 0.90) seamlessly meeting outgoing dock
      let welcomeOpacity = 0;
      let welcomeTranslateY = 28;

      if (progress < 0.30) {
        welcomeOpacity = 0;
        welcomeTranslateY = 28;
      } else if (progress < 0.46) {
        const p = (progress - 0.30) / 0.16;
        welcomeOpacity = p;
        welcomeTranslateY = Math.round(28 * (1 - Math.pow(p, 0.8)));
      } else if (progress <= 0.90) {
        welcomeOpacity = 1;
        welcomeTranslateY = 0;
      } else {
        const p = (progress - 0.90) / 0.10;
        welcomeOpacity = Math.max(0, 1 - p * 0.9);
        welcomeTranslateY = Math.round(-20 * p);
      }

      if (welcomeOverlayRef.current) {
        welcomeOverlayRef.current.style.opacity = welcomeOpacity.toFixed(3);
        welcomeOverlayRef.current.style.transform = `translate3d(0, ${welcomeTranslateY}px, 0)`;
        welcomeOverlayRef.current.style.pointerEvents = welcomeOpacity > 0.4 ? 'auto' : 'none';
      }

      // Video Cinematic Dim — darken behind welcome text for dramatic contrast
      if (videoDimRef.current) {
        const dimOpacity = Math.min(0.72, welcomeOpacity * 0.72);
        videoDimRef.current.style.opacity = dimOpacity.toFixed(3);
      }
    };

    const updateDimensions = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      isMob = vw < 768;
      isSmallMob = vw < 480;
      isTab = vw >= 768 && vw < 1024;
      renderFrame(smoothProgressRef.current);
    };

    window.addEventListener('resize', updateDimensions, { passive: true });
    // Immediately calculate dimensions and render frame 0 on mount!
    updateDimensions();

    let rafId: number | null = null;
    let isTicking = false;
    let isActive = true;

    const tick = () => {
      if (!isActive) return;
      const diff = targetProgressRef.current - smoothProgressRef.current;
      const factor = Math.abs(diff) > 0.1 ? 0.36 : 0.22;

      if (Math.abs(diff) > 0.0003) {
        smoothProgressRef.current += diff * factor;
        renderFrame(smoothProgressRef.current);
        rafId = requestAnimationFrame(tick);
      } else {
        smoothProgressRef.current = targetProgressRef.current;
        renderFrame(smoothProgressRef.current);
        isTicking = false;
        rafId = null;
      }
    };

    const requestTick = () => {
      if (!isTicking && isActive) {
        isTicking = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const checkAudioPlayback = (inView: boolean) => {
      const video = photoImgRef.current;
      if (!video) return;

      // Always guarantee video visuals keep playing continuously in an infinite loop
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
              // Browser autoplay policy blocked unmuted play without gesture yet
              video.muted = true;
              isPlayingAudioRef.current = false;
              video.play().catch(() => {});
            });
        }
      } else {
        // Out of section or Section 2 is active: mute audio (keep video looping)
        video.muted = true;
        isPlayingAudioRef.current = false;
        if (getAudioOwner() === 'sec1-storytelling') {
          setAudioOwner('none');
        }
      }
    };

    const calculateTargetProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance > 0) {
        const currentScroll = -rect.top;
        const rawProgress = currentScroll / scrollableDistance;
        targetProgressRef.current = Math.max(0, Math.min(1, rawProgress));
        requestTick();
      }

      // Section 1 is considered active for audio when:
      // 1. Scrolled into view
      // 2. Section 1 has NOT yet scrolled completely away
      // 3. Section 2 has NOT claimed audio dominance
      const inView = rect.top < window.innerHeight * 0.60 && 
                     rect.bottom > window.innerHeight * 0.25 && 
                     canSec1PlayAudio();

      if (inView !== isSectionVisibleRef.current) {
        isSectionVisibleRef.current = inView;
        checkAudioPlayback(inView);
      } else if (!inView && isPlayingAudioRef.current) {
        // Safety guard: immediately mute if no longer valid
        const video = photoImgRef.current;
        if (video) {
          video.muted = true;
        }
        isPlayingAudioRef.current = false;
        if (getAudioOwner() === 'sec1-storytelling') {
          setAudioOwner('none');
        }
      }
    };

    window.addEventListener('scroll', calculateTargetProgress, { passive: true });
    calculateTargetProgress();

    // IntersectionObserver: Auto-play unmuted when section is visible, auto-stop when leaving!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const valid = entry.isIntersecting && canSec1PlayAudio();
          if (valid !== isSectionVisibleRef.current) {
            isSectionVisibleRef.current = valid;
            checkAudioPlayback(valid);
          }
          if (entry.isIntersecting) {
            requestTick();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Global gesture listener: when user scrolls, touches, clicks, or interacts, immediately unmute!
    const unlockOnGesture = () => {
      const video = photoImgRef.current;
      if (
        video && 
        isSectionVisibleRef.current && 
        canSec1PlayAudio()
      ) {
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
        if (video) {
          video.muted = true;
        }
        isPlayingAudioRef.current = false;
      }
    };

    const handleSec1Silenced = () => {
      const video = photoImgRef.current;
      if (video) {
        video.muted = true;
      }
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

    renderFrame(0);
    requestTick();

    return () => {
      isActive = false;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', calculateTargetProgress);
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
    // Immediately silence Section 1 before scrolling to Lineup!
    silenceSec1();
    isPlayingAudioRef.current = false;

    if (onExploreGuests) {
      onExploreGuests();
    } else {
      const el = document.getElementById('lineup');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onExploreGuests]);

  return (
    <section
      ref={containerRef}
      id="the-guests"
      className="storytelling-container"
      aria-label="Scroll-Driven Storytelling — The Sanctuary Unsealed"
    >
      <div className="storytelling-sticky">
        {/* Parallax Background Void */}
        <div ref={bgAmbientRef} className="storytelling-bg-ambient" />

        {/* Volumetric Oxblood & Golden Stage Glow */}
        <div ref={stageGlowRef} className="storytelling-stage-glow" />

        {/* Editorial Text Layer (Desktop & Tablet) */}
        <div className="storytelling-editorial-layer story-desktop-only">
          <div className="storytelling-editorial-bounds">
            {/* Top-Left Cluster */}
            <div ref={clusterTopLeftRef} className="story-cluster-top-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', letterSpacing: '0.3em', color: 'var(--color-gold-antique)', textTransform: 'uppercase' }}>
                  01 // THE GUESTS
                </span>
                <div style={{ width: '2rem', height: '1px', backgroundColor: 'rgba(197, 168, 105, 0.28)' }} />
              </div>
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

            {/* Top-Right Cluster: Performer 01 (Malvin) */}
            <div ref={clusterTopRightRef} className="story-cluster-top-right">
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

            {/* Left-Mid Cluster: Vertical Axis Meta */}
            <div ref={clusterLeftMidRef} className="story-cluster-left-mid">
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

            {/* Bottom-Right Cluster: Performer 02 (Far) */}
            <div ref={clusterBottomRightRef} className="story-cluster-bottom-right">
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

        {/* Mobile Editorial Layout */}
        <div className="storytelling-mobile-layer story-mobile-only">
          {/* Top Editorial Header: Monumental & Clean */}
          <div ref={mobileTopRef} className="story-mobile-top-editorial">
            <div className="story-mobile-kicker-row">
              <span className="story-mobile-eyebrow">01 // THE GUESTS</span>
              <span className="story-mobile-date-badge">30 — 31 OKT 2026</span>
            </div>
            <h2 className="story-mobile-monument-title text-gold-metallic">
              THE GUESTS
            </h2>
            <p className="story-mobile-sub-venue">
              SWEAR IN CONTINENTAL · MIZU COMMONROOM
            </p>
          </div>

          {/* Bottom Dock: Refined Artist Lineup & Integrated Scroll Cue */}
          <div ref={mobileBottomRef} className="story-mobile-bottom-editorial">
            <div ref={mobileCueRef} className="story-mobile-scroll-cue">
              <span className="story-mobile-scroll-text">GULIR UNTUK MELANGKAH MASUK</span>
              <span className="story-mobile-scroll-arrow">↓</span>
            </div>

            <div className="story-mobile-lineup-dock">
              <div className="story-mobile-artist-item">
                <span className="artist-item-day">DAY 1 // 30 OKT</span>
                <span className="artist-item-name">MALVIN</span>
                <span className="artist-item-time">22:00 WIB · MIZU</span>
              </div>

              <div className="story-mobile-dock-divider" />

              <div className="story-mobile-artist-item text-right">
                <span className="artist-item-day">DAY 2 // 31 OKT</span>
                <span className="artist-item-name">FAR</span>
                <span className="artist-item-time">23:30 WIB · MIZU</span>
              </div>
            </div>
          </div>
        </div>

        {/* GPU-Accelerated Unmasking Canvas */}
        <div ref={gpuCanvasRef} className="storytelling-gpu-canvas">
          <div className="storytelling-photo-frame">
            <video
              ref={photoImgRef}
              src="/assets/how2026_recap.mp4"
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

            {/* Cinematic Video Dim Overlay (darkens when welcome text appears) */}
            <div ref={videoDimRef} className="storytelling-video-dim" style={{ opacity: 0 }} />

            {/* Cinematic Radial Vignette & Edge Atmosphere */}
            <div ref={photoVignetteRef} className="storytelling-photo-vignette" />

            {/* Initial Frame Border */}
            <div ref={photoHairlineRef} className="storytelling-photo-hairline" />
          </div>
        </div>

        {/* Climax Welcome Motion Reveal ("WELCOME TO THE ASSEMBLY") */}
        <div ref={welcomeOverlayRef} className="storytelling-arrival-overlay">
          {/* Pre-computed Radial Backlight Glow without filter: blur() */}
          <div className="story-welcome-ambient-glow" />

          <div className="story-welcome-content">
            {/* Monumental Welcome Headline */}
            <h2 className="story-welcome-title">
              WELCOME TO<br />THE ASSEMBLY
            </h2>

            {/* Golden Accent Divider */}
            <div className="story-welcome-divider" />

            {/* Minimal Scroll Cue */}
            <div
              className="story-welcome-scroll-hint"
              onClick={handleLineupScroll}
              role="button"
              tabIndex={0}
              aria-label="Scroll for more"
            >
              <span className="story-welcome-scroll-text">SCROLL FOR MORE</span>
              <span className="story-welcome-scroll-arrow">↓</span>
            </div>
          </div>
        </div>

        {/* Initial Scroll Prompt (Desktop / Tablet only) */}
        <div ref={scrollCueRef} className="storytelling-scroll-cue story-desktop-only">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', letterSpacing: '0.35em', color: 'rgba(197, 168, 105, 0.85)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            GULIR UNTUK MELANGKAH MASUK KE PERTEMUAN
          </span>
          <div className="storytelling-scroll-cue-line" />
        </div>
      </div>
    </section>
  );
};

export default GuestStorytellingTransition;
