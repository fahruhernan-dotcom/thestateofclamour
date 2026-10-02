import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { Artist } from '../../types';
import {
  silenceSec1,
  setAudioOwner,
  getAudioOwner,
  isSec1AudioActive,
  canSec2PlayAudio,
  crossfadeVideos,
  fadeVideoVolume,
} from '../../utils/audioCoordinator';
import { getCachedVideoUrl } from '../../utils/mediaPreloader';

interface Props {
  artists: Artist[];
  onToast?: (msg: string) => void;
  onOpenNight1?: () => void;
  onOpenNight2?: () => void;
}

export const LineupSectionMobile: React.FC<Props> = ({
  artists,
  onOpenNight1,
  onOpenNight2,
}) => {
  const [activeFlashes, setActiveFlashes] = useState<{ [key: string]: boolean }>({});
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const currentPlayingIdRef = useRef<string | null>(null);
  const scrollSettlingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch drag state to differentiate between horizontal swipe and a clean tap
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const hasMovedRef = useRef(false);

  const triggerFlash = useCallback((artistId: string) => {
    setActiveFlashes(prev => ({ ...prev, [artistId]: true }));
    setTimeout(() => {
      setActiveFlashes(prev => ({ ...prev, [artistId]: false }));
    }, 450);
  }, []);

  const playArtistAudio = useCallback((artistId: string) => {
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
    // Smooth fade-out to zero before muting (eliminates click/pop)
    Object.values(videoRefs.current).forEach(vid => {
      if (vid && !vid.muted) {
        fadeVideoVolume(vid, 0, 250, () => {
          vid.muted = true;
        });
      }
    });
  }, []);

  const handleOpenArtistDetail = useCallback((artist: Artist) => {
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
  }, [onOpenNight1, onOpenNight2, stopArtistAudio]);

  // Touch / Pointer handlers to allow smooth drag while ensuring taps go to event detail
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
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleCardPointerUp = (artist: Artist, idx: number) => {
    isDraggingRef.current = false;
    // If the user tapped without dragging, toggle audio preview instead of navigating away!
    if (!hasMovedRef.current) {
      if (activeAudioArtistId === artist.id) {
        stopArtistAudio();
      } else {
        triggerFlash(artist.id);
        setActiveCardIndex(idx);
        playArtistAudio(artist.id);
      }
    }
  };

  // Update active card index & audio when centered with scroll settling protection
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

      // Debounce audio transition (75ms): prevents audio thrashing/stuttering while dragging
      if (scrollSettlingTimerRef.current) {
        clearTimeout(scrollSettlingTimerRef.current);
      }
      scrollSettlingTimerRef.current = setTimeout(() => {
        const centeredArtist = artists[closestIdx];
        if (centeredArtist) {
          playArtistAudio(centeredArtist.id);
        }
      }, 75);
    }
  };

  // Check section visibility: auto-stop artist audio when scrolling away (up or down),
  // and guarantee Section 1 is silenced when Section 2 is in view
  const checkLineupVisibility = useCallback(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.15;

    if (inView) {
      if (isSec1AudioActive()) {
        silenceSec1({ duration: 300 });
      }
      // If Section 2 is in view and no card audio is playing yet, start centered card smoothly
      // only once Section 1 has cleared sufficiently or audio ownership is granted
      if (!currentPlayingIdRef.current && canSec2PlayAudio()) {
        const targetArtist = artists[activeCardIndex] || artists[0];
        if (targetArtist) {
          playArtistAudio(targetArtist.id);
        }
      }
    } else {
      if (currentPlayingIdRef.current !== null) {
        stopArtistAudio();
      }
    }
  }, [activeCardIndex, artists, playArtistAudio, stopArtistAudio]);

  useEffect(() => {
    window.addEventListener('scroll', checkLineupVisibility, { passive: true });
    checkLineupVisibility();
    return () => {
      window.removeEventListener('scroll', checkLineupVisibility);
      if (scrollSettlingTimerRef.current) {
        clearTimeout(scrollSettlingTimerRef.current);
      }
    };
  }, [checkLineupVisibility]);

  // Auto-silence when audio owner changes or sec2 silenced; resume when sec1 finishes silencing
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
      if (scrollSettlingTimerRef.current) {
        clearTimeout(scrollSettlingTimerRef.current);
      }
    };
  }, [checkLineupVisibility, stopArtistAudio]);

  return (
    <section ref={sectionRef} id="lineup" className="lineup-mobile-section" aria-label="Lineup Artis The State of Clamour">
      {/* Desktop-Matched Clean Header */}
      <div className="lineup-mobile-header">
        <h2 className="lineup-mobile-headline">THE GUESTS</h2>
        <p className="lineup-mobile-subheadline">
          When the gates unlock, the silence breaks.
        </p>
      </div>

      {/* Smooth Touch Snap Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="lineup-mobile-carousel"
      >
        {artists.map((artist, idx) => {
          const isAudioPlaying = activeAudioArtistId === artist.id;
          const isFlashing = !!activeFlashes[artist.id];

          return (
            <article
              key={artist.id}
              className={`lineup-mobile-card ${isAudioPlaying ? 'is-playing-audio' : ''}`}
              onPointerUp={() => handleCardPointerUp(artist, idx)}
              onPointerCancel={handlePointerCancel}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerFlash(artist.id);
                  if (activeAudioArtistId === artist.id) {
                    stopArtistAudio();
                  } else {
                    setActiveCardIndex(idx);
                    playArtistAudio(artist.id);
                  }
                }
              }}
              role="button"
              tabIndex={0}
              title={isAudioPlaying ? 'Ketuk untuk jeda preview audio' : 'Ketuk untuk putar preview audio'}
              aria-label={`${artist.name} - ${artist.stageName}`}
            >
              {/* Portrait Media Frame */}
              <div className="lineup-mobile-portrait-frame">
                {artist.videoUrl ? (
                  <video
                    ref={el => { videoRefs.current[artist.id] = el; }}
                    src={getCachedVideoUrl(artist.videoUrl) || artist.videoUrl}
                    poster={artist.posterUrl || artist.imageUrl}
                    className="lineup-mobile-media-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="lineup-mobile-media-img"
                    loading="lazy"
                  />
                )}

                {/* Strobe Camera Flash Flare */}
                <div
                  className={`lineup-mobile-strobe-flash ${isFlashing ? 'is-flashing' : ''}`}
                  aria-hidden="true"
                />

                {/* Dark Vignette / Scrim Gradient */}
                <div className="lineup-mobile-scrim" />
              </div>

              {/* Info Pane Overlaid on Bottom of the Card */}
              <div className="lineup-mobile-info-pane">
                <div className="lineup-mobile-kicker-row">
                  <span className="lineup-mobile-day-kicker">
                    {artist.dayLabel} · {artist.performanceTime}
                  </span>
                  {isAudioPlaying && (
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

                <h3 className="lineup-mobile-artist-name">
                  {artist.name}
                </h3>

                <span className="lineup-mobile-stage-meta">
                  STAGE // {artist.stageName}
                </span>

                <div
                  className="lineup-mobile-inspect-link"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    handleOpenArtistDetail(artist);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenArtistDetail(artist);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat detail event untuk ${artist.name}`}
                  title="Buka detail event acara"
                >
                  <span>LIHAT DETAIL EVENT</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="lineup-mobile-dots" aria-hidden="true">
        {artists.map((artist, idx) => (
          <div
            key={artist.id}
            className={`lineup-mobile-dot-item ${activeCardIndex === idx ? 'is-active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

export default LineupSectionMobile;
