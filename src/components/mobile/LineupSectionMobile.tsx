import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Artist } from '../../types';
import { IS_LINEUP_TEASER_MODE, day1Artists as defaultDay1Artists, day2Artists as defaultDay2Artists, getArtistDisplayName, isArtistRevealed } from '../../data/eventData';
import {
  silenceSec1,
  setAudioOwner,
  getAudioOwner,
  isSec1AudioActive,
  crossfadeVideos,
  fadeVideoVolume,
} from '../../utils/audioCoordinator';
import { getCachedVideoUrl } from '../../utils/mediaPreloader';
import { useCarouselOffset } from '../../hooks/useCarouselOffset';

interface Props {
  artists: Artist[];
  onToast?: (msg: string) => void;
  onOpenNight1?: () => void;
  onOpenNight2?: () => void;
}

/* -------------------------------------------------------------------------- */
/* LineupMobileTierRow: Independent Mobile Carousel Row for a Single Day Tier  */
/* -------------------------------------------------------------------------- */
interface LineupMobileTierRowProps {
  tierId: string;
  dayBadge: string;
  dayMeta: string;
  tierArtists: Artist[];
  isSectionVisible: boolean;
  activeAudioArtistId: string | null;
  slopeDirection?: 1 | -1;
  onCardPointerUp: (artist: Artist, idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent, artist: Artist, idx: number) => void;
  onOpenArtistDetail: (artist: Artist) => void;
  onActiveCardChange?: (artist: Artist) => void;
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement | null }>;
}

