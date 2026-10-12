import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  ShieldCheck,
  Volume2,
  Lock,
  Sparkles
} from 'lucide-react';
import { TicketTier } from '../types';
import { FloorPlanViewer } from '../components/floorplan/FloorPlanViewer';
import { OfficialFAQSection } from '../components/OfficialFAQSection';
import '../styles/streaming-event.css';

interface Props {
  tickets: TicketTier[];
  initialPackageId?: string;
  onBack: () => void;
  onCheckout: (ticket: TicketTier) => void;
  onViewNight2?: () => void;
  onToast?: (msg: string) => void;
}

export const NightOneEventPage: React.FC<Props> = ({
  onViewNight2
}) => {
  const [activeSection, setActiveSection] = useState<'spotlight' | 'rundown' | 'reservasi' | 'faq'>('spotlight');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  return (
    <main className="streaming-event-page">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. CINEMATIC BILLBOARD HERO (STREAMING / NETFLIX STYLE)                 */}
      {/* ---------------------------------------------------------------------- */}
      <section className="streaming-billboard">
        {/* Full-bleed visual backdrop */}
        <div className="streaming-backdrop-wrap">
          <img
            src="/assets/crimson_gothic_cathedral_hall.png"
            alt="The State of Clamour Night 1 Assembly"
            className="streaming-backdrop-img"
          />
        </div>

        {/* Gradient Scrims for readability */}
        <div className="streaming-scrim-top" />
        <div className="streaming-scrim-left" />
        <div className="streaming-scrim-bottom" />

        {/* Billboard Hero Content Overlay */}
        <div className="streaming-hero-content">
          {/* Eyebrow / Kicker */}
          <div className="streaming-hero-eyebrow">
            <span className="streaming-eyebrow-dash">—</span>
            <span>THE STATE OF CLAMOUR</span>
            <span className="streaming-eyebrow-sep">/</span>
            <span>CHAPTER 01</span>
          </div>

          {/* Monumental Clean Typography Title */}
          <h1 className="streaming-hero-title">
            <span className="streaming-title-line-1">DAY 1</span>
            <span className="streaming-title-line-2">SWEAR IN CONTINENTAL</span>
          </h1>

          {/* Clean Metadata Line */}
          <div className="streaming-hero-meta">
            <span>30 OKTOBER 2026</span>
            <span className="streaming-meta-dot">·</span>
            <span>MAIN ASSEMBLY HALL</span>
            <span className="streaming-meta-pipe">|</span>
            <span>18+</span>
          </div>

          {/* Minimalist Action Row */}
          <div className="streaming-hero-actions">
            <button
              type="button"
              onClick={() => scrollToSection('reservasi')}
              className="streaming-btn-primary btn-press"
            >
              <span>RESERVASI SEKARANG</span>
              <span className="streaming-btn-arrow">→</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('reservasi')}
              className="streaming-link-secondary"
            >
              JELAJAHI VENUE
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. IN-PAGE STICKY SECTION NAVIGATOR                                    */}
      {/* ---------------------------------------------------------------------- */}
      <nav className="streaming-nav-bar" aria-label="Lompat ke bagian acara">
        <div className="streaming-nav-inner">
          {/* Night Selector Tabs (Season Switcher DNA) */}
          <div className="streaming-night-tabs">
            <span className="streaming-night-tab is-active">MALAM I · 30 OKT</span>
            {onViewNight2 && (
              <button
                type="button"
                onClick={onViewNight2}
                className="streaming-night-tab is-switch"
                title="Beralih ke Dossier Malam II"
              >
                MALAM II · 31 OKT →
              </button>
            )}
          </div>
          <div className="streaming-nav-divider" />

          <button
            type="button"
            onClick={() => { setActiveSection('spotlight'); scrollToSection('spotlight'); }}
            className={`streaming-nav-link ${activeSection === 'spotlight' ? 'is-active' : ''}`}
          >
            HEADLINER RAHASIA
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('rundown'); scrollToSection('rundown'); }}
            className={`streaming-nav-link ${activeSection === 'rundown' ? 'is-active' : ''}`}
          >
            RUNDOWN ACARA
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('reservasi'); scrollToSection('reservasi'); }}
            className={`streaming-nav-link ${activeSection === 'reservasi' ? 'is-active' : ''}`}
          >
            DENAH &amp; RESERVASI
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('faq'); scrollToSection('faq-section'); }}
            className={`streaming-nav-link ${activeSection === 'faq' ? 'is-active' : ''}`}
          >
            FAQ RESMI
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. MAIN DOSSIER BODY CONTAINER                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="streaming-section-container">
        
        {/* Spotlight Showcase: Teaser Headliner Night I */}
        <section id="spotlight" style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">HEADLINER MALAM PERTAMA</span>
              <h2 className="streaming-section-title">PENAMPIL UTAMA // PHASE 01 TEASER</h2>
            </div>
            <span className="streaming-badge-box is-tba">DIUMUMKAN SEGERA</span>
          </div>

          <div className="streaming-spotlight-card">
            {/* Visual Teaser with Mystery Aura */}
            <div className="streaming-spotlight-visual">
              <img
                src="/assets/day1_billboard_assembly.jpg"
                alt="Headliner Rahasia Malam 1"
                className="streaming-spotlight-img"
              />
              <div className="streaming-spotlight-mystery-overlay">
                <div className="streaming-mystery-icon">
                  <Lock size={22} />
                </div>
                <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '0.78rem', letterSpacing: '0.15em', color: '#e5c378' }}>
                  SECRET HEADLINER
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245, 242, 235, 0.65)' }}>
                  PENGUMUMAN SEGERA
                </div>
              </div>
              <div className="streaming-spotlight-badge">
                <Sparkles size={11} />
                <span>NIGHT I EXCLUSIVE</span>
              </div>
            </div>

            {/* Teaser Information */}
            <div className="streaming-spotlight-info">
              <span className="streaming-spotlight-sub">SWEAR IN CONTINENTAL LIVE CONCERT</span>
              <h3 className="streaming-spotlight-title">SECRET HEADLINER (TBA)</h3>
              <p className="streaming-spotlight-desc">
                Penampil tamu istimewa yang akan membawakan aransemen orkestral monumental dengan live brass section dan formasi panggung 360° berkekuatan tinggi di aula monumental setinggi 14 meter. Tiket Early Bird dan Presale menjamin akses masuk penuh tanpa syarat saat pengumuman resmi dibuka.
              </p>

              <div className="streaming-spotlight-meta-grid">
                <div className="streaming-meta-block">
                  <Clock size={16} style={{ color: 'var(--color-gold-antique)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>WAKTU SHOW</strong>
                    <p>22:30 — 00:30 WIB (120 Menit)</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <MapPin size={16} style={{ color: 'var(--color-crimson)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>LOKASI PANGGUNG</strong>
                    <p>Main Assembly Hall (Lt. 1)</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <Volume2 size={16} style={{ color: 'var(--color-gold-antique)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>TATA SUARA</strong>
                    <p>118dB Line-Array Stereo</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <ShieldCheck size={16} style={{ color: 'var(--color-gold-antique)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>BATAS USIA</strong>
                    <p>18+ (Wajib KTP Fisik Asli)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Rundown Acara (Streaming Running Order Format) */}
        <section id="rundown" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">SUSUNAN ACARA HARIAN</span>
              <h2 className="streaming-section-title">RUNDOWN // MALAM I (30 OKT 2026)</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 242, 235, 0.6)' }}>
              Total Durasi: 6.5 Jam
            </span>
          </div>

          <div className="streaming-episodes-grid">
            {/* Act 01 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day1_billboard_assembly.jpg" alt="Pintu Masuk & Registrasi" />
                <span className="streaming-episode-num-badge">01</span>
                <span className="streaming-episode-duration">90 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Open Doors &amp; RFID Registration</h3>
                  <span className="streaming-episode-stage-pill">20:00 — 21:30 WIB</span>
                </div>
                <p className="streaming-episode-desc">
                  Penukaran e-ticket ke gelang fisik RFID resmi, verifikasi KTP fisik di loket utama, dan eksplorasi lounge pembuka aula katedral.
                </p>
              </div>
            </article>

            {/* Act 02 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day1_billboard_assembly.jpg" alt="Resident Warm-up" />
                <span className="streaming-episode-num-badge">02</span>
                <span className="streaming-episode-duration">60 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Resident Selector &amp; Brass Warm-Up</h3>
                  <span className="streaming-episode-stage-pill">21:30 — 22:30 WIB</span>
                </div>
                <p className="streaming-episode-desc">
                  Pemanasan frekuensi oleh selector resmi The State of Clamour dengan harmoni live brass section dan ketukan kontinental bertempo sedang.
                </p>
              </div>
            </article>

            {/* Act 03: Headliner Main Event */}
            <article className="streaming-episode-card is-headliner">
              <div className="streaming-episode-thumb">
                <img src="/assets/day1_billboard_assembly.jpg" alt="Headliner Utama" />
                <span className="streaming-episode-num-badge" style={{ background: '#d4af37', color: '#000' }}>
                  ★ 03
                </span>
                <span className="streaming-episode-duration">120 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title" style={{ color: '#e5c378' }}>
                    ★ SECRET HEADLINER (TBA) — Main Concert
                  </h3>
                  <span className="streaming-episode-stage-pill" style={{ borderColor: '#d4af37', color: '#e5c378' }}>
                    22:30 — 00:30 WIB
                  </span>
                </div>
                <p className="streaming-episode-desc">
                  Puncak pertunjukan panggung utama 360° yang mengguncang aula 14 meter dengan aransemen live berskala masif berdaya suara 118dB.
                </p>
              </div>
            </article>

            {/* Act 04 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day1_billboard_assembly.jpg" alt="Nocturnal Closing" />
                <span className="streaming-episode-num-badge">04</span>
                <span className="streaming-episode-duration">120 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Late-Night Resonance &amp; Closing Session</h3>
                  <span className="streaming-episode-stage-pill">00:30 — 02:30 WIB</span>
                </div>
                <p className="streaming-episode-desc">
                  Set kurasi malam temaram sebagai penutup ritual suara malam pertama bagi audiens sebelum pintu aula ditutup kembali.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Section: Denah & Reservasi Meja VIP Day 1 */}
        <section id="reservasi" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">DENAH VENUE &amp; RESERVASI MEJA</span>
              <h2 className="streaming-section-title">DENAH &amp; MEJA // DAY 1 (30 OKT 2026)</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#c5a059' }}>
              Tetra Solo &amp; Mizu Commonroom
            </span>
          </div>

          <FloorPlanViewer
            day="day-1"
          />
        </section>

        {/* Section: Panduan & FAQ Resmi (Bagian Paling Bawah) */}
        <OfficialFAQSection />

      </div>
    </main>
  );
};

export default NightOneEventPage;
