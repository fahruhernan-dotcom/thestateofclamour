import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Artist } from '../../types';

interface Props {
  artists: Artist[];
  onOpenNight1: () => void;
  onOpenNight2: () => void;
  onOpenFullDossier: () => void;
}

export const StageRundownMobile: React.FC<Props> = ({
  onOpenNight1,
  onOpenNight2,
  onOpenFullDossier,
}) => {
  return (
    <section id="the-night" className="rundown-mobile-section" aria-label="Jadwal Acara The State of Clamor">
      <div className="rundown-mobile-header">
        <span className="rundown-mobile-eyebrow">DETAIL ACARA</span>
        <h2 className="rundown-mobile-headline">NIGHTLY SCHEDULE</h2>
        <p className="rundown-mobile-subtext">
          Pilih salah satu event untuk melihat susunan waktu jam per jam dan panduan resmi.
        </p>
      </div>

      <div className="rundown-mobile-cards-stack">
        {/* Night 1 Card */}
        <article
          className="rundown-mobile-card"
          onClick={onOpenNight1}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenNight1(); } }}
          role="button"
          tabIndex={0}
          aria-label="Buka detail acara Day 1 — Swear In Continental"
        >
          <div className="rundown-mobile-banner">
            <img
              src="/assets/day1_billboard_assembly.jpg"
              alt="Night I — Swear In Continental Concert"
              className="rundown-mobile-banner-img"
              loading="lazy"
              decoding="async"
            />
            <div className="rundown-mobile-banner-scrim" />
            <div className="rundown-mobile-badge-row">
              <span className="rundown-mobile-night-tag">DAY 1 · 30 OKT</span>
              <span className="rundown-mobile-venue-tag">MAIN ASSEMBLY</span>
            </div>
          </div>

          <div className="rundown-mobile-body">
            <h3 className="rundown-mobile-title">DAY 1 — SWEAR IN CONTINENTAL</h3>
            <p className="rundown-mobile-tagline">SECRET HEADLINER // TO BE ANNOUNCED</p>
            <p className="rundown-mobile-desc">
              Puncak pertunjukan spektakuler untuk membuka ritual Day 1 The State of Clamor.
            </p>

            <div className="rundown-mobile-meta-strip">
              <span>PINTU 20:00</span>
              <span>·</span>
              <span>SHOW 22:30</span>
              <span>·</span>
              <span>18+ TERBATAS</span>
            </div>

            <div className="rundown-mobile-action-row">
              <span className="rundown-mobile-action-text">JELAJAHI DAY 1</span>
              <ArrowRight size={14} style={{ color: 'var(--color-gold-antique)' }} />
            </div>
          </div>
        </article>

        {/* Day 2 Card */}
        <article
          className="rundown-mobile-card"
          onClick={onOpenNight2}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenNight2(); } }}
          role="button"
          tabIndex={0}
          aria-label="Buka detail acara Day 2 — Swear in Continental"
        >
          <div className="rundown-mobile-banner">
            <img
              src="/assets/gothic_cathedral_ritual_concert.png"
              alt="Day 2 — Swear in Continental"
              className="rundown-mobile-banner-img"
              loading="lazy"
              decoding="async"
            />
            <div className="rundown-mobile-banner-scrim" />
            <div className="rundown-mobile-badge-row">
              <span className="rundown-mobile-night-tag">DAY 2 · 31 OKT</span>
              <span className="rundown-mobile-venue-tag">SWEAR IN CONTINENTAL</span>
            </div>
          </div>

          <div className="rundown-mobile-body">
            <h3 className="rundown-mobile-title">DAY 2 — SWEAR IN CONTINENTAL</h3>
            <p className="rundown-mobile-tagline">SECRET HEADLINER // TO BE ANNOUNCED</p>
            <p className="rundown-mobile-desc">
              Puncak ritual Day 2 dengan set audio visual imersif penutup The State of Clamor.
            </p>

            <div className="rundown-mobile-meta-strip">
              <span>PINTU 20:00</span>
              <span>·</span>
              <span>SHOW 00:00</span>
              <span>·</span>
              <span>18+ TERBATAS</span>
            </div>

            <div className="rundown-mobile-action-row">
              <span className="rundown-mobile-action-text">JELAJAHI DAY 2</span>
              <ArrowRight size={14} style={{ color: 'var(--color-gold-antique)' }} />
            </div>
          </div>
        </article>
      </div>

      <button
        type="button"
        onClick={onOpenFullDossier}
        className="rundown-mobile-dossier-cta"
      >
        <FileText size={15} style={{ color: 'var(--color-gold-antique)' }} />
        <span>BUKA PANDUAN LENGKAP & RUNDOWN</span>
      </button>
    </section>
  );
};

export default StageRundownMobile;
