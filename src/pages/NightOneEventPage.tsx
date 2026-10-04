import React from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShieldCheck,
  Shield,
  Sparkles,
  Volume2,
  CheckCircle2,
  Check,
  Flame,
  FileText
} from 'lucide-react';
import { Artist, TicketTier } from '../types';

interface Props {
  artists: Artist[];
  tickets: TicketTier[];
  onBack: () => void;
  onCheckout: (ticket: TicketTier) => void;
  onViewNight2?: () => void;
}

export const NightOneEventPage: React.FC<Props> = ({
  artists,
  tickets,
  onBack,
  onCheckout,
  onViewNight2,
}) => {
  const basboi = artists.find(a => a.id === 'art-basboi') || artists[0];

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const y = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    card.style.setProperty('--foil-x', x);
    card.style.setProperty('--foil-y', y);
  };

  return (
    <main className="event-dossier-page event-single-night-page">
      {/* Top Bar Navigation */}
      <nav className="dossier-top-bar" aria-label="Navigasi event malam satu">
        <button
          type="button"
          onClick={onBack}
          className="dossier-back-btn btn-press"
        >
          <ArrowLeft size={16} />
          <span>KEMBALI KE BERANDA</span>
        </button>

        <div className="dossier-doc-stamp">
          <span>EVENT BRIEF // NIGHT I</span>
        </div>

        {onViewNight2 && (
          <button
            type="button"
            onClick={onViewNight2}
            className="dossier-ticket-quick-btn btn-press"
          >
            <span>NIGHT II →</span>
          </button>
        )}
      </nav>

      {/* Hero Header Event Night I */}
      <header className="dossier-hero-header">
        <div className="section-eyebrow">
          <span>JUMAT, 30 OKTOBER 2026 // NIGHT I</span>
        </div>
        <h1 className="dossier-main-headline text-gold-metallic">
          NIGHT I — BASBOI
        </h1>
        <p className="dossier-subheadline">
          Konser live panggung utama hip-hop sinematik dan brass akustik di Main Assembly Hall.
        </p>

        {/* Technical Ledger Key Specs */}
        <div className="dossier-specs-strip">
          <div className="spec-metric-block">
            <span className="spec-metric-label">TANGGAL</span>
            <span className="spec-metric-val">30 OKT 2026</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">HEADLINER</span>
            <span className="spec-metric-val">{basboi ? basboi.name : 'BASBOI'}</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">PANGGUNG</span>
            <span className="spec-metric-val">MAIN ASSEMBLY</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">WAKTU</span>
            <span className="spec-metric-val">GERBANG 20:00 // SHOW 22:30</span>
          </div>
        </div>
      </header>

      {/* Main Single Event Body Container */}
      <div className="dossier-body-container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        
        {/* Spotlight Showcase: Basboi & Main Stage */}
        <section className="night-spotlight-section" style={{ marginBottom: '3rem' }}>
          <div className="night-spotlight-card">
            <div className="night-spotlight-visual">
              <img
                src={basboi?.imageUrl || '/assets/guest_basboi.jpg'}
                alt="Basboi Live"
                className="night-spotlight-img"
              />
              <div className="night-spotlight-badge">
                <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>HEADLINER MALAM I</span>
              </div>
            </div>

            <div className="night-spotlight-info">
              <div className="night-tag-strip">
                <span className="night-tag">DAY 1</span>
                <span className="night-tag">MAIN STAGE</span>
                <span className="night-tag">LIVE BRASS & BAND</span>
              </div>

              <h2 className="night-performer-title">{basboi?.name || 'Basboi'}</h2>
              <p className="night-performer-sub">Swear In Continental Live Concert</p>

              <p className="night-performer-bio">
                Eksplorasi hip-hop kontinental dengan live brass section dan aransemen panggung 360° berkekuatan tinggi di aula monumental setinggi 14 meter.
              </p>

              <div className="night-performer-meta-grid">
                <div className="night-meta-item">
                  <Clock size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>WAKTU SHOW</strong>
                    <p>22:30 — 00:30 WIB (120 Menit)</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <MapPin size={16} style={{ color: 'var(--color-crimson)' }} />
                  <div>
                    <strong>LOKASI</strong>
                    <p>Main Assembly Hall (Lt. 1)</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <Volume2 size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>TATA SUARA</strong>
                    <p>118dB Line-Array Stereo</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <ShieldCheck size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>BATAS USIA</strong>
                    <p>18+ (Wajib KTP Asli)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Rundown Jam Demi Jam Malam 1 (Crisp & Scannable) */}
        <section className="night-rundown-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>SUSUNAN ACARA</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              RUNDOWN // MALAM I (30 OKT 2026)
            </h2>
          </div>

          <div className="timetable-timeline-list">
            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">20:00</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">OPEN GATES & RFID REGISTRATION</h3>
                  <span className="timeline-stage-tag">GATEWAY UTAMA</span>
                </div>
                <p className="timeline-act-desc">
                  Penukaran tiket digital ke gelang fisik RFID dan verifikasi KTP di loket utama.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">21:45</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">WARM-UP ATMOSPHERE & AMBIENT</h3>
                  <span className="timeline-stage-tag">MAIN ASSEMBLY</span>
                </div>
                <p className="timeline-act-desc">
                  Pencahayaan atmosferik oxblood dan soundscape ambient pembuka malam.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row is-headline-entry">
              <div className="timeline-time-col">
                <span className="timeline-hour">22:30</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title text-gold-metallic">
                    BASBOI — LIVE HEADLINE CONCERT
                  </h3>
                  <span className="timeline-stage-tag is-headliner-badge">KONSER UTAMA</span>
                </div>
                <p className="timeline-act-desc">
                  Konser live album penuh selama 120 menit dengan format live band, brass section, dan tata cahaya sinematik.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">00:30</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">AFTER-HOURS LOUNGE & WIND-DOWN</h3>
                  <span className="timeline-stage-tag">MEZZANINE LOUNGE</span>
                </div>
                <p className="timeline-act-desc">
                  Penutupan panggung konser utama dan transisi hadirin ke area lounge santai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Spesifikasi Panggung & Tata Ruang (Simple & Clean) */}
        <section className="night-venue-specs-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>DENAH PANGGUNG</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              MAIN ASSEMBLY HALL // SPESIFIKASI RUANG
            </h2>
          </div>

          <div className="sanctuary-detail-grid">
            <div className="sanctuary-card">
              <h3 className="sanctuary-title">LANTAI DANSA UTAMA</h3>
              <p className="sanctuary-desc">
                Lantai dansa batu alami seluas 850m² dengan ventilasi vertikal terpadu.
              </p>
              <div className="sanctuary-specs-list">
                <div className="sanctuary-spec-row">
                  <span>Kapasitas:</span>
                  <strong>1.800 Hadirin</strong>
                </div>
                <div className="sanctuary-spec-row">
                  <span>Suhu Ruang:</span>
                  <strong>20°C Konstan</strong>
                </div>
              </div>
            </div>

            <div className="sanctuary-card">
              <h3 className="sanctuary-title">VIP MEZZANINE BALCONY</h3>
              <p className="sanctuary-desc">
                Balkon bertingkat setinggi 4 meter dengan sudut pandang langsung ke panggung utama.
              </p>
              <div className="sanctuary-specs-list">
                <div className="sanctuary-spec-row">
                  <span>Akses:</span>
                  <strong>Gelang VIP Mezzanine</strong>
                </div>
                <div className="sanctuary-spec-row">
                  <span>Fasilitas:</span>
                  <strong>Meja Reservasi & Bar Khusus</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Tiket Tersedia untuk Malam 1 */}
        <section className="night-tickets-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>AKSES MASUK RESMI</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              TIKET MASUK // NIGHT I & FULL PASS
            </h2>
            <p className="dossier-sub-desc">
              Pilih tiket akses untuk konser Basboi di Malam 1. Transaksi resmi via Artatix.
            </p>
          </div>

          <div className="passage-matrix-grid">
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

        {/* Section: Arahan & Tata Tertib Malam 1 (Crisp & Simple) */}
        <section className="night-rules-section">
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>PANDUAN MASUK</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              3 ARAHAN UTAMA PENGUNJUNG
            </h2>
          </div>

          <div className="dossier-pillars-grid">
            <article className="dossier-pillar-card">
              <div className="pillar-index-tag">ARAHAN // 01</div>
              <div className="pillar-icon-wrap">
                <Shield size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">18+ WAJIB IDENTITAS FISIK</h3>
              <p className="pillar-desc">
                Wajib membawa KTP / Paspor / SIM fisik asli untuk penukaran gelang RFID di loket.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Verifikasi Loket</span>
              </div>
            </article>

            <article className="dossier-pillar-card">
              <div className="pillar-index-tag">ARAHAN // 02</div>
              <div className="pillar-icon-wrap">
                <Sparkles size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">TATA BUSANA SERBA HITAM</h3>
              <p className="pillar-desc">
                Disarankan busana serba gelap. Dilarang sandal jepit dan jersey olahraga.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Alas Kaki Tertutup</span>
              </div>
            </article>

            <article className="dossier-pillar-card">
              <div className="pillar-index-tag">ARAHAN // 03</div>
              <div className="pillar-icon-wrap">
                <FileText size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">100% NONTUNAI (RFID & QRIS)</h3>
              <p className="pillar-desc">
                Semua transaksi di venue menggunakan gelang RFID atau QRIS resmi.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Bebas Uang Tunai</span>
              </div>
            </article>
          </div>
        </section>

      </div>
    </main>
  );
};

export default NightOneEventPage;
