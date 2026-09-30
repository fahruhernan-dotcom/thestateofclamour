import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Artist } from '../types';
import { silenceSec1, setAudioOwner, getAudioOwner, canSec2PlayAudio } from '../utils/audioCoordinator';

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
  isSectionVisible: boolean;
  isSectionAudioMuted: boolean;
  isAudioUnlocked: boolean;
  canPlayAudio: boolean;
  isMobile: boolean;
  onSelectArtist: (index: number) => void;
  onSelectCard?: (cardIndex: number, artistIndex: number) => void;
  onToggleMute: (index: number, forcePlay?: boolean) => void;
  onTriggerFlash: (id: string) => void;
  onOpenModal: (artist: Artist) => void;
}

const GuestCard: React.FC<GuestCardProps> = ({
  artist,
  artistIndex,
  cardIndex,
  isFlashing,
  isClone,
  isCardActive,
  isSectionVisible,
  isSectionAudioMuted,
  isAudioUnlocked,
  canPlayAudio,
  isMobile,
  onSelectArtist,
  onSelectCard,
  onToggleMute,
  onTriggerFlash,
  onOpenModal,
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  const handleCardMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  };

  const handleCardMouseEnter = () => {
    onTriggerFlash(artist.id);
    onSelectArtist(artistIndex);
  };

  // Video playback & audio synchronization:
  // Auto-play unmuted ONLY when Section 2 is visible AND Section 1 audio is completely dead!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sec2Allowed = isSectionVisible && canPlayAudio && canSec2PlayAudio();

    if (!sec2Allowed) {
      // Out of section or Section 1 is still active: force mute
      video.muted = true;
      setIsPlayingAudio(false);
      return;
    }

    const shouldPlaySound = isCardActive && !isSectionAudioMuted && sec2Allowed;

    if (shouldPlaySound) {
      // Section 2 is about to play sound:
      // STRICT REQUIREMENT: silence Section 1 first and claim audio ownership
      silenceSec1();
      setAudioOwner('sec2-lineup');

      video.volume = 0.95;
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingAudio(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy without user gesture yet
            video.muted = true;
            setIsPlayingAudio(false);
            video.play().catch(() => {});
          });
      }
    } else {
      video.muted = true;
      setIsPlayingAudio(false);

      if (!isMobile) {
        // On desktop, keep video visuals alive smoothly (muted)
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        // On mobile, pause inactive carousel clones to save memory
        if (!isCardActive && !video.paused) {
          video.pause();
        }
      }
    }
  }, [isSectionVisible, isCardActive, isSectionAudioMuted, isAudioUnlocked, isMobile, canPlayAudio]);

  // Direct user-click sound toggle (unconditionally permitted by browsers due to user gesture)
  const handleToggleSound = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isCardActive && isPlayingAudio && !isSectionAudioMuted) {
      // Currently playing sound: mute it
      video.muted = true;
      setIsPlayingAudio(false);
      onToggleMute(artistIndex, false);
      if (getAudioOwner() === 'sec2-lineup') {
        setAudioOwner('none');
      }
    } else {
      // User explicitly clicked to play sound on this card:
      // 1. Immediately kill Section 1 audio completely!
      silenceSec1();
      setAudioOwner('sec2-lineup');

      // 2. Mute any other videos in #lineup to guarantee single-audio playback
      const allVideos = document.querySelectorAll<HTMLVideoElement>('#lineup video');
      allVideos.forEach((v) => {
        if (v !== video) {
          v.muted = true;
        }
      });

      video.volume = 0.95;
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingAudio(true);
          })
          .catch((err) => {
            console.warn("Audio playback error:", err);
          });
      } else {
        setIsPlayingAudio(true);
      }
      if (onSelectCard) {
        onSelectCard(cardIndex, artistIndex);
      } else {
        onSelectArtist(artistIndex);
      }
      onToggleMute(artistIndex, true);
    }
  }, [isCardActive, isPlayingAudio, isSectionAudioMuted, artistIndex, cardIndex, onSelectArtist, onSelectCard, onToggleMute]);

  return (
    <article
      ref={cardRef}
      className={`guest-card-container is-video-active ${isClone ? 'is-clone' : ''} ${isPlayingAudio ? 'is-playing-audio' : ''}`}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      onMouseEnter={handleCardMouseEnter}
    >
      <div
        className="guest-portrait-frame"
        onClick={handleToggleSound}
        style={{ cursor: 'pointer' }}
        title={isPlayingAudio ? "Klik untuk mematikan audio" : "Klik untuk memutar audio"}
      >
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
        onClick={() => onOpenModal(artist)}
        style={{ cursor: 'pointer' }}
        title="Buka detail event artis"
      >
        <div className="guest-card-kicker-row">
          <p className="guest-day-kicker">
            {artist.dayLabel} · {artist.performanceTime}
          </p>
          {isPlayingAudio && (
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

      {/* Compact Sound Logo Button (Bottom-Right of Flyer) */}
      <button
        type="button"
        className={`guest-flyer-sound-btn ${isPlayingAudio ? 'is-active' : (isCardActive && isSectionVisible ? 'is-muted-hint' : '')}`}
        onClick={handleToggleSound}
        aria-label={isPlayingAudio ? "Bisukan suara" : "Aktifkan suara"}
        title={isPlayingAudio ? "Klik untuk bisukan audio" : "Klik untuk putar audio"}
      >
        {isPlayingAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
      </button>
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
  const [isSectionAudioMuted, setIsSectionAudioMuted] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [canPlayAudio, setCanPlayAudio] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const recenterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelectArtist = useCallback((index: number) => {
    setActiveArtistIndex(index);
  }, []);

  const handleSelectCard = useCallback((cardIdx: number, artistIdx: number) => {
    setActiveCardIndex(cardIdx);
    setActiveArtistIndex(artistIdx);
  }, []);

  const handleToggleMute = useCallback((_index: number, forcePlay?: boolean) => {
    setIsAudioUnlocked(true);
    if (forcePlay !== undefined) {
      setIsSectionAudioMuted(!forcePlay);
    } else {
      setIsSectionAudioMuted((prev) => !prev);
    }
  }, []);

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

  // Check eligibility for playing audio (Section 1 MUST be completely dead)
  const checkAudioEligibility = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.70 && r.bottom > window.innerHeight * 0.15;
    setIsSectionVisible(inView);

    const eligible = inView && canSec2PlayAudio();
    setCanPlayAudio(eligible);

    if (!eligible) {
      // Force mute any playing lineup videos if Section 1 is still active
      const allVideos = document.querySelectorAll<HTMLVideoElement>('#lineup video');
      allVideos.forEach((v) => {
        v.muted = true;
      });
    }
  }, []);

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
        const allVideos = document.querySelectorAll<HTMLVideoElement>('#lineup video');
        allVideos.forEach((v) => {
          v.muted = true;
        });
        setIsSectionAudioMuted(true);
        setCanPlayAudio(false);
      }
    };

    const handleSec2Silenced = () => {
      const allVideos = document.querySelectorAll<HTMLVideoElement>('#lineup video');
      allVideos.forEach((v) => {
        v.muted = true;
      });
      setIsSectionAudioMuted(true);
      setCanPlayAudio(false);
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec2-silenced', handleSec2Silenced);

    return () => {
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec2-silenced', handleSec2Silenced);
    };
  }, []);

  // Unlock audio on first natural user interaction anywhere on page
  useEffect(() => {
    const unlockOnGesture = () => {
      setIsAudioUnlocked(true);
      checkAudioEligibility();
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };

    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
  }, [checkAudioEligibility]);

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

  const triggerFlash = (artistId: string) => {
    setActiveFlashes((prev) => ({ ...prev, [artistId]: true }));
    setTimeout(() => {
      setActiveFlashes((prev) => ({ ...prev, [artistId]: false }));
    }, 450);
  };

  const handleOpenModal = (artist: Artist) => {
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
    if (artists.length > 0) {
      setActiveArtistIndex(closestIdx % artists.length);
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
      setActiveArtistIndex(nextIdx % artists.length);
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
      setActiveArtistIndex((prevIdx + artists.length) % artists.length);
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
              isSectionVisible={isSectionVisible}
              isSectionAudioMuted={isSectionAudioMuted}
              isAudioUnlocked={isAudioUnlocked}
              canPlayAudio={canPlayAudio}
              isMobile={isMobile}
              isFlashing={!!activeFlashes[item.artist.id]}
              onSelectArtist={handleSelectArtist}
              onSelectCard={handleSelectCard}
              onToggleMute={handleToggleMute}
              onTriggerFlash={triggerFlash}
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
