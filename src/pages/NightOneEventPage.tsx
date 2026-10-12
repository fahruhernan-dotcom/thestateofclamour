import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShieldCheck,
  Volume2,
  Check,
  Lock,
  ChevronRight,
  Sparkles,
  Flame
} from 'lucide-react';
import { TicketTier } from '../types';
import { EventVenueMapSection } from '../components/event/EventVenueMapSection';
import { EventReservationSection } from '../components/event/EventReservationSection';
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
  tickets,
  initialPackageId,
  onBack,
  onCheckout,
  onViewNight2,
  onToast,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(initialPackageId);
  const [activeSection, setActiveSection] = useState<'spotlight' | 'rundown' | 'denah' | 'reservasi' | 'tickets' | 'panduan'>('spotlight');

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const y = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    card.style.setProperty('--foil-x', x);
    card.style.setProperty('--foil-y', y);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const handleSelectZoneForReservation = (packageId?: string) => {
    if (packageId) {
      setSelectedPackageId(packageId);
    }
    scrollToSection('reservasi');
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
            <span className="streaming-title-line-1">NIGHT I</span>
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
              onClick={() => scrollToSection('tickets')}
              className="streaming-btn-primary btn-press"
            >
              <span>AMBIL TIKET</span>
              <span className="streaming-btn-arrow">→</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('denah')}
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
            onClick={() => { setActiveSection('denah'); scrollToSection('denah'); }}
            className={`streaming-nav-link ${activeSection === 'denah' ? 'is-active' : ''}`}
          >
            DENAH VENUE
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('reservasi'); scrollToSection('reservasi'); }}
            className={`streaming-nav-link ${activeSection === 'reservasi' ? 'is-active' : ''}`}
          >
            RESERVASI VIP
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('tickets'); scrollToSection('tickets'); }}
            className={`streaming-nav-link ${activeSection === 'tickets' ? 'is-active' : ''}`}
          >
            TIKET RESMI
          </button>
          <button
            type="button"
            onClick={() => { setActiveSection('panduan'); scrollToSection('panduan'); }}
            className={`streaming-nav-link ${activeSection === 'panduan' ? 'is-active' : ''}`}
          >
            PANDUAN
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

        {/* Section: Denah & Tata Ruang Venue */}
        <section id="denah" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">TATA RUANG &amp; PANGGUNG</span>
              <h2 className="streaming-section-title">DENAH VENUE // MAIN ASSEMBLY HALL</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#c5a059' }}>
              Pilih sofa / meja VIP untuk reservasi
            </span>
          </div>

          <EventVenueMapSection
            onSelectZoneForReservation={handleSelectZoneForReservation}
            dayBadge="NIGHT I // MAIN ASSEMBLY HALL"
          />
        </section>

        {/* Section: Reservasi Meja VIP Malam 1 */}
        <section id="reservasi" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">LAYANAN SOFA &amp; MEJA VIP</span>
              <h2 className="streaming-section-title">RESERVASI VIP // MALAM I (30 OKT)</h2>
            </div>
            <span className="streaming-badge-box">TERMASUK AKSES TIKET VIP</span>
          </div>

          <EventReservationSection
            day="day-1"
            initialPackageId={selectedPackageId}
            onToast={onToast || (() => {})}
          />
        </section>

        {/* Section: Pilihan Tiket Masuk */}
        <section id="tickets" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">AKSES TIKET RESMI</span>
              <h2 className="streaming-section-title">TIKET MASUK // NIGHT I &amp; FULL PASS</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#46d369' }}>
              Transaksi Terverifikasi Artatix
            </span>
          </div>

          <div className="passage-matrix-grid is-revealed">
            {tickets.map(ticket => {
              const isSoldOut = ticket.status === 'sold_out';
              const isActive = ticket.status === 'active';

              return (
                <article
                  key={ticket.id}
                  onMouseMove={handleCardMouseMove}
                  className={`admission-document-card ${isActive ? 'is-active-tier' : ''} ${isSoldOut ? 'is-sold-out' : ''}`}
                >
                  <div className="card-foil-specular-layer" aria-hidden="true" />

                  <div className="admission-seal-watermark" aria-hidden="true">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.8" />
                      <path d="M50 15 L53 23 L62 23 L55 28 L57 36 L50 31 L43 36 L45 28 L38 23 L47 23 Z" fill="currentColor" opacity="0.6" />
                      <text x="50" y="52" textAnchor="middle" fontSize="6.5" fontFamily="Cinzel" fill="currentColor" letterSpacing="0.2em">CLAMOUR</text>
                      <text x="50" y="60" textAnchor="middle" fontSize="4.2" fontFamily="Inter" fill="currentColor" letterSpacing="0.15em">ADMIT ONE</text>
                      <text x="50" y="68" textAnchor="middle" fontSize="3.8" fontFamily="Inter" fill="currentColor" letterSpacing="0.1em">OCT 2026</text>
                    </svg>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <p className="admission-category-tag">
                        {ticket.category}
                      </p>
                      {isActive && (
                        <span className="live-allocation-pulse-badge">
                          <span className="pulse-dot" />
                          <Flame size={12} style={{ color: 'var(--color-gold-antique)' }} />
                          <span>{ticket.badgeLabel || 'AKTIF'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="admission-tier-title">
                      {ticket.name}
                    </h3>

                    <div className="admission-hairline-sep" />

                    <p className="admission-price-display">
                      Rp {ticket.price.toLocaleString('id-ID')}
                    </p>

                    <div className="admission-perks-list">
                      {ticket.perks.map((perk, i) => (
                        <div key={i} className="admission-perk-item">
                          <Check
                            size={14}
                            style={{
                              flexShrink: 0,
                              marginTop: '2px',
                              color: isSoldOut ? 'var(--color-dim)' : 'var(--color-gold-antique)'
                            }}
                          />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => onCheckout(ticket)}
                      className={`admission-action-btn btn-press ${isSoldOut ? 'is-disabled' : ''}`}
                    >
                      {isSoldOut ? 'HABIS TERJUAL' : 'AMBIL TIKET INI'}
                    </button>

                    <p className="admission-auth-guarantee">
                      <ShieldCheck size={11} style={{ color: 'var(--color-gold-antique)' }} />
                      <span>GELANG RFID RESMI</span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section: Panduan Pengunjung */}
        <section id="panduan" style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">PEDOMAN RESMI</span>
              <h2 className="streaming-section-title">3 ARAHAN UTAMA PENGUNJUNG</h2>
            </div>
            <span className="streaming-badge-box">WAJIB DIPATUHI</span>
          </div>

          <div className="streaming-rules-grid">
            <article className="streaming-rule-card">
              <span className="streaming-rule-index">ARAHAN // 01</span>
              <h3 className="streaming-rule-title">18+ WAJIB IDENTITAS FISIK</h3>
              <p className="streaming-rule-desc">
                Wajib membawa KTP / Paspor / SIM fisik asli untuk penukaran tiket ke gelang RFID di pintu utama. Foto di ponsel tidak dapat diproses.
              </p>
            </article>

            <article className="streaming-rule-card">
              <span className="streaming-rule-index">ARAHAN // 02</span>
              <h3 className="streaming-rule-title">TATA BUSANA SERBA GELAP</h3>
              <p className="streaming-rule-desc">
                Disarankan mengenakan busana bernuansa gelap atau serba hitam. Dilarang mengenakan sandal jepit dan jersey tim olahraga demi estetika ruangan.
              </p>
            </article>

            <article className="streaming-rule-card">
              <span className="streaming-rule-index">ARAHAN // 03</span>
              <h3 className="streaming-rule-title">100% NONTUNAI (RFID &amp; QRIS)</h3>
              <p className="streaming-rule-desc">
                Seluruh transaksi makanan, minuman, dan merchandise di dalam venue menggunakan saldo gelang RFID atau QRIS resmi.
              </p>
            </article>
          </div>
        </section>

        {/* More Like This Recommendation: Switch to Night II */}
        {onViewNight2 && (
          <section style={{ marginTop: '2rem' }}>
            <div className="streaming-more-like-this-card">
              <div className="streaming-recommend-poster">
                <img
                  src="/assets/gothic_cathedral_ritual_concert.png"
                  alt="Night 2 Gothic Ritual Concert"
                />
                <span className="streaming-recommend-badge">NEXT TRANSMISSION</span>
              </div>
              <div className="streaming-recommend-body">
                <span className="streaming-recommend-kicker">EKSPLORASI MALAM BERIKUTNYA</span>
                <h3 className="streaming-recommend-title">NIGHT II — [THE UNDER-VAULT]</h3>
                <p className="streaming-recommend-desc">
                  Lanjutkan petualangan sonik pada Sabtu, 31 Oktober 2026. Alami modular synthesizer analog 140 BPM, getaran frekuensi sub-bass 28Hz, dan bunker granit kedap suara bersama Headliner Rahasia Malam Kedua.
                </p>
                <div className="streaming-recommend-action-row">
                  <button
                    type="button"
                    onClick={onViewNight2}
                    className="streaming-pill-primary btn-press"
                  >
                    <span>LIHAT DETAIL NIGHT II</span>
                    <ChevronRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="streaming-pill-btn btn-press"
                  >
                    <ArrowLeft size={13} />
                    <span>KEMBALI KE BERANDA</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default NightOneEventPage;
