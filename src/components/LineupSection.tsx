import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artist } from '../types';
import { IS_LINEUP_TEASER_MODE } from '../data/eventData';
import { silenceSec1, setAudioOwner, getAudioOwner, isSec1AudioActive } from '../utils/audioCoordinator';
import { getCachedVideoUrl } from '../utils/mediaPreloader';
import { useIsMobile } from '../hooks/useIsMobile';
import { useCarouselOffset } from '../hooks/useCarouselOffset';
import { LineupSectionMobile } from './mobile/LineupSectionMobile';

interface Props {
  artists: Artist[];
  onToast?: (msg: string) => void;
  onOpenNight1?: () => void;
  onOpenNight2?: () => void;
}

interface GuestCardProps {
  artist: Artist;
  artistIndex: number;
  cardIndex: number;
  isFlashing: boolean;
  isClone?: boolean;
  isCardActive: boolean;
  isAudioPlaying: boolean;
  onCardTap: (artist: Artist, cardIdx: number, artistIdx: number) => void;
  onCardMouseEnter: (artist: Artist, cardIdx: number, artistIdx: number) => void;
  onCardMouseLeave: () => void;
  onOpenModal: (artist: Artist) => void;
}

const GuestCard: React.FC<GuestCardProps> = ({
  artist,
  artistIndex,
  cardIndex,
  isFlashing,
  isClone,
  isCardActive,
  isAudioPlaying,
  onCardTap,
  onCardMouseEnter,
  onCardMouseLeave,
  onOpenModal,
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Flyer card: static poster visual + audio-only source (e.g. Gothic poster with Far's track)
  const isFlyerCard = !artist.videoUrl && !!artist.audioPreviewUrl;
  const mediaSrc = artist.videoUrl || artist.audioPreviewUrl || null;

  const hasFinePointer = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  // Desktop Mouse Tilt: only applied on true cursor devices via CSS variables
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!hasFinePointer()) return;
    const card = cardRef.current;
    if (!card) return;
    const w = card.clientWidth || 360;
    const h = card.clientHeight || 520;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const rotateX = ((y - h / 2) / (h / 2)) * -4.5;
    const rotateY = ((x - w / 2) / (w / 2)) * 4.5;

    card.style.setProperty('--card-tilt-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--card-tilt-y', `${rotateY.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => {
    // Only preview audio on hover for cursor/mouse devices (avoids synthesized hover conflicts on iPad/touchscreens)
    if (hasFinePointer()) {
      onCardMouseEnter(artist, cardIndex, artistIndex);
    }
  };

  const handleMouseLeave = () => {
    if (hasFinePointer()) {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--card-tilt-x', '0deg');
        cardRef.current.style.setProperty('--card-tilt-y', '0deg');
      }
      onCardMouseLeave();
    }
  };

  const handleCardClick = () => {
    // Tap or click on the card body toggles the artist audio preview on/off (both touch/iPad and cursor devices)
    // Synchronously unlock and play video sound within the tap gesture for iOS Safari / iPadOS
    const video = videoRef.current;
    if (video && !isAudioPlaying) {
      video.muted = false;
      video.volume = 0.95;
      video.play().catch(() => { });
    }
    onCardTap(artist, cardIndex, artistIndex);
  };

  // Video visuals only play when this card is actively centered and visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isCardActive) {
      if (!video.paused) {
        video.pause();
      }
    } else {
      if (video.paused) {
        video.play().catch(() => { });
      }
    }
  }, [isCardActive]);

  // Synchronize audio state declaratively
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAudioPlaying) {
      video.volume = 0.95;
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser autoplay policy blocked unmuted, fallback to muted play
          video.muted = true;
          video.play().catch(() => { });
        });
      }
    } else {
      video.muted = true;
    }
  }, [isAudioPlaying]);

  return (
    <article
      ref={cardRef}
      className={`guest-card-container is-video-active ${isFlyerCard ? 'is-flyer-card' : ''} ${isClone ? 'is-clone' : ''} ${isAudioPlaying ? 'is-playing-audio' : ''}`}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
      title={isAudioPlaying ? 'Klik untuk jeda preview audio' : 'Klik untuk putar preview audio'}
      aria-label={`${artist.name} - ${artist.stageName}`}
    >
      <div className="guest-portrait-frame">
        {isFlyerCard && (
          <img
            src={artist.imageUrl}
            alt={`${artist.name} — official flyer`}
            className="guest-portrait-img"
            loading="lazy"
            draggable={false}
          />
        )}
        {mediaSrc ? (
          <video
            ref={videoRef}
            src={getCachedVideoUrl(mediaSrc) || mediaSrc}
            poster={isFlyerCard ? undefined : (artist.posterUrl || artist.imageUrl)}
            className={isFlyerCard ? 'guest-audio-only-media' : 'guest-portrait-video'}
            aria-hidden={isFlyerCard ? true : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            draggable={false}
            onEnded={(e) => {
              const v = e.currentTarget;
              v.currentTime = 0;
              v.play().catch(() => { });
            }}
          />
        ) : (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="guest-portrait-img"
            loading="lazy"
            draggable={false}
          />
        )}

        {/* Strobe Camera Flash Flare */}
        <div
          className={`guest-strobe-flash ${isFlashing ? 'is-flashing' : ''}`}
          aria-hidden="true"
        />

        {/* Portrait Dark Scrim */}
        <div className="guest-portrait-scrim" />
      </div>

      <div className="guest-card-info-pane">
        <div className="guest-card-kicker-row">
          <p className="guest-day-kicker">
            {artist.dayLabel} · {artist.performanceTime}
          </p>
          {isAudioPlaying && (
            <span className="guest-sound-active-tag" title="Audio Preview Active">
              <span className="equalizer-bars mini">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </span>
              <span>LIVE</span>
            </span>
          )}
        </div>
        <h3 className="guest-artist-name">
          {artist.name}
        </h3>
        <p className="guest-performance-meta">
          STAGE // {artist.stageName}
        </p>

        {/* Dedicated Action Button to Detail Event Modal (hidden during teaser mode) */}
        {!IS_LINEUP_TEASER_MODE && (
          <div
            className="guest-inspect-link"
            role="button"
            tabIndex={0}
            aria-label={`Lihat detail event untuk ${artist.name}`}
            title="Buka detail event acara"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(artist);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onOpenModal(artist);
              }
            }}
          >
            <span>LIHAT DETAIL EVENT</span>
            <ArrowRight size={13} />
          </div>
        )}
      </div>
    </article>
  );
};

const LineupSectionDesktop: React.FC<Props> = ({
  artists,
  onToast: _onToast,
  onOpenNight1,
  onOpenNight2,
}) => {

  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeFlashes, setActiveFlashes] = useState<{ [key: string]: boolean }>({});
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const startTimeRef = useRef(0);
  const lastDeltaXRef = useRef(0);
  const startCardIdxRef = useRef(0);
  const hasCenteredRef = useRef(false);

  const triggerFlash = useCallback((artistId: string) => {
    setActiveFlashes((prev) => ({ ...prev, [artistId]: true }));
    setTimeout(() => {
      setActiveFlashes((prev) => ({ ...prev, [artistId]: false }));
    }, 450);
  }, []);

  const playArtistAudio = useCallback((artistId: string) => {
    if (isSec1AudioActive()) {
      silenceSec1();
    }
    setAudioOwner('sec2-lineup');
    setActiveAudioArtistId(artistId);
  }, []);

  const stopArtistAudio = useCallback(() => {
    setActiveAudioArtistId(null);
    if (getAudioOwner() === 'sec2-lineup') {
      setAudioOwner('none');
    }
  }, []);

  const handleCardMouseEnter = useCallback((artist: Artist, cardIdx: number, artistIdx: number) => {
    triggerFlash(artist.id);
    setActiveArtistIndex(artistIdx);
    setActiveCardIndex(cardIdx);
    playArtistAudio(artist.id);
  }, [playArtistAudio, triggerFlash]);

  const handleCardMouseLeave = useCallback(() => {
    stopArtistAudio();
  }, [stopArtistAudio]);

  const handleCardTap = useCallback((artist: Artist, cardIdx: number, artistIdx: number) => {
    if (activeAudioArtistId === artist.id) {
      // Toggle OFF if already playing
      stopArtistAudio();
    } else {
      // Toggle ON
      triggerFlash(artist.id);
      setActiveArtistIndex(artistIdx);
      setActiveCardIndex(cardIdx);
      playArtistAudio(artist.id);
    }
  }, [activeAudioArtistId, playArtistAudio, stopArtistAudio, triggerFlash]);

  // 5 repetitions: Set 0, 1, 2 (CENTER), 3, 4
  // Enables smooth infinite looping carousel across desktop and mobile
  const REPETITIONS = 5;
  const CENTER_SET = 2;

  const handleActiveIndexChange = useCallback((closestIdx: number) => {
    setActiveCardIndex(closestIdx);
    if (artists.length > 0) {
      const artistIdx = closestIdx % artists.length;
      setActiveArtistIndex(artistIdx);
    }
  }, [artists.length]);

  // High performance offset-linked animation hook (gated to isSectionVisible)
  const { scheduleUpdate } = useCarouselOffset(carouselRef, {
    enabled: isSectionVisible,
    onActiveIndexChange: handleActiveIndexChange,
    maxOffsetDistance: 450,
    minScale: 0.65,
    maxBlur: 5.5,
    minOpacity: 0.45,
    maxParallaxX: 30,
    maxTranslateY: 130,
    maxRotateZ: 8.5,
  });


  // Check section visibility: if Section 2 is not scrolled into view, stay idle and stop audio
  const checkAudioEligibility = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
    setIsSectionVisible(inView);

    if (!inView) {
      if (activeAudioArtistId !== null) {
        stopArtistAudio();
      }
    }
  }, [activeAudioArtistId, stopArtistAudio]);

  useEffect(() => {
    window.addEventListener('scroll', checkAudioEligibility, { passive: true });
    checkAudioEligibility();
    return () => window.removeEventListener('scroll', checkAudioEligibility);
  }, [checkAudioEligibility]);

  // Section visibility observer
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSectionVisible(entry.isIntersecting);
          checkAudioEligibility();
        });
      },
      { threshold: [0, 0.15, 0.3, 0.5] }
    );

    observer.observe(sec);
    return () => observer.disconnect();
  }, [checkAudioEligibility]);

  // Listen to Audio Coordinator events for immediate mutual exclusion
  useEffect(() => {
    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec1-storytelling') {
        stopArtistAudio();
      }
    };

    const handleSec1Silenced = () => {
      checkAudioEligibility();
    };

    const handleSec2Silenced = () => {
      stopArtistAudio();
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec2-silenced', handleSec2Silenced);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);

    return () => {
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec2-silenced', handleSec2Silenced);
      window.removeEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    };
  }, [checkAudioEligibility, stopArtistAudio]);

  // Endless looping sets for smooth continuous carousel navigation
  const carouselItems = useMemo(() => {
    const list: {
      artist: Artist;
      uniqueKey: string;
      isClone: boolean;
      originalIndex: number;
    }[] = [];

    for (let r = 0; r < REPETITIONS; r++) {
      artists.forEach((artist, idx) => {
        list.push({
          artist,
          uniqueKey: `${artist.id}-rep-${r}`,
          isClone: r !== CENTER_SET,
          originalIndex: idx,
        });
      });
    }
    return list;
  }, [artists]);

  const handleOpenModal = (artist: Artist) => {
    if (IS_LINEUP_TEASER_MODE) return;
    stopArtistAudio();
    setIsSectionVisible(false); // silence audio when modal is opened
    const isDay1 =
      artist.id === 'art-malvin' ||
      artist.id === 'art-basboi' ||
      artist.dayLabel?.toLowerCase().includes('1') ||
      artist.dayLabel?.includes('30');

    if (isDay1 && onOpenNight1) {
      onOpenNight1();
    } else if (onOpenNight2) {
      onOpenNight2();
    }
  };

  // Center the carousel on the middle set once on initial mount
  useEffect(() => {
    if (hasCenteredRef.current || artists.length === 0) return;
    const el = carouselRef.current;
    if (!el) return;

    hasCenteredRef.current = true;
    isProgrammaticScrollRef.current = true;
    const initialIndex = CENTER_SET * artists.length;
    setActiveCardIndex(initialIndex);
    setActiveArtistIndex(0);

    const initialCard = el.children[initialIndex] as HTMLElement | undefined;
    if (initialCard) {
      initialCard.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'nearest', inline: 'center' });
    }
    scheduleUpdate();
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  }, [artists.length, scheduleUpdate]);

  // Find currently centered card index in carousel
  const getClosestCardIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el || el.children.length === 0) return 0;

    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      if (!child || child.offsetWidth === 0) continue; // Skip hidden elements
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(scrollCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    return closestIdx;
  }, []);

  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    if (!isSectionVisible) return;
    scheduleUpdate();
  };

  // Navigate to specific artist dot
  const scrollToArtist = (targetArtistIdx: number) => {
    const el = carouselRef.current;
    if (!el || artists.length === 0) return;

    const currentIdx = getClosestCardIndex();
    const currentArtistIdx = currentIdx % artists.length;

    let step = targetArtistIdx - currentArtistIdx;
    if (artists.length > 4) {
      if (step > artists.length / 2) step -= artists.length;
      if (step < -artists.length / 2) step += artists.length;
    }

    const targetChildIdx = currentIdx + step;
    const targetCard = el.children[targetChildIdx] as HTMLElement | undefined;

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCardIndex(targetChildIdx);
      setActiveArtistIndex(targetArtistIdx);
      scheduleUpdate();
      if (activeAudioArtistId !== null) {
        playArtistAudio(artists[targetArtistIdx].id);
      }
    }
  };

  const handleStepNext = () => {
    const el = carouselRef.current;
    if (!el || artists.length === 0) return;
    const currentIdx = getClosestCardIndex();
    const nextIdx = currentIdx + 1;
    const nextCard = el.children[nextIdx] as HTMLElement | undefined;
    if (nextCard) {
      nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCardIndex(nextIdx);
      const nextArtistIdx = nextIdx % artists.length;
      setActiveArtistIndex(nextArtistIdx);
      scheduleUpdate();
      if (activeAudioArtistId !== null) {
        playArtistAudio(artists[nextArtistIdx].id);
      }
    }
  };

  const handleStepPrev = () => {
    const el = carouselRef.current;
    if (!el || artists.length === 0) return;
    const currentIdx = getClosestCardIndex();
    const prevIdx = Math.max(0, currentIdx - 1);
    const prevCard = el.children[prevIdx] as HTMLElement | undefined;
    if (prevCard) {
      prevCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCardIndex(prevIdx);
      const prevArtistIdx = (prevIdx + artists.length) % artists.length;
      setActiveArtistIndex(prevArtistIdx);
      scheduleUpdate();
      if (activeAudioArtistId !== null) {
        playArtistAudio(artists[prevArtistIdx].id);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scheduleUpdate();
    } else if (Math.abs(e.deltaY) > 20 && e.shiftKey) {
      el.scrollLeft += e.deltaY;
      scheduleUpdate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStepPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStepNext();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = carouselRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollLeftRef.current = el.scrollLeft;
    startTimeRef.current = performance.now();
    lastDeltaXRef.current = 0;
    startCardIdxRef.current = getClosestCardIndex();

    el.style.scrollSnapType = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = carouselRef.current;
    if (!el) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (!hasMovedRef.current) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        hasMovedRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch { }
      } else if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
        isDraggingRef.current = false;
        el.style.scrollSnapType = 'x mandatory';
        return;
      }
    }

    if (hasMovedRef.current) {
      lastDeltaXRef.current = deltaX;
      el.scrollLeft = startScrollLeftRef.current - deltaX;
      scheduleUpdate();
    }
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const el = carouselRef.current;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (!el) return;

    el.style.scrollSnapType = 'x mandatory';

    if (hasMovedRef.current) {
      const deltaX = lastDeltaXRef.current;
      const startIdx = startCardIdxRef.current;
      const totalCards = el.children.length;

      // Natural drag / flick threshold: 40px
      let targetIdx = startIdx;
      if (deltaX < -40) {
        // Dragged left -> advance to next card
        targetIdx = Math.min(totalCards - 1, startIdx + 1);
      } else if (deltaX > 40) {
        // Dragged right -> go to previous card
        targetIdx = Math.max(0, startIdx - 1);
      } else {
        // Subtle move -> snap to closest card
        targetIdx = getClosestCardIndex();
      }

      const targetCard = el.children[targetIdx] as HTMLElement | undefined;
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveCardIndex(targetIdx);
        if (artists.length > 0) {
          const nextArtistIdx = targetIdx % artists.length;
          setActiveArtistIndex(nextArtistIdx);
          if (activeAudioArtistId !== null) {
            playArtistAudio(artists[nextArtistIdx].id);
          }
        }
      }

      setTimeout(() => {
        hasMovedRef.current = false;
      }, 100);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <section id="lineup" ref={sectionRef} className="cinematic-section">
      <h2 className="section-headline">
        THE GUESTS
      </h2>

      <p className="section-subheadline">
        When the gates unlock, the silence breaks.
      </p>

      {/* Kinetic Offset-Linked Carousel with 3D Tilt & Video Interaction */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Lineup Artists Carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={handleClickCapture}
        className={`guests-editorial-grid ${artists.length === 1 ? 'is-single-guest' : ''}`}
      >
        {carouselItems.map((item, index) => {
          const isCardActive = isSectionVisible && index === activeCardIndex;

          return (
            <GuestCard
              key={item.uniqueKey}
              artist={item.artist}
              artistIndex={item.originalIndex}
              cardIndex={index}
              isClone={item.isClone}
              isCardActive={isCardActive}
              isAudioPlaying={isSectionVisible && activeAudioArtistId === item.artist.id}
              isFlashing={!!activeFlashes[item.artist.id]}
              onCardTap={handleCardTap}
              onCardMouseEnter={handleCardMouseEnter}
              onCardMouseLeave={handleCardMouseLeave}
              onOpenModal={handleOpenModal}
            />
          );
        })}
      </div>

      {/* Mobile Carousel Indicators & Quick Selector */}
      <div className="guest-carousel-mobile-controls">
        <div className="guest-carousel-navigation-bar">
          <button
            type="button"
            className="guest-carousel-arrow-btn"
            onClick={handleStepPrev}
            aria-label="Previous Guest"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="guest-carousel-dots">
            {artists.map((artist, idx) => (
              <button
                key={artist.id}
                type="button"
                className={`guest-carousel-dot-btn ${activeArtistIndex === idx ? 'is-active' : ''}`}
                onClick={() => scrollToArtist(idx)}
                aria-label={`Lihat ${artist.name}`}
              >
                <span className="guest-carousel-dot-indicator" />
                <span>{artist.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="guest-carousel-arrow-btn"
            onClick={handleStepNext}
            aria-label="Next Guest"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="guest-carousel-swipe-hint">
          <span>SLIDE FOR MORE</span>
          <span className="guest-carousel-swipe-arrow">→</span>
        </div>
      </div>
    </section>
  );
};

export const LineupSection: React.FC<Props> = (props) => {
  const isMobile = useIsMobile();
  return isMobile ? <LineupSectionMobile {...props} /> : <LineupSectionDesktop {...props} />;
};

export default LineupSection;
