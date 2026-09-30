import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artist } from '../types';
import { silenceSec1, setAudioOwner, getAudioOwner } from '../utils/audioCoordinator';

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
  isMobile: boolean;
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
  isMobile,
  isAudioPlaying,
  onCardTap,
  onCardMouseEnter,
  onCardMouseLeave,
  onOpenModal,
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Desktop Mouse Tilt without forced synchronous reflow
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const w = card.clientWidth || 360;
    const h = card.clientHeight || 520;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const rotateX = ((y - h / 2) / (h / 2)) * -4.5;
    const rotateY = ((x - w / 2) / (w / 2)) * 4.5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      onCardMouseEnter(artist, cardIndex, artistIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
      onCardMouseLeave();
    }
  };

  const handleCardClick = () => {
    if (isMobile) {
      // On mobile devices, tapping the card toggles the audio preview on/off
      onCardTap(artist, cardIndex, artistIndex);
    } else {
      // On desktop, clicking the card opens the full event modal
      onOpenModal(artist);
    }
  };

  // Video visuals loop smoothly in background (muted unless actively playing audio)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isMobile) {
      // Desktop: Keep visuals looping smoothly in background
      if (video.paused) {
        video.play().catch(() => {});
      }
    } else {
      // Mobile: Pause non-active clones to save memory/battery
      if (!isCardActive && !video.paused) {
        video.pause();
      } else if (isCardActive && video.paused) {
        video.play().catch(() => {});
      }
    }
  }, [isMobile, isCardActive]);

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
          video.play().catch(() => {});
        });
      }
    } else {
      video.muted = true;
    }
  }, [isAudioPlaying]);

  return (
    <article
      ref={cardRef}
      className={`guest-card-container is-video-active ${isClone ? 'is-clone' : ''} ${isAudioPlaying ? 'is-playing-audio' : ''}`}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      <div className="guest-portrait-frame">
        {artist.videoUrl ? (
          <video
            ref={videoRef}
            src={artist.videoUrl}
            poster={artist.posterUrl || artist.imageUrl}
            className="guest-portrait-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onEnded={(e) => {
              const v = e.currentTarget;
              v.currentTime = 0;
              v.play().catch(() => {});
            }}
          />
        ) : (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="guest-portrait-img"
            loading="lazy"
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

      <div
        className="guest-card-info-pane"
        style={{ cursor: 'pointer' }}
        title="Buka detail event artis"
      >
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

        {/* Dedicated Link to Detail Event Modal */}
        <div
          className="guest-inspect-link"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(artist);
          }}
        >
          <span>LIHAT DETAIL EVENT</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </article>
  );
};

