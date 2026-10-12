import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artist } from '../types';
import { IS_LINEUP_TEASER_MODE, day1Artists as defaultDay1Artists, day2Artists as defaultDay2Artists } from '../data/eventData';
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
    // Only preview audio on hover for cursor/mouse devices when not in teaser mode
    if (IS_LINEUP_TEASER_MODE || !artist.audioPreviewUrl) return;
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
      if (!IS_LINEUP_TEASER_MODE && artist.audioPreviewUrl) {
        onCardMouseLeave();
      }
    }
  };

  const handleCardClick = () => {
    // In teaser mode, audio preview is disabled
    if (IS_LINEUP_TEASER_MODE || !artist.audioPreviewUrl) return;

    // Tap or click on the card body toggles the artist audio preview on/off
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

        {/* Portrait Dark Scrim */}
        <div className="guest-portrait-scrim" />
      </div>

      <div className="guest-card-info-pane">
        <div className="guest-card-kicker-row">
          <p className="guest-day-kicker">
            {artist.dayLabel} · {artist.performanceTime}
          </p>
          {isAudioPlaying && !IS_LINEUP_TEASER_MODE && (
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

/* -------------------------------------------------------------------------- */
/* LineupDayTierRow: Independent Horizontal Carousel for a Single Day Tier    */
/* -------------------------------------------------------------------------- */
interface LineupDayTierRowProps {
  tierId: string;
  dayBadge: string;
  dayMeta: string;
  tierArtists: Artist[];
  isSectionVisible: boolean;
  activeAudioArtistId: string | null;
  slopeDirection?: 1 | -1;
  onCardTap: (artist: Artist, cardIdx: number, artistIdx: number) => void;
  onCardMouseEnter: (artist: Artist, cardIdx: number, artistIdx: number) => void;
  onCardMouseLeave: () => void;
  onOpenModal: (artist: Artist) => void;
  onPlayArtistAudio: (artistId: string) => void;
}

const LineupDayTierRow: React.FC<LineupDayTierRowProps> = ({
  tierId,
  dayBadge,
  dayMeta,
  tierArtists,
  isSectionVisible,
  activeAudioArtistId,
  slopeDirection = 1,
  onCardTap,
  onCardMouseEnter,
  onCardMouseLeave,
  onOpenModal,
  onPlayArtistAudio,
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

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

  // 5 repetitions: Set 0, 1, 2 (CENTER), 3, 4
  const REPETITIONS = 5;
  const CENTER_SET = 2;

  const handleActiveIndexChange = useCallback((closestIdx: number) => {
    setActiveCardIndex(closestIdx);
    if (tierArtists.length > 0) {
      const artistIdx = closestIdx % tierArtists.length;
      setActiveArtistIndex(artistIdx);
    }
  }, [tierArtists.length]);

  // Kinetic offset-linked animation hook (gated to isSectionVisible)
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
    slopeDirection,
  });

  // Endless looping sets
  const carouselItems = useMemo(() => {
    const list: {
      artist: Artist;
      uniqueKey: string;
      isClone: boolean;
      originalIndex: number;
    }[] = [];

    for (let r = 0; r < REPETITIONS; r++) {
      tierArtists.forEach((artist, idx) => {
        list.push({
          artist,
          uniqueKey: `${tierId}-${artist.id}-rep-${r}`,
          isClone: r !== CENTER_SET,
          originalIndex: idx,
        });
      });
    }
    return list;
  }, [tierArtists, tierId]);

  // Deterministic centering on middle set (Set 2) via getBoundingClientRect
  const centerCarouselMiddle = useCallback((smooth = false) => {
    const el = carouselRef.current;
    if (!el || tierArtists.length === 0) return;

    const initialIndex = CENTER_SET * tierArtists.length;
    const initialCard = el.children[initialIndex] as HTMLElement | undefined;
    if (!initialCard) return;

    const elRect = el.getBoundingClientRect();
    const cardRect = initialCard.getBoundingClientRect();
    if (elRect.width === 0 || cardRect.width === 0) return;

    const offsetFromCenter = (cardRect.left + cardRect.width / 2) - (elRect.left + elRect.width / 2);
    const targetScroll = Math.round(el.scrollLeft + offsetFromCenter);

    isProgrammaticScrollRef.current = true;
    el.style.scrollSnapType = 'none';
    el.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'instant',
    });
    setActiveCardIndex(initialIndex);
    setActiveArtistIndex(0);
    scheduleUpdate();

    requestAnimationFrame(() => {
      el.style.scrollSnapType = 'x mandatory';
      isProgrammaticScrollRef.current = false;
      scheduleUpdate();
    });
  }, [tierArtists.length, scheduleUpdate]);

  // Center on mount and when layout dimensions are measured
  useEffect(() => {
    if (hasCenteredRef.current || tierArtists.length === 0) return;
    const el = carouselRef.current;
    if (!el) return;

    hasCenteredRef.current = true;
    centerCarouselMiddle(false);

    const timer = setTimeout(() => {
      centerCarouselMiddle(false);
    }, 60);
    return () => clearTimeout(timer);
  }, [centerCarouselMiddle, tierArtists.length]);

  // When section enters viewport, ensure alignment is primed
  useEffect(() => {
    if (!isSectionVisible) return;
    const el = carouselRef.current;
    if (el && el.scrollLeft === 0) {
      centerCarouselMiddle(false);
    }
    scheduleUpdate();
  }, [centerCarouselMiddle, isSectionVisible, scheduleUpdate]);

  const getClosestCardIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el || el.children.length === 0) return 0;

    const elRect = el.getBoundingClientRect();
    const containerCenter = elRect.left + elRect.width / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      if (!child || child.offsetWidth === 0) continue;
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      const diff = Math.abs(containerCenter - childCenter);
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

  const scrollToArtist = (targetArtistIdx: number) => {
    const el = carouselRef.current;
    if (!el || tierArtists.length === 0) return;

    const currentIdx = getClosestCardIndex();
    const currentArtistIdx = currentIdx % tierArtists.length;

    let step = targetArtistIdx - currentArtistIdx;
    if (tierArtists.length > 4) {
      if (step > tierArtists.length / 2) step -= tierArtists.length;
      if (step < -tierArtists.length / 2) step += tierArtists.length;
    }

    const targetChildIdx = currentIdx + step;
    const targetCard = el.children[targetChildIdx] as HTMLElement | undefined;

    if (targetCard) {
      const elRect = el.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();
      const offsetFromCenter = (cardRect.left + cardRect.width / 2) - (elRect.left + elRect.width / 2);
      const targetScroll = Math.round(el.scrollLeft + offsetFromCenter);

      isProgrammaticScrollRef.current = true;
      el.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveCardIndex(targetChildIdx);
      setActiveArtistIndex(targetArtistIdx);
      scheduleUpdate();
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        scheduleUpdate();
      }, 350);

      if (activeAudioArtistId !== null) {
        onPlayArtistAudio(tierArtists[targetArtistIdx].id);
      }
    }
  };

  const handleStepNext = () => {
    const el = carouselRef.current;
    if (!el || tierArtists.length === 0) return;
    const currentIdx = getClosestCardIndex();
    const nextIdx = currentIdx + 1;
    const nextCard = el.children[nextIdx] as HTMLElement | undefined;
    if (nextCard) {
      const elRect = el.getBoundingClientRect();
      const cardRect = nextCard.getBoundingClientRect();
      const offsetFromCenter = (cardRect.left + cardRect.width / 2) - (elRect.left + elRect.width / 2);
      const targetScroll = Math.round(el.scrollLeft + offsetFromCenter);

      isProgrammaticScrollRef.current = true;
      el.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveCardIndex(nextIdx);
      const nextArtistIdx = nextIdx % tierArtists.length;
      setActiveArtistIndex(nextArtistIdx);
      scheduleUpdate();
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        scheduleUpdate();
      }, 350);

      if (activeAudioArtistId !== null) {
        onPlayArtistAudio(tierArtists[nextArtistIdx].id);
      }
    }
  };

  const handleStepPrev = () => {
    const el = carouselRef.current;
    if (!el || tierArtists.length === 0) return;
    const currentIdx = getClosestCardIndex();
    const prevIdx = Math.max(0, currentIdx - 1);
    const prevCard = el.children[prevIdx] as HTMLElement | undefined;
    if (prevCard) {
      const elRect = el.getBoundingClientRect();
      const cardRect = prevCard.getBoundingClientRect();
      const offsetFromCenter = (cardRect.left + cardRect.width / 2) - (elRect.left + elRect.width / 2);
      const targetScroll = Math.round(el.scrollLeft + offsetFromCenter);

      isProgrammaticScrollRef.current = true;
      el.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveCardIndex(prevIdx);
      const prevArtistIdx = (prevIdx + tierArtists.length) % tierArtists.length;
      setActiveArtistIndex(prevArtistIdx);
      scheduleUpdate();
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        scheduleUpdate();
      }, 350);

      if (activeAudioArtistId !== null) {
        onPlayArtistAudio(tierArtists[prevArtistIdx].id);
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
        targetIdx = Math.min(totalCards - 1, startIdx + 1);
      } else if (deltaX > 40) {
        targetIdx = Math.max(0, startIdx - 1);
      } else {
        targetIdx = getClosestCardIndex();
      }

      const targetCard = el.children[targetIdx] as HTMLElement | undefined;
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveCardIndex(targetIdx);
        if (tierArtists.length > 0) {
          const nextArtistIdx = targetIdx % tierArtists.length;
          setActiveArtistIndex(nextArtistIdx);
          if (activeAudioArtistId !== null) {
            onPlayArtistAudio(tierArtists[nextArtistIdx].id);
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
    <div className="lineup-tier-block" id={tierId}>
      {/* Tier Header: Day Badge & Ambient Venue Meta */}
      <div className="lineup-tier-header">
        <span className="lineup-tier-badge">{dayBadge}</span>
        <span className="lineup-tier-meta">{dayMeta}</span>
      </div>

      {/* Kinetic Offset-Linked Carousel with 3D Tilt & Video Interaction */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`${dayBadge} Artists Carousel`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={handleClickCapture}
        className={`guests-editorial-grid ${tierArtists.length === 1 ? 'is-single-guest' : ''}`}
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
              onCardTap={onCardTap}
              onCardMouseEnter={onCardMouseEnter}
              onCardMouseLeave={onCardMouseLeave}
              onOpenModal={onOpenModal}
            />
          );
        })}
      </div>

      {/* Carousel Navigation Indicators */}
      <div className="guest-carousel-mobile-controls">
        <div className="guest-carousel-navigation-bar">
          <button
            type="button"
            className="guest-carousel-arrow-btn"
            onClick={handleStepPrev}
            aria-label={`Previous ${dayBadge} Guest`}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="guest-carousel-dots">
            {tierArtists.map((artist, idx) => (
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
            aria-label={`Next ${dayBadge} Guest`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="guest-carousel-swipe-hint">
          <span>SLIDE FOR MORE</span>
          <span className="guest-carousel-swipe-arrow">→</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* LineupSectionDesktop: Dual Stacked Tiers (Day 1 & Day 2)                   */
/* -------------------------------------------------------------------------- */
const LineupSectionDesktop: React.FC<Props> = ({
  artists,
  onToast: _onToast,
  onOpenNight1,
  onOpenNight2,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);

  // Partition or fallback to day1Artists and day2Artists
  const day1List = useMemo(() => {
    const filtered = artists.filter(
      (a) => a.dayLabel?.toLowerCase().includes('1') || a.dayLabel?.includes('30')
    );
    return filtered.length > 0 ? filtered : defaultDay1Artists;
  }, [artists]);

  const day2List = useMemo(() => {
    const filtered = artists.filter(
      (a) => a.dayLabel?.toLowerCase().includes('2') || a.dayLabel?.includes('31')
    );
    return filtered.length > 0 ? filtered : defaultDay2Artists;
  }, [artists]);

  const playArtistAudio = useCallback((artistId: string) => {
    if (IS_LINEUP_TEASER_MODE) return;
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

  const handleCardMouseEnter = useCallback((artist: Artist, _cardIdx: number, _artistIdx: number) => {
    playArtistAudio(artist.id);
  }, [playArtistAudio]);

  const handleCardMouseLeave = useCallback(() => {
    stopArtistAudio();
  }, [stopArtistAudio]);

  const handleCardTap = useCallback((artist: Artist, _cardIdx: number, _artistIdx: number) => {
    if (activeAudioArtistId === artist.id) {
      stopArtistAudio();
    } else {
      playArtistAudio(artist.id);
    }
  }, [activeAudioArtistId, playArtistAudio, stopArtistAudio]);

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

  const handleOpenModal = (artist: Artist) => {
    if (IS_LINEUP_TEASER_MODE) return;
    stopArtistAudio();
    setIsSectionVisible(false);
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

  return (
    <section id="lineup" ref={sectionRef} className="cinematic-section">
      <h2 className="section-headline">
        THE GUESTS
      </h2>

      <p className="section-subheadline">
        When the gates unlock, the silence breaks.
      </p>

      {/* Tier 1: Day 1 · 30 Okt (Top-Left to Bottom-Right / Kanan Bawah ke Atas Kiri) */}
      <LineupDayTierRow
        tierId="tier-day-1"
        slopeDirection={1}
        dayBadge="DAY 1 · 30 OKTOBER 2026"
        dayMeta="GATE OPENS 15:00 WIB // MIZU COMMONROOM"
        tierArtists={day1List}
        isSectionVisible={isSectionVisible}
        activeAudioArtistId={activeAudioArtistId}
        onCardTap={handleCardTap}
        onCardMouseEnter={handleCardMouseEnter}
        onCardMouseLeave={handleCardMouseLeave}
        onOpenModal={handleOpenModal}
        onPlayArtistAudio={playArtistAudio}
      />

      {/* Atmospheric Gold Hairline Divider */}
      <div className="lineup-tier-divider" />

      {/* Tier 2: Day 2 · 31 Okt (Bottom-Left to Top-Right / Kiri Bawah ke Kanan Atas) */}
      <LineupDayTierRow
        tierId="tier-day-2"
        slopeDirection={-1}
        dayBadge="DAY 2 · 31 OKTOBER 2026"
        dayMeta="GATE OPENS 15:00 WIB // MIZU COMMONROOM"
        tierArtists={day2List}
        isSectionVisible={isSectionVisible}
        activeAudioArtistId={activeAudioArtistId}
        onCardTap={handleCardTap}
        onCardMouseEnter={handleCardMouseEnter}
        onCardMouseLeave={handleCardMouseLeave}
        onOpenModal={handleOpenModal}
        onPlayArtistAudio={playArtistAudio}
      />
    </section>
  );
};

export const LineupSection: React.FC<Props> = (props) => {
  const isMobile = useIsMobile();
  return isMobile ? <LineupSectionMobile {...props} /> : <LineupSectionDesktop {...props} />;
};

export default LineupSection;
