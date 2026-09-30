import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { Artist } from '../types';

interface Props {
  artists: Artist[];
  onOpenNight1: () => void;
  onOpenNight2: () => void;
  onOpenFullDossier: () => void;
}

export const StageRundown: React.FC<Props> = ({
  artists,
  onOpenNight1,
  onOpenNight2,
  onOpenFullDossier,
}) => {
  const basboi = artists.find(a => a.id === 'art-malvin' || a.id === 'art-basboi') || artists[0];
  const elena = artists.find(a => a.id === 'art-far' || a.id === 'art-elena') || artists[1] || artists[0];

  return (
    <section id="the-night" className="cinematic-section">
      <div className="section-eyebrow">
        <span>04 // INFORMASI ACARA</span>
      </div>

      <h2 className="section-headline">
        DETAIL & RUNDOWN ACARA
      </h2>

      <p className="section-subheadline" style={{ marginBottom: '2.5rem' }}>
        Pilih salah satu event untuk melihat susunan waktu jam per jam dan panduan resmi.
      </p>

      {/* Grid of Distinct Events */}
      <div className="events-roster-grid">
        {/* Card Event 01: Night I */}
        <article className="event-roster-card">
          <div className="event-roster-card-top">
            <div className="event-gateway-badge">
              <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
              <span>EVENT 01 // JUMAT, 30 OKT 2026</span>
            </div>
            <div className="event-gateway-city">MAIN ASSEMBLY</div>
          </div>

          <div className="event-roster-content">
            <div className="event-roster-artist-preview">
              <img
                src={basboi?.imageUrl || '/assets/guest_basboi.jpg'}
                alt="Basboi"
                className="event-roster-thumb"
              />
              <div>
                <h3 className="event-roster-title text-gold-metallic">
                  NIGHT I — BASBOI
                </h3>
                <p className="event-roster-tagline">SWEAR IN CONTINENTAL CONCERT</p>
              </div>
            </div>

            <p className="event-roster-desc">
              Konser panggung utama hip-hop sinematik dan live brass di Main Assembly Hall berketinggian 14 meter.
            </p>

            <div className="event-gateway-highlights-row">
              <div className="gateway-highlight-item">
                <Calendar size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>30 OKT 2026</span>
              </div>
              <div className="gateway-highlight-item">
                <Clock size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>21:00 // SHOW 22:30 WIB</span>
              </div>
              <div className="gateway-highlight-item">
                <MapPin size={14} style={{ color: 'var(--color-crimson)' }} />
                <span>MAIN STAGE</span>
              </div>
              <div className="gateway-highlight-item">
                <ShieldCheck size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>18+ TERBATAS</span>
              </div>
            </div>

            <div className="event-roster-footer">
              <button
                type="button"
                onClick={onOpenNight1}
                className="btn-open-event-detail btn-press"
              >
                <span>DETAIL EVENT NIGHT I</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>

        {/* Card Event 02: Night II */}
        <article className="event-roster-card">
          <div className="event-roster-card-top">
            <div className="event-gateway-badge">
              <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
              <span>EVENT 02 // SABTU, 31 OKT 2026</span>
            </div>
            <div className="event-gateway-city">THE UNDER-VAULT</div>
          </div>

          <div className="event-roster-content">
            <div className="event-roster-artist-preview">
              <img
                src={elena?.imageUrl || '/assets/guest_elena.jpg'}
                alt="Elena Vex"
                className="event-roster-thumb"
              />
              <div>
                <h3 className="event-roster-title text-gold-metallic">
                  NIGHT II — ELENA VEX
                </h3>
                <p className="event-roster-tagline">SUBTERRANEAN MODULAR TECHNO</p>
              </div>
            </div>

            <p className="event-roster-desc">
              Live modular synthesizer analog real-time dan gelombang sub-bass di bunker bawah tanah The Under-Vault.
            </p>

            <div className="event-gateway-highlights-row">
              <div className="gateway-highlight-item">
                <Calendar size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>31 OKT 2026</span>
              </div>
              <div className="gateway-highlight-item">
                <Clock size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>21:00 // SHOW 00:00 WIB</span>
              </div>
              <div className="gateway-highlight-item">
                <MapPin size={14} style={{ color: 'var(--color-crimson)' }} />
                <span>NOCTURNAL STAGE</span>
              </div>
              <div className="gateway-highlight-item">
                <ShieldCheck size={14} style={{ color: 'var(--color-gold-antique)' }} />
                <span>18+ TERBATAS</span>
              </div>
            </div>

            <div className="event-roster-footer">
              <button
                type="button"
                onClick={onOpenNight2}
                className="btn-open-event-detail btn-press"
              >
                <span>DETAIL EVENT NIGHT II</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Master 2-Night Complete Dossier Banner */}
      <div className="event-master-dossier-banner">
        <div className="master-banner-left">
          <div className="event-gateway-badge">
            <FileText size={13} style={{ color: 'var(--color-gold-antique)' }} />
            <span>PANDUAN LENGKAP 2 MALAM // DOSIR MASTER</span>
          </div>
          <h3 className="master-banner-title">
            THE STATE OF CLAMOUR — DOSIR RESMI
          </h3>
          <p className="master-banner-desc">
            Rundown lengkap 2 malam paralel, denah seluruh panggung, tata tertib identitas fisik, dan tanya jawab (FAQ).
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFullDossier}
          className="btn-open-master-dossier btn-press"
        >
          <span>DOSIR MASTER (2 HARI)</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default StageRundown;