export const LineupSection: React.FC<Props> = ({
  artists,
  onToast: _onToast,
  onOpenNight1,
  onOpenNight2,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeFlashes, setActiveFlashes] = useState<{ [key: string]: boolean }>({});
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const recenterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const startTimeRef = useRef(0);
  const lastDeltaXRef = useRef(0);

  const triggerFlash = useCallback((artistId: string) => {
    setActiveFlashes((prev) => ({ ...prev, [artistId]: true }));
    setTimeout(() => {
      setActiveFlashes((prev) => ({ ...prev, [artistId]: false }));
    }, 450);
  }, []);

  const playArtistAudio = useCallback((artistId: string) => {
    silenceSec1();
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

  // 7 repetitions: Set 0, 1, 2, 3 (CENTER), 4, 5, 6
  // Set 0 has isClone = false, so on desktop only Set 0 is displayed in the 2-column grid.
  // Sets 1..6 have isClone = true, which are hidden on desktop (display: none !important),
  // providing seamless infinite looping on mobile devices!
  const REPETITIONS = 7;
  const CENTER_SET = 3;

  // Responsive mobile detector
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check section visibility: mute lineup videos when out of view
  const checkAudioEligibility = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.70 && r.bottom > window.innerHeight * 0.15;
    setIsSectionVisible(inView);

    if (!inView) {
      stopArtistAudio();
    }
  }, [stopArtistAudio]);

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

    const handleSec2Silenced = () => {
      stopArtistAudio();
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec2-silenced', handleSec2Silenced);

    return () => {
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec2-silenced', handleSec2Silenced);
    };
  }, [stopArtistAudio]);

  // Desktop needs only 1 set (2 cards). Mobile gets 7 repetitions for endless infinite scroll.
  const carouselItems = useMemo(() => {
    if (!isMobile) {
      return artists.map((artist, idx) => ({
        artist,
        uniqueKey: artist.id,
        isClone: false,
        originalIndex: idx,
      }));
    }
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
          isClone: r !== 0,
          originalIndex: idx,
        });
      });
    }
    return list;
  }, [artists, isMobile]);

  const handleOpenModal = (artist: Artist) => {
    stopArtistAudio();
    setIsSectionVisible(false); // silence audio when modal is opened
    if ((artist.id === 'art-malvin' || artist.id === 'art-basboi') && onOpenNight1) {
      onOpenNight1();
    } else if ((artist.id === 'art-far' || artist.id === 'art-elena') && onOpenNight2) {
      onOpenNight2();
    }
  };

  // Center the mobile carousel on the middle set on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = carouselRef.current;
    if (!el || window.innerWidth > 768 || artists.length === 0) return;

    const initialIndex = CENTER_SET * artists.length;
    setActiveCardIndex(initialIndex);
    const initialCard = el.children[initialIndex] as HTMLElement | undefined;
    if (initialCard) {
      const scrollPos = initialCard.offsetLeft - (el.clientWidth - initialCard.offsetWidth) / 2;
      el.scrollLeft = scrollPos;
    }
  }, [artists.length]);

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

  // Handle seamless infinite teleport/recentering to center set
  const recenterToCenterSet = useCallback((currentChildIndex: number) => {
    const el = carouselRef.current;
    if (!el || window.innerWidth > 768 || artists.length === 0) return;

    const targetIndex = CENTER_SET * artists.length + (currentChildIndex % artists.length);
    if (currentChildIndex === targetIndex) return; // Already in center set

    const currentCard = el.children[currentChildIndex] as HTMLElement | undefined;
    const targetCard = el.children[targetIndex] as HTMLElement | undefined;

    if (currentCard && targetCard) {
      const offsetDiff = targetCard.offsetLeft - currentCard.offsetLeft;
      el.style.scrollSnapType = 'none';
      el.scrollLeft += offsetDiff;
      setActiveCardIndex(targetIndex);

      requestAnimationFrame(() => {
        if (el) {
          el.style.scrollSnapType = 'x mandatory';
        }
      });
    }
  }, [artists.length]);

  const handleScroll = () => {
    const closestIdx = getClosestCardIndex();
    setActiveCardIndex(closestIdx);
    const newArtistIdx = closestIdx % artists.length;
    if (artists.length > 0) {
      setActiveArtistIndex(newArtistIdx);
    }

    // If audio is active on mobile, switch to newly centered artist seamlessly
    if (isMobile && activeAudioArtistId !== null && artists.length > 0) {
      const currentArtist = artists[newArtistIdx];
      if (currentArtist && currentArtist.id !== activeAudioArtistId) {
        playArtistAudio(currentArtist.id);
      }
    }

    if (recenterTimerRef.current) {
      clearTimeout(recenterTimerRef.current);
    }

    // When scrolling pauses, silently recenter to the center set for endless infinite swipe
    recenterTimerRef.current = setTimeout(() => {
      const settledIdx = getClosestCardIndex();
      recenterToCenterSet(settledIdx);
    }, 180);
  };

  // Navigate to specific artist dot
  const scrollToArtist = (targetArtistIdx: number) => {
    const el = carouselRef.current;
    if (!el || artists.length === 0) return;

    const currentIdx = getClosestCardIndex();
    const currentArtistIdx = currentIdx % artists.length;

    let step = targetArtistIdx - currentArtistIdx;
    if (step > artists.length / 2) step -= artists.length;
    if (step < -artists.length / 2) step += artists.length;

    const targetChildIdx = currentIdx + step;
    const targetCard = el.children[targetChildIdx] as HTMLElement | undefined;

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveCardIndex(targetChildIdx);
      setActiveArtistIndex(targetArtistIdx);
      if (isMobile && activeAudioArtistId !== null) {
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
      if (isMobile && activeAudioArtistId !== null) {
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
      if (isMobile && activeAudioArtistId !== null) {
        playArtistAudio(artists[prevArtistIdx].id);
      }
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

    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
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
        } catch {}
      } else if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
        isDraggingRef.current = false;
        el.style.scrollSnapType = isMobile ? 'x mandatory' : '';
        return;
      }
    }

    if (hasMovedRef.current) {
      lastDeltaXRef.current = deltaX;
      el.scrollLeft = startScrollLeftRef.current - deltaX;
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

    const duration = performance.now() - startTimeRef.current;
    const deltaX = lastDeltaXRef.current;
    const velocity = deltaX / Math.max(1, duration);

    el.style.scrollSnapType = isMobile ? 'x mandatory' : '';
    el.style.scrollBehavior = '';

    if (hasMovedRef.current) {
      if (velocity < -0.35 || deltaX < -45) {
        handleStepNext();
      } else if (velocity > 0.35 || deltaX > 45) {
        handleStepPrev();
      } else {
        const closestIdx = getClosestCardIndex();
        const card = el.children[closestIdx] as HTMLElement | undefined;
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      setTimeout(() => {
        hasMovedRef.current = false;
      }, 80);
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
      <div className="section-eyebrow">
        <span>02 // THE RELEASE</span>
      </div>

      <h2 className="section-headline">
        THE GUESTS
      </h2>

      <p className="section-subheadline">
        When the gates unlock, the silence breaks.
      </p>

      {/* Editorial Spread with 3D Tilt & Video Interaction (Infinite Swipe Carousel on Mobile) */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={handleClickCapture}
        className="guests-editorial-grid"
        style={{ marginTop: '2.5rem' }}
      >
        {carouselItems.map((item, index) => {
          const isCardActive = isMobile
            ? (isSectionVisible && index === activeCardIndex)
            : (!item.isClone && item.originalIndex === activeArtistIndex);

          return (
            <GuestCard
              key={item.uniqueKey}
              artist={item.artist}
              artistIndex={item.originalIndex}
              cardIndex={index}
              isClone={item.isClone}
              isCardActive={isCardActive}
              isMobile={isMobile}
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

export default LineupSection;
