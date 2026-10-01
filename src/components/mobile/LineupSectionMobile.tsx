import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { Artist } from '../../types';
import { silenceSec1, setAudioOwner, getAudioOwner } from '../../utils/audioCoordinator';
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
  const [selectedDay, setSelectedDay] = useState<'ALL' | 'DAY_1' | 'DAY_2'>('ALL');
  const [activeFlashes, setActiveFlashes] = useState<{ [key: string]: boolean }>({});
  const [activeAudioArtistId, setActiveAudioArtistId] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const filteredArtists = useMemo(() => {
    if (selectedDay === 'DAY_1') {
      return artists.filter(a => a.dayLabel?.includes('30') || a.id.includes('malvin') || a.id.includes('basboi'));
    }
    if (selectedDay === 'DAY_2') {
      return artists.filter(a => a.dayLabel?.includes('31') || a.id.includes('far') || a.id.includes('elena'));
    }
    return artists;
  }, [artists, selectedDay]);

  const triggerFlash = useCallback((artistId: string) => {
    setActiveFlashes(prev => ({ ...prev, [artistId]: true }));
    setTimeout(() => {
      setActiveFlashes(prev => ({ ...prev, [artistId]: false }));
    }, 450);
  }, []);

  const playArtistAudio = useCallback((artistId: string) => {
    silenceSec1();
    setAudioOwner('sec2-lineup');
    setActiveAudioArtistId(artistId);

    // Unmute target video
    Object.entries(videoRefs.current).forEach(([id, vid]) => {
      if (vid) {
        if (id === artistId) {
          vid.muted = false;
          vid.volume = 0.95;
          vid.play().catch(() => {});
        } else {
          vid.muted = true;
        }
      }
    });
  }, []);

  const stopArtistAudio = useCallback(() => {
    setActiveAudioArtistId(null);
    if (getAudioOwner() === 'sec2-lineup') {
      setAudioOwner('none');
    }
    Object.values(videoRefs.current).forEach(vid => {
      if (vid) vid.muted = true;
    });
  }, []);

  const handleAudioToggle = (artist: Artist) => {
    if (activeAudioArtistId === artist.id) {
      stopArtistAudio();
    } else {
      triggerFlash(artist.id);
      playArtistAudio(artist.id);
    }
  };

  const handleOpenArtistDetail = (artist: Artist) => {
    stopArtistAudio();
    if ((artist.id === 'art-malvin' || artist.id === 'art-basboi' || artist.dayLabel?.includes('30')) && onOpenNight1) {
      onOpenNight1();
    } else if ((artist.id === 'art-far' || artist.id === 'art-elena' || artist.dayLabel?.includes('31')) && onOpenNight2) {
      onOpenNight2();
    }
  };

  // Scroll listener to update active index dot
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
    setActiveCardIndex(closestIdx);
  };

  // Auto-silence when audio owner changes
  useEffect(() => {
    const handleOwnerChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ owner: string }>;
      if (customEvent.detail?.owner === 'sec1-storytelling') {
        stopArtistAudio();
      }
    };
    window.addEventListener('how:audio-owner-change', handleOwnerChange);
    return () => window.removeEventListener('how:audio-owner-change', handleOwnerChange);
  }, [stopArtistAudio]);

  return (
    <section id="lineup" className="lineup-mobile-section" aria-label="Lineup Artis The State of Clamour">
      <div className="lineup-mobile-header">
        <span className="lineup-mobile-eyebrow">THE GUESTS</span>
        <h2 className="lineup-mobile-headline">SWEAR IN CONTINENTAL</h2>
        <p className="lineup-mobile-subtext">
          When the gates unlock, the monumental silence breaks.
        </p>
      </div>

      {/* Day Filter Switcher */}
      <div className="lineup-mobile-day-tabs" role="tablist" aria-label="Filter Hari Acara">
        <button
          type="button"
          role="tab"
          aria-selected={selectedDay === 'ALL'}
          className={`lineup-mobile-tab-btn ${selectedDay === 'ALL' ? 'is-active' : ''}`}
          onClick={() => setSelectedDay('ALL')}
        >
          ALL ARTISTS
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedDay === 'DAY_1'}
          className={`lineup-mobile-tab-btn ${selectedDay === 'DAY_1' ? 'is-active' : ''}`}
          onClick={() => setSelectedDay('DAY_1')}
        >
          DAY 1 · 30 OKT
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedDay === 'DAY_2'}
          className={`lineup-mobile-tab-btn ${selectedDay === 'DAY_2' ? 'is-active' : ''}`}
          onClick={() => setSelectedDay('DAY_2')}
        >
          DAY 2 · 31 OKT
        </button>
      </div>

      {/* Snap Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="lineup-mobile-carousel-wrap"
      >
        {filteredArtists.map((artist) => {
          const isAudioPlaying = activeAudioArtistId === artist.id;
          const isFlashing = !!activeFlashes[artist.id];

          return (
            <article
              key={artist.id}
              className={`lineup-mobile-card ${isAudioPlaying ? 'is-playing-audio' : ''}`}
              onClick={() => triggerFlash(artist.id)}
            >
              <div className="lineup-mobile-card-media">
                {artist.videoUrl ? (
                  <video
                    ref={el => { videoRefs.current[artist.id] = el; }}
                    src={getCachedVideoUrl(artist.videoUrl) || artist.videoUrl}
                    poster={artist.posterUrl || artist.imageUrl}
                    className="lineup-mobile-card-video"
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
                    className="lineup-mobile-card-img"
                    loading="lazy"
                  />
                )}

                {/* Strobe Flash */}
                <div
                  className={`lineup-mobile-strobe-flash ${isFlashing ? 'is-flashing' : ''}`}
                  aria-hidden="true"
                />

                <div className="lineup-mobile-media-scrim" />
              </div>

              <div className="lineup-mobile-info-pane">
                <div className="lineup-mobile-kicker-row">
                  <span className="lineup-mobile-day-kicker">
                    {artist.dayLabel} · {artist.performanceTime}
                  </span>
                  {isAudioPlaying && (
                    <span className="lineup-mobile-sound-badge">
                      <span>PREVIEW</span>
                    </span>
                  )}
                </div>

                <h3 className="lineup-mobile-artist-name">
                  {artist.name}
                </h3>

                <span className="lineup-mobile-stage-meta">
                  STAGE // {artist.stageName}
                </span>

                <div className="lineup-mobile-actions-row">
                  <button
                    type="button"
                    className="lineup-mobile-audio-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudioToggle(artist);
                    }}
                    aria-label={isAudioPlaying ? `Hentikan audio ${artist.name}` : `Putar audio ${artist.name}`}
                  >
                    {isAudioPlaying ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    <span>{isAudioPlaying ? 'MUTE' : 'PREVIEW'}</span>
                  </button>

                  <div
                    className="lineup-mobile-detail-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenArtistDetail(artist);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span>DETAIL ACARA</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="lineup-mobile-dots" aria-hidden="true">
        {filteredArtists.map((artist, idx) => (
          <div
            key={artist.id}
            className={`lineup-mobile-dot ${activeCardIndex === idx ? 'is-active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

export default LineupSectionMobile;
