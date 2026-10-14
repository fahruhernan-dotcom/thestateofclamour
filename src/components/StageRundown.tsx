import React from 'react';
import { Artist } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';
import { StageRundownMobile } from './mobile/StageRundownMobile';

interface Props {
  artists: Artist[];
  onOpenNight1: () => void;
  onOpenNight2: () => void;
  onOpenFullDossier: () => void;
}

export const StageRundown: React.FC<Props> = ({
  artists: _artists,
  onOpenNight1,
  onOpenNight2,
  onOpenFullDossier,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <StageRundownMobile
        artists={_artists}
        onOpenNight1={onOpenNight1}
        onOpenNight2={onOpenNight2}
        onOpenFullDossier={onOpenFullDossier}
      />
    );
  }

  return (
    <section id="the-night" className="cinematic-section stage-rundown-section">
      <div className="stage-rundown-header-block">
        <h2 className="section-headline">
          DETAIL ACARA
        </h2>

        <p className="section-subheadline">
          Pilih salah satu event untuk melihat susunan waktu jam per jam dan panduan resmi.
        </p>
      </div>

      {/* Grid of 2 Monumental Night Showcase Panels */}
      <div className="events-roster-grid">
        {/* Panel 1: Night I */}
        <article
          className="event-roster-card"
          onClick={onOpenNight1}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenNight1();
            }
          }}
          aria-label="Buka detail acara Night 1 — Swear In Continental Concert"
        >
          {/* Cinematic Atmospheric Banner */}
          <div className="event-roster-banner-wrap">
            <img
              src="/assets/day1_billboard_assembly.jpg"
              alt="Night I — Swear In Continental Concert"
              className="event-roster-banner-img"
              loading="lazy"
            />
            <div className="event-roster-banner-scrim" />
            <div className="event-roster-banner-badges">
              <span className="event-night-tag">DAY 1 · 30 OKT 2026</span>
              <span className="event-venue-tag">MAIN ASSEMBLY</span>
            </div>
          </div>

          <div className="event-roster-body">
            <div className="event-roster-header">
              <h3 className="event-roster-title">
                DAY 1 — SWEAR IN CONTINENTAL
              </h3>
              <p className="event-roster-tagline">SECRET HEADLINER // TO BE ANNOUNCED</p>
            </div>

            <p className="event-roster-desc">
              Puncak pertunjukan spektakuler untuk membuka malam pertama ritual The State of Clamor.
            </p>

            {/* Clean Typographic Metadata Strip (Zero Pill Box Clutter) */}
            <div className="event-roster-meta-strip">
              <span className="event-meta-unit">PINTU 20:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">SHOW 22:30 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">MAIN STAGE</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">18+ TERBATAS</span>
            </div>

            {/* Apple Fluid Action Affordance */}
            <div className="event-roster-action">
              <span className="event-action-text">JELAJAHI DAY 1</span>
              <span className="event-action-arrow">→</span>
            </div>
          </div>
        </article>

        {/* Panel 2: Day 2 */}
        <article
          className="event-roster-card"
          onClick={onOpenNight2}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenNight2();
            }
          }}
          aria-label="Buka detail acara Day 2 — Swear in Continental"
        >
          {/* Cinematic Atmospheric Banner */}
          <div className="event-roster-banner-wrap">
            <img
              src="/assets/gothic_cathedral_ritual_concert.png"
              alt="Day 2 — Swear in Continental"
              className="event-roster-banner-img"
              loading="lazy"
            />
            <div className="event-roster-banner-scrim" />
            <div className="event-roster-banner-badges">
              <span className="event-night-tag">DAY 2 · 31 OKT 2026</span>
              <span className="event-venue-tag">SWEAR IN CONTINENTAL</span>
            </div>
          </div>

          <div className="event-roster-body">
            <div className="event-roster-header">
              <h3 className="event-roster-title">
                DAY 2 — SWEAR IN CONTINENTAL
              </h3>
              <p className="event-roster-tagline">SECRET HEADLINER // TO BE ANNOUNCED</p>
            </div>

            <p className="event-roster-desc">
              Puncak ritual malam kedua dengan set audio visual imersif penutup The State of Clamor.
            </p>

            {/* Clean Typographic Metadata Strip (Zero Pill Box Clutter) */}
            <div className="event-roster-meta-strip">
              <span className="event-meta-unit">PINTU 20:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">SHOW 00:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">NOCTURNAL STAGE</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">18+ TERBATAS</span>
            </div>

            {/* Apple Fluid Action Affordance */}
            <div className="event-roster-action">
              <span className="event-action-text">JELAJAHI DAY 2</span>
              <span className="event-action-arrow">→</span>
            </div>
          </div>
        </article>
      </div>

      {/* Master 2-Night Complete Dossier Strip */}
      <div
        className="event-master-dossier-banner"
        onClick={onOpenFullDossier}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenFullDossier();
          }
        }}
        aria-label="Buka Dosir Resmi 2 Hari Lengkap"
      >
        <div className="master-banner-left">
          <div className="master-banner-eyebrow">
            <span>PANDUAN LENGKAP 2 MALAM</span>
            <span className="master-bullet">·</span>
            <span>DOSIR RESMI</span>
          </div>
          <h3 className="master-banner-title">
            THE STATE OF CLAMOR — DOSIR RESMI
          </h3>
          <p className="master-banner-desc">
            Rundown lengkap 2 malam paralel, denah seluruh panggung, tata tertib identitas fisik, dan panduan masuk.
          </p>
        </div>

        <div className="master-banner-action">
          <span className="master-action-label">BUKA DOSIR MASTER</span>
          <span className="master-action-arrow">→</span>
        </div>
      </div>
    </section>
  );
};

export default StageRundown;
