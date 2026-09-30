import React, { useRef, useEffect, useState } from 'react';
import { EventData } from '../types';

interface Props {
  event: EventData;
  onExploreGuests?: () => void;
}

export const HeroSection: React.FC<Props> = ({ event }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);
  const spotlightGlowRef = useRef<HTMLDivElement | null>(null);

  const [isHeadlineHovered, setIsHeadlineHovered] = useState(false);
  const isHeadlineHoveredRef = useRef(false);

  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const currentRadius = useRef(260);
  const isHoveredRef = useRef(false);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);
  const hasTouchedRef = useRef(false);
  const cachedRectRef = useRef({ width: 1440, height: 900, left: 0, top: 0 });
  const requestAnimationRef = useRef<() => void>(() => {});

  const getHeadlineCenter = () => {
    if (!headlineRef.current || !heroRef.current) {
      return {
        x: cachedRectRef.current.width * 0.5,
        y: cachedRectRef.current.height * 0.22,
      };
    }
    const heroRect = heroRef.current.getBoundingClientRect();
    const h1Rect = headlineRef.current.getBoundingClientRect();
    return {
      x: h1Rect.left - heroRect.left + h1Rect.width * 0.5,
      y: h1Rect.top - heroRect.top + h1Rect.height * 0.5,
      width: h1Rect.width,
      height: h1Rect.height,
    };
  };

  // Demand-driven cursor-following spotlight (0% CPU when idle, zero layout thrashing)
  useEffect(() => {
    let rafId: number | null = null;
    let isActive = true;
    let isLoopRunning = false;
    let isHeroVisible = true;

    const updateRect = () => {
      if (heroRef.current) {
        const r = heroRef.current.getBoundingClientRect();
        cachedRectRef.current = { width: r.width, height: r.height, left: r.left, top: r.top };
      }
      isMobileRef.current = window.innerWidth < 768;
    };
    updateRect();
    window.addEventListener('resize', updateRect, { passive: true });

    // Adaptive spotlight radius: tight focus on mobile, wide on desktop, expansive on headline hover
    const getRadius = () => {
      if (isMobileRef.current) {
        return isHeadlineHoveredRef.current ? 200 : 140;
      }
      return isHeadlineHoveredRef.current ? 380 : 260;
    };

    const renderSpotlight = (x: number, y: number, r: number, hovered: boolean) => {
      const opacityStr = hovered ? '1' : '0';
      const innerSolid = Math.round(r * 0.52);
      const midFade = Math.round(r * 0.74);
      const outerFade = Math.round(r * 0.92);
      const cursorMask = `radial-gradient(circle ${r}px at ${Math.round(x)}px ${Math.round(y)}px, black 0%, black ${innerSolid}px, rgba(0, 0, 0, 0.8) ${midFade}px, rgba(0, 0, 0, 0.25) ${outerFade}px, transparent ${r}px)`;

      if (revealLayerRef.current) {
        revealLayerRef.current.style.opacity = opacityStr;
        revealLayerRef.current.style.maskImage = cursorMask;
        revealLayerRef.current.style.setProperty('-webkit-mask-image', cursorMask);
      }

      if (spotlightGlowRef.current) {
        spotlightGlowRef.current.style.opacity = opacityStr;
        spotlightGlowRef.current.style.transform = `translate3d(${Math.round(x - r)}px, ${Math.round(y - r)}px, 0)`;
        spotlightGlowRef.current.style.width = `${r * 2}px`;
        spotlightGlowRef.current.style.height = `${r * 2}px`;
      }
    };

    const lerpLoop = () => {
      if (!isActive || !isHeroVisible) {
        isLoopRunning = false;
        return;
      }
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      const targetR = getRadius();
      const dr = targetR - currentRadius.current;

      const hasMove = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      const hasRadiusChange = Math.abs(dr) > 0.5;

      if (hasMove || hasRadiusChange) {
        currentPos.current.x += dx * 0.45;
        currentPos.current.y += dy * 0.45;
        currentRadius.current += dr * 0.25;
        renderSpotlight(currentPos.current.x, currentPos.current.y, Math.round(currentRadius.current), isHoveredRef.current);
        rafId = requestAnimationFrame(lerpLoop);
      } else {
        currentPos.current.x = targetPos.current.x;
        currentPos.current.y = targetPos.current.y;
        currentRadius.current = targetR;
        renderSpotlight(currentPos.current.x, currentPos.current.y, Math.round(currentRadius.current), isHoveredRef.current);
        isLoopRunning = false;
        rafId = null;
      }
    };

    const requestAnimation = () => {
      if (!isLoopRunning && isActive && isHeroVisible) {
        isLoopRunning = true;
        rafId = requestAnimationFrame(lerpLoop);
      }
    };
    requestAnimationRef.current = requestAnimation;

    // Disconnect loop when Hero is not on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            updateRect();
            requestAnimation();
          } else {
            if (rafId) cancelAnimationFrame(rafId);
            isLoopRunning = false;
          }
        });
      },
      { threshold: 0.05 }
    );
    if (heroRef.current) observer.observe(heroRef.current);

    // Mobile Teaser (Anchored directly to the headline text, never the section midpoint)
    let teaserTimeout: ReturnType<typeof setTimeout> | null = null;
    if (isMobileRef.current && heroRef.current) {
      teaserTimeout = setTimeout(() => {
        if (hasTouchedRef.current) return;
        const center = getHeadlineCenter();
        const r = getRadius();
        targetPos.current = { x: center.x, y: center.y };
        currentPos.current = { x: center.x, y: center.y };
        currentRadius.current = r;
        isHoveredRef.current = true;
        renderSpotlight(center.x, center.y, r, true);
        setTimeout(() => {
          if (!hasTouchedRef.current) {
            isHoveredRef.current = false;
            if (revealLayerRef.current) revealLayerRef.current.style.opacity = '0';
            if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '0';
          }
        }, 2500);
      }, 1200);
    }

    return () => {
      isActive = false;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', updateRect);
      if (teaserTimeout) clearTimeout(teaserTimeout);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPos.current = { x, y };

    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      currentPos.current = { x, y };
      if (revealLayerRef.current) revealLayerRef.current.style.opacity = '1';
      if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '1';
    }
    requestAnimationRef.current();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPos.current = { x, y };
    currentPos.current = { x, y };
    isHoveredRef.current = true;
    if (revealLayerRef.current) revealLayerRef.current.style.opacity = '1';
    if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '1';
    requestAnimationRef.current();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    isHeadlineHoveredRef.current = false;
    setIsHeadlineHovered(false);
    const center = getHeadlineCenter();
    targetPos.current = { x: center.x, y: center.y };
    if (revealLayerRef.current) revealLayerRef.current.style.opacity = '0';
    if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '0';
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (!e.touches[0] || !heroRef.current) return;
    hasTouchedRef.current = true;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    targetPos.current = { x, y };
    currentPos.current = { x, y };
    isHoveredRef.current = true;
    if (revealLayerRef.current) revealLayerRef.current.style.opacity = '1';
    if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '1';
    requestAnimationRef.current();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!e.touches[0] || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    targetPos.current = { x, y };
    requestAnimationRef.current();
  };

  const handleTouchEnd = () => {
    isHoveredRef.current = false;
    if (revealLayerRef.current) revealLayerRef.current.style.opacity = '0';
    if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '0';
  };

  const venueLabel = event.venueCity && event.venueCity !== 'CENTRAL MONUMENT'
    ? `${event.venueCity} · ${event.venueName}`
    : 'BANDUNG · SECRET MONUMENT';

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-editorial-section"
      aria-label="The State of Clamour // Swear In Continental"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Base Sanctuary Image Layer (BG_IMAGE_1) */}
      <div className="hero-base-layer" aria-hidden="true">
        <img
          src="/assets/hero_bg_base.jpg"
          alt="Swear In Continental Base Sanctuary"
          className="hero-monument-img"
          loading="eager"
        />
      </div>

      {/* 2. Atmospheric Volumetric Dark Smoke & Fog Backdrop */}
      <div className="hero-smoke-backdrop" aria-hidden="true" />

      {/* 3. Reveal Horror Character Image Layer (BG_IMAGE_2) via CSS Radial Spotlight Mask */}
      <div
        ref={revealLayerRef}
        className="hero-reveal-layer"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <img
          src="/assets/hero_bg_reveal.jpg"
          alt="Swear In Continental Supernatural Horror Reveal"
          className="hero-monument-img"
          loading="eager"
        />
      </div>

      {/* 4. Ambient Feathered Spotlight Edge Glow */}
      <div
        ref={spotlightGlowRef}
        className="hero-spotlight-glow"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      {/* 5. Editorial Vignette & Depth Mask */}
      <div className="hero-editorial-vignette" aria-hidden="true" />

      {/* 6. Cinematic Film Poster Layout (IDENTITY → TITLE → RED ENTRANCE → METADATA → ENTER) */}
      <div className="hero-poster-container">
        {/* Upper Poster Stack: Identity & Campaign Title */}
        <div className={`hero-poster-top ${isHeadlineHovered ? 'is-headline-hovered' : ''}`}>
          <span className="hero-identity-label">
            THE STATE OF CLAMOUR
          </span>

          <h1
            ref={headlineRef}
            className={`hero-editorial-headline ${isHeadlineHovered ? 'is-hovered' : ''}`}
            onMouseEnter={() => {
              isHeadlineHoveredRef.current = true;
              setIsHeadlineHovered(true);
              const center = getHeadlineCenter();
              targetPos.current = { x: center.x, y: center.y };
              isHoveredRef.current = true;
              if (revealLayerRef.current) revealLayerRef.current.style.opacity = '1';
              if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = '1';
              requestAnimationRef.current();
            }}
            onMouseLeave={() => {
              isHeadlineHoveredRef.current = false;
              setIsHeadlineHovered(false);
              const center = getHeadlineCenter();
              targetPos.current = { x: center.x, y: center.y };
              requestAnimationRef.current();
            }}
            onTouchStart={() => {
              const next = !isHeadlineHoveredRef.current;
              isHeadlineHoveredRef.current = next;
              setIsHeadlineHovered(next);
              const center = getHeadlineCenter();
              targetPos.current = { x: center.x, y: center.y };
              isHoveredRef.current = next;
              if (revealLayerRef.current) revealLayerRef.current.style.opacity = next ? '1' : '0';
              if (spotlightGlowRef.current) spotlightGlowRef.current.style.opacity = next ? '1' : '0';
              requestAnimationRef.current();
            }}
          >
            <span className="hero-headline-line">SWEAR IN</span>
            <span className="hero-headline-line">CONTINENTAL</span>
          </h1>
        </div>

        {/* Generous Negative Space: reveals architecture, fog, darkness, and glowing red entrance */}
        <div className="hero-poster-spacer" aria-hidden="true" />

        {/* Lower Poster Stack: Factual Metadata */}
        <div className="hero-poster-bottom">
          <div className="hero-poster-meta">
            <span className="hero-meta-date">30 — 31 OCTOBER 2026</span>
            <span className="hero-meta-venue">{venueLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
