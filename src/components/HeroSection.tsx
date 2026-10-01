import React, { useRef, useEffect } from 'react';
import { EventData } from '../types';
import { HERO_VIDEO_CONFIG, HERO_CINEMATIC_BEATS, mapScrollProgressToVideoTime } from '../config/heroTimeline';
import { createVideoScrubber, VideoScrubberController } from '../utils/videoScrollScrubber';
import { getCachedVideoUrl } from '../utils/mediaPreloader';

interface Props {
  event: EventData;
}

export const HeroSection: React.FC<Props> = ({ event }) => {
  const heroTrackRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const posterContainerRef = useRef<HTMLDivElement | null>(null);
  const scrubberRef = useRef<VideoScrubberController | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly guarantee video is paused so it never autoplays on page load
    video.pause();
    video.currentTime = 0;

    // Initialize the performance-oriented scrubber
    const scrubber = createVideoScrubber(video, {
      duration: HERO_VIDEO_CONFIG.duration,
      lerpFactor: 0.18,
      seekThreshold: 0.035, // ~1 frame at 24fps to prevent seek thrashing
    });
    scrubberRef.current = scrubber;

    const onScrollOrResize = () => {
      if (!heroTrackRef.current) return;
      const rect = heroTrackRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));

      // 1. Map normalized scroll progress to non-linear cinematic video target time
      const targetTime = mapScrollProgressToVideoTime(progress);
      scrubber.seekToTime(targetTime);

      // 2. Direct DOM mutation for typography fade & upward drift (Zero React re-render overhead)
      if (posterContainerRef.current) {
        const [fadeStart, fadeEnd] = HERO_CINEMATIC_BEATS.scrollMap.typographyFade;

        if (progress <= fadeStart) {
          posterContainerRef.current.style.opacity = '1';
          posterContainerRef.current.style.transform = 'translate3d(0, 0, 0)';
          posterContainerRef.current.style.pointerEvents = 'auto';
        } else if (progress >= fadeEnd) {
          posterContainerRef.current.style.opacity = '0';
          posterContainerRef.current.style.transform = 'translate3d(0, -32px, 0) scale(1.03)';
          posterContainerRef.current.style.pointerEvents = 'none';
        } else {
          const ratio = (progress - fadeStart) / (fadeEnd - fadeStart);
          const opacity = (1 - ratio).toFixed(3);
          const translateY = Math.round(-32 * ratio);
          const scale = (1 + 0.03 * ratio).toFixed(3);

          posterContainerRef.current.style.opacity = opacity;
          posterContainerRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          posterContainerRef.current.style.pointerEvents = ratio > 0.85 ? 'none' : 'auto';
        }
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial position sync on mount (ensures scroll = 0 displays frame 0 immediately)
    onScrollOrResize();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      scrubber.destroy();
      scrubberRef.current = null;
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
        {/* 1. Pre-rendered Cinematic Background Video (Controlled exclusively via scroll) */}
        <video
          ref={videoRef}
          src={getCachedVideoUrl(HERO_VIDEO_CONFIG.src)}
          poster={HERO_VIDEO_CONFIG.poster}
          className="hero-cinematic-video"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* 2. Editorial Film Vignette (Deepens borders and guides eye into cathedral center) */}
        <div className="hero-editorial-vignette" aria-hidden="true" />

        {/* 3. Cinematic Film Poster Layout (Dissolves gracefully on scroll approach) */}
        <div ref={posterContainerRef} className="hero-poster-container">
          {/* Upper Poster Stack: Identity & Campaign Headline */}
          <div className="hero-poster-top">
            <span className="hero-identity-label">
              THE STATE OF CLAMOUR
            </span>

            <h1 className="hero-editorial-headline">
              <span className="hero-headline-line">SWEAR IN</span>
              <span className="hero-headline-line">CONTINENTAL</span>
            </h1>
          </div>

          {/* Generous Negative Space: lets the grand architecture and street breathe */}
          <div className="hero-poster-spacer" aria-hidden="true" />

          {/* Lower Poster Stack: Factual Metadata & Subtle Guidance */}
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
