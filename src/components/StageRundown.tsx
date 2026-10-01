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
              src="/assets/guest_basboi.jpg"
              alt="Night I — Basboi Swear In Continental Concert"
              className="event-roster-banner-img"
              loading="lazy"
            />
            <div className="event-roster-banner-scrim" />
            <div className="event-roster-banner-badges">
              <span className="event-night-tag">MALAM I · 30 OKT 2026</span>
              <span className="event-venue-tag">MAIN ASSEMBLY</span>
            </div>
          </div>

          <div className="event-roster-body">
            <div className="event-roster-header">
              <h3 className="event-roster-title">
                NIGHT I — BASBOI
              </h3>
              <p className="event-roster-tagline">SWEAR IN CONTINENTAL CONCERT</p>
            </div>

            <p className="event-roster-desc">
              Konser panggung utama hip-hop sinematik dan brass akustik megah di Main Assembly Hall berketinggian 14 meter.
            </p>

            {/* Clean Typographic Metadata Strip (Zero Pill Box Clutter) */}
            <div className="event-roster-meta-strip">
              <span className="event-meta-unit">PINTU 21:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">SHOW 22:30 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">MAIN STAGE</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">18+ TERBATAS</span>
            </div>

            {/* Apple Fluid Action Affordance */}
            <div className="event-roster-action">
              <span className="event-action-text">JELAJAHI MALAM I</span>
              <span className="event-action-arrow">→</span>
            </div>
          </div>
        </article>

        {/* Panel 2: Night II */}
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
          aria-label="Buka detail acara Night 2 — Subterranean Modular Techno"
        >
          {/* Cinematic Atmospheric Banner */}
          <div className="event-roster-banner-wrap">
            <img
              src="/assets/guest_elena.jpg"
              alt="Night II — Elena Vex Subterranean Modular Techno"
              className="event-roster-banner-img"
              loading="lazy"
            />
            <div className="event-roster-banner-scrim" />
            <div className="event-roster-banner-badges">
              <span className="event-night-tag">MALAM II · 31 OKT 2026</span>
              <span className="event-venue-tag">THE UNDER-VAULT</span>
            </div>
          </div>

          <div className="event-roster-body">
            <div className="event-roster-header">
              <h3 className="event-roster-title">
                NIGHT II — ELENA VEX
              </h3>
              <p className="event-roster-tagline">SUBTERRANEAN MODULAR TECHNO</p>
            </div>

            <p className="event-roster-desc">
              Perjalanan sonik modular synthesizer analog real-time dan gelombang sub-bass di bunker bawah tanah The Under-Vault.
            </p>

            {/* Clean Typographic Metadata Strip (Zero Pill Box Clutter) */}
            <div className="event-roster-meta-strip">
              <span className="event-meta-unit">PINTU 21:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">SHOW 00:00 WIB</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">NOCTURNAL STAGE</span>
              <span className="event-meta-dot">·</span>
              <span className="event-meta-unit">18+ TERBATAS</span>
            </div>

            {/* Apple Fluid Action Affordance */}
            <div className="event-roster-action">
              <span className="event-action-text">JELAJAHI MALAM II</span>
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
            THE STATE OF CLAMOUR — DOSIR RESMI
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
