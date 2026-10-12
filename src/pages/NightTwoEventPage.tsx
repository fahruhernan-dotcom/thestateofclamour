import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShieldCheck,
  Volume2,
  Check,
  Lock,
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
  onViewNight1?: () => void;
  onToast?: (msg: string) => void;
}

export const NightTwoEventPage: React.FC<Props> = ({
  tickets,
  initialPackageId,
  onBack,
  onCheckout,
  onViewNight1,
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
            src="/assets/day2_billboard_vault.jpg"
            alt="The State of Clamour Night 2 The Under-Vault"
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
            <span className="streaming-title-line-1">NIGHT II</span>
            <span className="streaming-title-line-2">THE UNDER-VAULT</span>
          </h1>

          {/* Clean Metadata Line */}
          <div className="streaming-hero-meta">
            <span>31 OKTOBER 2026</span>
            <span className="streaming-meta-dot">·</span>
            <span>THE UNDER-VAULT</span>
            <span className="streaming-meta-pipe">|</span>
            <span>18+</span>
          </div>


          {/* Minimalist Action Row */}
          <div className="streaming-hero-actions">
            <button
              type="button"
              onClick={() => scrollToSection('tickets')}
              className="streaming-btn-primary is-night-2 btn-press"
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
            {onViewNight1 && (
              <button
                type="button"
                onClick={onViewNight1}
                className="streaming-night-tab is-switch"
                title="Beralih ke Dossier Malam I"
              >
                ← MALAM I · 30 OKT
              </button>
            )}
            <span className="streaming-night-tab is-active">MALAM II · 31 OKT</span>
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
        
        {/* Spotlight Showcase: Teaser Headliner Night II */}
        <section id="spotlight" style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle" style={{ color: '#eb5757' }}>HEADLINER MALAM KEDUA</span>
              <h2 className="streaming-section-title">PENAMPIL UTAMA // PHASE 01 TEASER</h2>
            </div>
            <span className="streaming-badge-box is-tba">DIUMUMKAN SEGERA</span>
          </div>

          <div
            className="streaming-spotlight-card"
            style={{
              borderColor: 'rgba(235, 87, 87, 0.35)'
            }}
          >
            {/* Visual Teaser with Mystery Aura */}
            <div className="streaming-spotlight-visual">
              <img
                src="/assets/day2_billboard_vault.jpg"
                alt="Headliner Rahasia Malam 2"
                className="streaming-spotlight-img"
              />
              <div className="streaming-spotlight-mystery-overlay">
                <div
                  className="streaming-mystery-icon"
                  style={{
                    borderColor: 'rgba(235, 87, 87, 0.5)',
                    color: '#eb5757',
                    background: 'rgba(235, 87, 87, 0.1)'
                  }}
                >
                  <Lock size={22} />
                </div>
                <div style={{ fontFamily: 'var(--font-monumental)', fontSize: '0.78rem', letterSpacing: '0.15em', color: '#ff7b7b' }}>
                  SECRET HEADLINER
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245, 242, 235, 0.65)' }}>
                  PENGUMUMAN SEGERA
                </div>
              </div>
              <div
                className="streaming-spotlight-badge"
                style={{
                  borderColor: 'rgba(235, 87, 87, 0.4)',
                  color: '#ff8888'
                }}
              >
                <Sparkles size={11} />
                <span>NIGHT II EXCLUSIVE</span>
              </div>
            </div>

            {/* Teaser Information */}
            <div className="streaming-spotlight-info">
              <span className="streaming-spotlight-sub" style={{ color: '#eb5757' }}>
                THE UNDER-VAULT ANALOG MODULAR EXPERIENCE
              </span>
              <h3 className="streaming-spotlight-title">SECRET HEADLINER (TBA)</h3>
              <p className="streaming-spotlight-desc">
                Produser internasional dan penjelajah modular analog terpilih yang akan mengambil alih ruang The Under-Vault selama 150 menit tanpa henti. Dentuman 140 BPM bertekanan akustik tinggi dalam bunker berperedam granit. Seluruh tiket resmi menjamin akses penuh saat pengumuman fase berikutnya dirilis.
              </p>

              <div className="streaming-spotlight-meta-grid">
                <div className="streaming-meta-block">
                  <Clock size={16} style={{ color: '#eb5757', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>WAKTU SHOW</strong>
                    <p>23:00 — 01:30 WIB (150 Menit)</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <MapPin size={16} style={{ color: 'var(--color-crimson)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>LOKASI PANGGUNG</strong>
                    <p>The Under-Vault Bunker (Basement Lt. -1)</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <Volume2 size={16} style={{ color: '#eb5757', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>TATA SUARA</strong>
                    <p>28Hz Sub-Bass High Pressure Array</p>
                  </div>
                </div>
                <div className="streaming-meta-block">
                  <ShieldCheck size={16} style={{ color: '#eb5757', flexShrink: 0, marginTop: '2px' }} />
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
              <span className="streaming-section-subtitle" style={{ color: '#eb5757' }}>SUSUNAN ACARA HARIAN</span>
              <h2 className="streaming-section-title">RUNDOWN // MALAM II (31 OKT 2026)</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(245, 242, 235, 0.6)' }}>
              Total Durasi: 7 Jam
            </span>
          </div>

          <div className="streaming-episodes-grid">
            {/* Act 01 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day2_billboard_vault.jpg" alt="Under-Vault Door Open" />
                <span className="streaming-episode-num-badge">01</span>
                <span className="streaming-episode-duration">90 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Under-Vault Gate Open &amp; Drone Soundscape</h3>
                  <span className="streaming-episode-stage-pill" style={{ borderColor: 'rgba(235, 87, 87, 0.3)', color: '#ff8888' }}>
                    20:00 — 21:30 WIB
                  </span>
                </div>
                <p className="streaming-episode-desc">
                  Penukaran gelang RFID di gerbang bunker, penyesuaian akustik ruang bawah tanah, dan paparan drone frekuensi rendah pengantar.
                </p>
              </div>
            </article>

            {/* Act 02 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day2_billboard_vault.jpg" alt="Modular Warm-up" />
                <span className="streaming-episode-num-badge">02</span>
                <span className="streaming-episode-duration">90 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Resident Modular Architect Warm-Up</h3>
                  <span className="streaming-episode-stage-pill" style={{ borderColor: 'rgba(235, 87, 87, 0.3)', color: '#ff8888' }}>
                    21:30 — 23:00 WIB
                  </span>
                </div>
                <p className="streaming-episode-desc">
                  Membangun ketegangan ritmik analog 132 BPM menuju atmosfer hipnotis ruang bawah tanah dengan modulasi synthesizer langsung.
                </p>
              </div>
            </article>

            {/* Act 03: Headliner Main Event */}
            <article className="streaming-episode-card is-headliner-red">
              <div className="streaming-episode-thumb">
                <img src="/assets/day2_billboard_vault.jpg" alt="Headliner Vault Takeover" />
                <span className="streaming-episode-num-badge" style={{ background: '#eb5757', color: '#fff' }}>
                  ★ 03
                </span>
                <span className="streaming-episode-duration">150 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title" style={{ color: '#ff8888' }}>
                    ★ SECRET HEADLINER (TBA) — Vault Takeover
                  </h3>
                  <span className="streaming-episode-stage-pill" style={{ borderColor: '#eb5757', color: '#ff8888' }}>
                    23:00 — 01:30 WIB
                  </span>
                </div>
                <p className="streaming-episode-desc">
                  Sesi live modular 140 BPM bertekanan akustik tinggi di panggung monolitik. Gelombang sub-bass 28Hz yang mengguncang dinding granit bunker.
                </p>
              </div>
            </article>

            {/* Act 04 */}
            <article className="streaming-episode-card">
              <div className="streaming-episode-thumb">
                <img src="/assets/day2_billboard_vault.jpg" alt="Subterranean Overdrive Closing" />
                <span className="streaming-episode-num-badge">04</span>
                <span className="streaming-episode-duration">90 MIN</span>
              </div>
              <div className="streaming-episode-details">
                <div className="streaming-episode-top-row">
                  <h3 className="streaming-episode-title">Subterranean Overdrive &amp; B2B Aftermath</h3>
                  <span className="streaming-episode-stage-pill" style={{ borderColor: 'rgba(235, 87, 87, 0.3)', color: '#ff8888' }}>
                    01:30 — 03:00 WIB
                  </span>
                </div>
                <p className="streaming-episode-desc">
                  Penutupan ritual bunker dengan gelombang analog mendalam hingga pintu kedap suara The Under-Vault disegel kembali.
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
              <h2 className="streaming-section-title">DENAH VENUE // THE UNDER-VAULT BUNKER</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#c5a059' }}>
              Pilih sofa / meja VIP untuk reservasi
            </span>
          </div>

          <EventVenueMapSection
            onSelectZoneForReservation={handleSelectZoneForReservation}
            dayBadge="NIGHT II // THE UNDER-VAULT"
          />
        </section>

        {/* Section: Reservasi Meja VIP Malam 2 */}
        <section id="reservasi" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">LAYANAN SOFA &amp; MEJA VIP</span>
              <h2 className="streaming-section-title">RESERVASI VIP // MALAM II (31 OKT)</h2>
            </div>
            <span className="streaming-badge-box">TERMASUK AKSES TIKET VIP</span>
          </div>

          <EventReservationSection
            day="day-2"
            initialPackageId={selectedPackageId}
            onToast={onToast || (() => {})}
          />
        </section>

        {/* Section: Pilihan Tiket Masuk */}
        <section id="tickets" style={{ marginBottom: '4.5rem', scrollMarginTop: '80px' }}>
          <div className="streaming-section-header">
            <div>
              <span className="streaming-section-subtitle">AKSES TIKET RESMI</span>
              <h2 className="streaming-section-title">TIKET MASUK // NIGHT II &amp; FULL PASS</h2>
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

        {/* More Like This Recommendation: Switch to Night I */}
        {onViewNight1 && (
          <section style={{ marginTop: '2rem' }}>
            <div className="streaming-more-like-this-card">
              <div className="streaming-recommend-poster">
                <img
                  src="/assets/day1_billboard_assembly.jpg"
                  alt="Night 1 Swear In Continental"
                />
                <span className="streaming-recommend-badge" style={{ color: '#d4af37' }}>
                  PARALLEL TRANSMISSION
                </span>
              </div>
              <div className="streaming-recommend-body">
                <span className="streaming-recommend-kicker">EKSPLORASI MALAM PERTAMA</span>
                <h3 className="streaming-recommend-title">NIGHT I — [SWEAR IN CONTINENTAL]</h3>
                <p className="streaming-recommend-desc">
                  Rasakan kemegahan malam pembuka pada Jumat, 30 Oktober 2026. Alami live brass ensemble berkekuatan tinggi, hip-hop kontinental, dan atmosfer katedral 14 meter bersama Headliner Rahasia Malam Pertama.
                </p>
                <div className="streaming-recommend-action-row">
                  <button
                    type="button"
                    onClick={onViewNight1}
                    className="streaming-pill-primary btn-press"
                  >
                    <ArrowLeft size={14} />
                    <span>LIHAT DETAIL NIGHT I</span>
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="streaming-pill-btn btn-press"
                  >
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

export default NightTwoEventPage;
