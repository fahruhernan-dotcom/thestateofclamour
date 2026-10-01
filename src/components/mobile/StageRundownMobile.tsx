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
    <section id="the-night" className="rundown-mobile-section" aria-label="Jadwal Acara The State of Clamour">
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
          role="button"
          tabIndex={0}
          aria-label="Buka detail acara Malam I — Basboi"
        >
          <div className="rundown-mobile-banner">
            <img
              src="/assets/guest_basboi.jpg"
              alt="Night I — Basboi Swear In Continental Concert"
              className="rundown-mobile-banner-img"
              loading="lazy"
            />
            <div className="rundown-mobile-banner-scrim" />
            <div className="rundown-mobile-badge-row">
              <span className="rundown-mobile-night-tag">MALAM I · 30 OKT</span>
              <span className="rundown-mobile-venue-tag">MAIN ASSEMBLY</span>
            </div>
          </div>

          <div className="rundown-mobile-body">
            <h3 className="rundown-mobile-title">MALAM I — BASBOI</h3>
            <p className="rundown-mobile-tagline">SWEAR IN CONTINENTAL CONCERT</p>
            <p className="rundown-mobile-desc">
              Konser panggung utama hip-hop sinematik dan brass akustik megah di Main Assembly Hall berketinggian 14 meter.
            </p>

            <div className="rundown-mobile-meta-strip">
              <span>PINTU 21:00</span>
              <span>·</span>
              <span>SHOW 22:30</span>
              <span>·</span>
              <span>18+ TERBATAS</span>
            </div>

            <div className="rundown-mobile-action-row">
              <span className="rundown-mobile-action-text">JELAJAHI MALAM I</span>
              <ArrowRight size={14} style={{ color: 'var(--color-gold-antique)' }} />
            </div>
          </div>
        </article>

        {/* Night 2 Card */}
        <article
          className="rundown-mobile-card"
          onClick={onOpenNight2}
          role="button"
          tabIndex={0}
          aria-label="Buka detail acara Malam II — Elena Vex"
        >
          <div className="rundown-mobile-banner">
            <img
              src="/assets/guest_elena.jpg"
              alt="Night II — Elena Vex Industrial Techno Assembly"
              className="rundown-mobile-banner-img"
              loading="lazy"
            />
            <div className="rundown-mobile-banner-scrim" />
            <div className="rundown-mobile-badge-row">
              <span className="rundown-mobile-night-tag">MALAM II · 31 OKT</span>
              <span className="rundown-mobile-venue-tag">CATHEDRAL HALL</span>
            </div>
          </div>

          <div className="rundown-mobile-body">
            <h3 className="rundown-mobile-title">MALAM II — ELENA VEX</h3>
            <p className="rundown-mobile-tagline">INDUSTRIAL TECHNO RAVE</p>
            <p className="rundown-mobile-desc">
              Pengalaman rave berkecepatan 142 BPM dengan visual laser strobo monokromatik dan tata suara Funktion-One.
            </p>

            <div className="rundown-mobile-meta-strip">
              <span>PINTU 21:30</span>
              <span>·</span>
              <span>SHOW 00:00</span>
              <span>·</span>
              <span>18+ TERBATAS</span>
            </div>

            <div className="rundown-mobile-action-row">
              <span className="rundown-mobile-action-text">JELAJAHI MALAM II</span>
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