const LineupMobileTierRow: React.FC<LineupMobileTierRowProps> = ({
  tierId,
  dayBadge,
  dayMeta,
  tierArtists,
  isSectionVisible,
  activeAudioArtistId,
  slopeDirection = 1,
  onCardPointerUp,
  onKeyDown,
  onOpenArtistDetail,
  onActiveCardChange,
  videoRefs,
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // High performance offset-linked animation (gated to isSectionVisible)
  const { scheduleUpdate } = useCarouselOffset(carouselRef, {
    enabled: isSectionVisible,
    onActiveIndexChange: (closestIdx) => {
      setActiveCardIndex(closestIdx);
      if (tierArtists[closestIdx] && onActiveCardChange) {
        onActiveCardChange(tierArtists[closestIdx]);
      }
    },
    maxOffsetDistance: 320,
    minScale: 0.72,
    maxBlur: 0,
    minOpacity: 0.35,
    maxParallaxX: 25,
    maxTranslateY: 48,
    maxRotateZ: 5.5,
    slopeDirection,
  });

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = Math.abs(e.clientX - startXRef.current);
    const deltaY = Math.abs(e.clientY - startYRef.current);

    if (deltaX > 8 || deltaY > 8) {
      hasMovedRef.current = true;
      scheduleUpdate();
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el || el.children.length === 0) return;

    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      if (!child) continue;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(scrollCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (closestIdx !== activeCardIndex) {
      setActiveCardIndex(closestIdx);
      scheduleUpdate();
    }
  };

  return (
    <div className="lineup-tier-block" id={tierId}>
      {/* Mobile Tier Header */}
      <div className="lineup-tier-header">
        <span className="lineup-tier-badge">{dayBadge}</span>
        <span className="lineup-tier-meta">{dayMeta}</span>
      </div>

      {/* Smooth Touch Snap Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`lineup-mobile-carousel ${tierArtists.length === 1 ? 'is-single-guest' : ''}`}
      >
        {tierArtists.map((artist, idx) => {
          const isAudioPlaying = activeAudioArtistId === artist.id;
          const isFlyerCard = !artist.videoUrl;
          const displayName = getArtistDisplayName(artist);
          const isRevealed = isArtistRevealed(artist);

          return (
            <article
              key={artist.id}
              className={`lineup-mobile-card ${isFlyerCard ? 'is-flyer-card' : ''} ${isAudioPlaying ? 'is-playing-audio' : ''}`}
              onPointerUp={() => onCardPointerUp(artist, idx)}
              onPointerCancel={handlePointerCancel}
              onKeyDown={(e) => onKeyDown(e, artist, idx)}
              role="button"
              tabIndex={0}
              title={isAudioPlaying ? 'Ketuk untuk jeda preview audio' : 'Ketuk untuk putar preview audio'}
              aria-label={`${displayName} - ${artist.stageName}`}
            >
              {/* Portrait Media Frame */}
              <div className="lineup-mobile-portrait-frame">
                <img
                  src={artist.imageUrl}
                  alt={`${displayName} — official flyer`}
                  className="lineup-mobile-media-img"
                  loading="lazy"
                />
                {artist.videoUrl && (
                  <video
                    ref={(el) => {
                      videoRefs.current[artist.id] = el;
                    }}
                    src={getCachedVideoUrl(artist.videoUrl) || artist.videoUrl}
                    poster={artist.posterUrl || artist.imageUrl}
                    className="lineup-mobile-media-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}
                {!artist.videoUrl && artist.audioPreviewUrl && (
                  <video
                    ref={(el) => {
                      videoRefs.current[artist.id] = el;
                    }}
                    src={getCachedVideoUrl(artist.audioPreviewUrl) || artist.audioPreviewUrl}
                    className="lineup-mobile-audio-only-media"
                    aria-hidden={true}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}

                {/* Dark Vignette / Scrim Gradient (only for video cards) */}
                {!isFlyerCard && <div className="lineup-mobile-scrim" />}
              </div>

              {/* Info Pane Overlaid on Bottom of the Card */}
              <div className="lineup-mobile-info-pane">
                <div className="lineup-mobile-kicker-row">
                  <span className="lineup-mobile-day-kicker">
                    {artist.dayLabel}{artist.performanceTime ? ` · ${artist.performanceTime}` : ''}
                  </span>
                  {isAudioPlaying && !IS_LINEUP_TEASER_MODE && (
                    <span className="lineup-mobile-sound-badge">
                      <span className="lineup-mobile-eq-bars">
                        <span className="lineup-mobile-eq-bar b-1" />
                        <span className="lineup-mobile-eq-bar b-2" />
                        <span className="lineup-mobile-eq-bar b-3" />
                      </span>
                      <span>LIVE</span>
                    </span>
                  )}
                </div>

                <h3 className="lineup-mobile-artist-name">{displayName}</h3>

                <span className="lineup-mobile-stage-meta">
                  STAGE // {artist.stageName}
                </span>

                {!IS_LINEUP_TEASER_MODE && isRevealed && (
                  <div
                    className="lineup-mobile-inspect-link"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      onOpenArtistDetail(artist);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenArtistDetail(artist);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Lihat detail event untuk ${displayName}`}
                    title="Buka detail event acara"
                  >
                    <span>LIHAT DETAIL EVENT</span>
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Dots Indicator */}
      {tierArtists.length > 1 && (
        <div className="lineup-mobile-dots" aria-hidden="true">
          {tierArtists.map((artist, idx) => (
            <div
              key={artist.id}
              className={`lineup-mobile-dot-item ${activeCardIndex === idx ? 'is-active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* LineupSectionMobile: Dual-Tier Mobile Container (Day 1 & Day 2)            */
/* -------------------------------------------------------------------------- */
export const LineupSectionMobile: React.FC<Props> = ({
  artists,
  onOpenNight1,
  onOpenNight2,
}) => {
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const currentPlayingIdRef = useRef<string | null>(null);

  // Partition or fallback to day1Artists and day2Artists
  const day1List = useMemo(() => {
    const filtered = artists.filter(
      (a) => a.day === 1 || (!a.day && (a.dayLabel?.toLowerCase().includes('day 1') || a.dayLabel?.includes('30 Okt')) && !a.dayLabel?.toLowerCase().includes('day 2'))
    );
    return filtered.length > 0 ? filtered : defaultDay1Artists;
  }, [artists]);

  const day2List = useMemo(() => {
    const filtered = artists.filter(
      (a) => a.day === 2 || (!a.day && (a.dayLabel?.toLowerCase().includes('day 2') || a.dayLabel?.includes('31 Okt')) && !a.dayLabel?.toLowerCase().includes('day 1'))
    );
    return filtered.length > 0 ? filtered : defaultDay2Artists;
  }, [artists]);

  const playArtistAudio = useCallback((artistId: string) => {
    if (IS_LINEUP_TEASER_MODE) return;
    silenceSec1({ duration: 300 });
    setAudioOwner('sec2-lineup');
    setActiveAudioArtistId(artistId);

    const prevId = currentPlayingIdRef.current;
    currentPlayingIdRef.current = artistId;

    const outgoingVideo = prevId && prevId !== artistId ? videoRefs.current[prevId] : null;
    const incomingVideo = videoRefs.current[artistId] || null;

    // Smooth S-curve crossfade: ramps outgoing to 0 and incoming to 0.95 over 280ms
    crossfadeVideos(outgoingVideo, incomingVideo, 0.95, 280);

    // Mute any other background videos smoothly
    Object.entries(videoRefs.current).forEach(([id, vid]) => {
      if (vid && id !== artistId && id !== prevId && !vid.muted) {
        fadeVideoVolume(vid, 0, 200, () => {
          vid.muted = true;
        });
      }
    });
  }, []);

  const stopArtistAudio = useCallback(() => {
    setActiveAudioArtistId(null);
    currentPlayingIdRef.current = null;
    if (getAudioOwner() === 'sec2-lineup') {
      setAudioOwner('none');
    }
    // Smooth fade-out to zero before muting
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid && !vid.muted) {
        fadeVideoVolume(vid, 0, 250, () => {
          vid.muted = true;
        });
      }
    });
  }, []);

  const handleOpenArtistDetail = useCallback(
    (artist: Artist) => {
      if (IS_LINEUP_TEASER_MODE) return;
      stopArtistAudio();
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
    },
    [onOpenNight1, onOpenNight2, stopArtistAudio]
  );

  const handleCardPointerUp = (artist: Artist, _idx: number) => {
    if (IS_LINEUP_TEASER_MODE || !artist.audioPreviewUrl) return;
    if (activeAudioArtistId === artist.id) {
      stopArtistAudio();
    } else {
      playArtistAudio(artist.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, artist: Artist, _idx: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeAudioArtistId === artist.id) {
        stopArtistAudio();
      } else {
        playArtistAudio(artist.id);
      }
    }
  };

  // Check section visibility: auto-stop artist audio when scrolling away
  const checkLineupVisibility = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.15;
    setIsSectionVisible(inView);

    if (inView) {
      if (isSec1AudioActive()) {
        silenceSec1({ duration: 300 });
      }
    } else {
      if (currentPlayingIdRef.current !== null) {
        stopArtistAudio();
      }
    }
  }, [stopArtistAudio]);

  useEffect(() => {
    window.addEventListener('scroll', checkLineupVisibility, { passive: true });
    checkLineupVisibility();
    return () => {
      window.removeEventListener('scroll', checkLineupVisibility);
    };
  }, [checkLineupVisibility]);

  // Auto-silence when audio owner changes
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
    const handleSec1Silenced = () => {
      checkLineupVisibility();
    };

    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    window.addEventListener('how:audio-sec2-silenced', handleSec2Silenced);
    window.addEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    return () => {
      window.removeEventListener('how:audio-owner-change', handleOwnerChange);
      window.removeEventListener('how:audio-sec2-silenced', handleSec2Silenced);
      window.removeEventListener('how:audio-sec1-silenced', handleSec1Silenced);
    };
  }, [checkLineupVisibility, stopArtistAudio]);

  return (
    <section
      ref={sectionRef}
      id="lineup"
      className="lineup-mobile-section"
      aria-label="Lineup Artis The State of Clamor"
    >
      {/* Mobile Headline Header */}
      <div className="lineup-mobile-header">
        <h2 className="lineup-mobile-headline">THE GUESTS</h2>
        <p className="lineup-mobile-subheadline">
          When the gates unlock, the silence breaks.
        </p>
      </div>

      {/* Tier 1: Day 1 · 30 Okt (Top-Left to Bottom-Right / Kanan Bawah ke Atas Kiri) */}
      <LineupMobileTierRow
        tierId="mobile-tier-day-1"
        slopeDirection={1}
        dayBadge="DAY 1 · 30 OKTOBER 2026"
        dayMeta="GATE OPENS 15:00 WIB"
        tierArtists={day1List}
        isSectionVisible={isSectionVisible}
        activeAudioArtistId={activeAudioArtistId}
        onCardPointerUp={handleCardPointerUp}
        onKeyDown={handleKeyDown}
        onOpenArtistDetail={handleOpenArtistDetail}
        videoRefs={videoRefs}
      />

      {/* Atmospheric Gold Hairline Divider */}
      <div className="lineup-tier-divider" />

      {/* Tier 2: Day 2 · 31 Okt (Bottom-Left to Top-Right / Kiri Bawah ke Kanan Atas) */}
      <LineupMobileTierRow
        tierId="mobile-tier-day-2"
        slopeDirection={-1}
        dayBadge="DAY 2 · 31 OKTOBER 2026"
        dayMeta="GATE OPENS 15:00 WIB"
        tierArtists={day2List}
        isSectionVisible={isSectionVisible}
        activeAudioArtistId={activeAudioArtistId}
        onCardPointerUp={handleCardPointerUp}
        onKeyDown={handleKeyDown}
        onOpenArtistDetail={handleOpenArtistDetail}
        videoRefs={videoRefs}
      />
    </section>
  );
};

export default LineupSectionMobile;
