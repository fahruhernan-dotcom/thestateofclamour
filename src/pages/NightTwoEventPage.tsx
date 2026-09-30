import React from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  CheckCircle2,
  Check,
  Flame,
  Shield,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { Artist, TicketTier } from '../types';

interface Props {
  artists: Artist[];
  tickets: TicketTier[];
  onBack: () => void;
  onCheckout: (ticket: TicketTier) => void;
  onViewNight1?: () => void;
}

export const NightTwoEventPage: React.FC<Props> = ({
  artists,
  tickets,
  onBack,
  onCheckout,
  onViewNight1,
}) => {
  const elena = artists.find(a => a.id === 'art-elena') || artists[1] || artists[0];

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
      <nav className="dossier-top-bar" aria-label="Navigasi event malam dua">
        <button
          type="button"
          onClick={onBack}
          className="dossier-back-btn btn-press"
        >
          <ArrowLeft size={16} />
          <span>KEMBALI KE BERANDA</span>
        </button>

        <div className="dossier-doc-stamp">
          <span>EVENT BRIEF // NIGHT II</span>
        </div>

        {onViewNight1 && (
          <button
            type="button"
            onClick={onViewNight1}
            className="dossier-ticket-quick-btn btn-press"
          >
            <span>← NIGHT I</span>
          </button>
        )}
      </nav>

      {/* Hero Header Event Night II */}
      <header className="dossier-hero-header">
        <div className="section-eyebrow">
          <span>SABTU, 31 OKTOBER 2026 // NIGHT II</span>
        </div>
        <h1 className="dossier-main-headline text-gold-metallic">
          NIGHT II — ELENA VEX
        </h1>
        <p className="dossier-subheadline">
          Perjalanan sonik modular hardware techno dan frekuensi sub-bass di bunker The Under-Vault.
        </p>

        {/* Technical Ledger Key Specs */}
        <div className="dossier-specs-strip">
          <div className="spec-metric-block">
            <span className="spec-metric-label">TANGGAL</span>
            <span className="spec-metric-val">31 OKT 2026</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">HEADLINER</span>
            <span className="spec-metric-val">{elena ? elena.name : 'ELENA VEX'}</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">PANGGUNG</span>
            <span className="spec-metric-val">THE UNDER-VAULT</span>
          </div>
          <div className="spec-metric-block">
            <span className="spec-metric-label">WAKTU</span>
            <span className="spec-metric-val">GERBANG 21:00 // SHOW 00:00</span>
          </div>
        </div>
      </header>

      {/* Main Single Event Body Container */}
      <div className="dossier-body-container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        
        {/* Spotlight Showcase: Elena Vex & The Under-Vault */}
        <section className="night-spotlight-section" style={{ marginBottom: '3rem' }}>
          <div className="night-spotlight-card">
            <div className="night-spotlight-visual">
              <img
                src={elena?.imageUrl || '/assets/guest_elena.jpg'}
                alt="Elena Vex Live"
                className="night-spotlight-img"
              />
              <div className="night-spotlight-badge">
                <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>HEADLINER MALAM II</span>
              </div>
            </div>

            <div className="night-spotlight-info">
              <div className="night-tag-strip">
                <span className="night-tag">DAY 2</span>
                <span className="night-tag">NOCTURNAL STAGE</span>
                <span className="night-tag">MODULAR TECHNO</span>
              </div>

              <h2 className="night-performer-title">{elena?.name || 'Elena Vex'}</h2>
              <p className="night-performer-sub">Subterranean Modular Techno Odyssey</p>

              <p className="night-performer-bio">
                Set modular synthesizer analog real-time 140 BPM di bunker bawah tanah kedap suara berlantai beton dan dinding granit.
              </p>

              <div className="night-performer-meta-grid">
                <div className="night-meta-item">
                  <Clock size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>WAKTU SHOW</strong>
                    <p>00:00 — 02:30 WIB (150 Menit)</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <MapPin size={16} style={{ color: 'var(--color-crimson)' }} />
                  <div>
                    <strong>LOKASI</strong>
                    <p>The Under-Vault (Bunker)</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <Volume2 size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>SUB-BASS ARRAY</strong>
                    <p>Quad 21-inch Subwoofer</p>
                  </div>
                </div>
                <div className="night-meta-item">
                  <EyeOff size={16} style={{ color: 'var(--color-gold-antique)' }} />
                  <div>
                    <strong>ATURAN VISUAL</strong>
                    <p>Dilarang Flash Kamera</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Rundown Jam Demi Jam Malam 2 (Crisp & Scannable) */}
        <section className="night-rundown-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>SUSUNAN ACARA</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              RUNDOWN // MALAM II (31 OKT 2026)
            </h2>
          </div>

          <div className="timetable-timeline-list">
            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">21:00</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">OPEN GATES & RFID REGISTRATION</h3>
                  <span className="timeline-stage-tag">GATEWAY UTAMA</span>
                </div>
                <p className="timeline-act-desc">
                  Penukaran tiket digital ke gelang RFID dan verifikasi kartu identitas fisik di loket.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">22:00</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">SUB-BASS CALIBRATION & AMBIENT</h3>
                  <span className="timeline-stage-tag">THE UNDER-VAULT</span>
                </div>
                <p className="timeline-act-desc">
                  Pembukaan bunker bawah tanah The Under-Vault dan kalibrasi resonansi sub-bass 25Hz.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row is-headline-entry">
              <div className="timeline-time-col">
                <span className="timeline-hour">00:00</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title text-gold-metallic">
                    ELENA VEX — LIVE MODULAR TECHNO
                  </h3>
                  <span className="timeline-stage-tag is-headliner-badge">HEADLINE SET</span>
                </div>
                <p className="timeline-act-desc">
                  Headline live set 150 menit tanpa henti dari instrumen modular synthesizer analog fisik.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">02:30</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">SUB-BASS DESCENT & WIND-DOWN</h3>
                  <span className="timeline-stage-tag">THE UNDER-VAULT</span>
                </div>
                <p className="timeline-act-desc">
                  Soundscape penutup frekuensi rendah dan transisi hadirin ke koridor keluar.
                </p>
              </div>
            </div>

            <div className="timeline-entry-row">
              <div className="timeline-time-col">
                <span className="timeline-hour">03:00</span>
                <span className="timeline-meridiem">WIB</span>
              </div>
              <div className="timeline-content-col">
                <div className="timeline-content-top">
                  <h3 className="timeline-act-title">CURFEW & PINTU RESMI DIKUNCI</h3>
                  <span className="timeline-stage-tag">GERBANG UTAMA</span>
                </div>
                <p className="timeline-act-desc">
                  Seluruh rangkaian The State of Clamour 2026 selesai. Pintu gerbang dikunci penuh.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Spesifikasi Bunker The Under-Vault (Simple & Clean) */}
        <section className="night-venue-specs-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>DENAH PANGGUNG</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              THE UNDER-VAULT // SPESIFIKASI BUNKER
            </h2>
          </div>

          <div className="sanctuary-detail-grid">
            <div className="sanctuary-card">
              <h3 className="sanctuary-title">LANTAI DANSA SUBTERRANEAN</h3>
              <p className="sanctuary-desc">
                Ruang bunker beton kedap suara seluas 600m² di kedalaman 6 meter bawah tanah.
              </p>
              <div className="sanctuary-specs-list">
                <div className="sanctuary-spec-row">
                  <span>Kapasitas:</span>
                  <strong>1.000 Hadirin</strong>
                </div>
                <div className="sanctuary-spec-row">
                  <span>Pencahayaan:</span>
                  <strong>Monokromatik & Strobo Halus</strong>
                </div>
              </div>
            </div>

            <div className="sanctuary-card">
              <h3 className="sanctuary-title">STASIUN HIDRASI & MEDIS</h3>
              <p className="sanctuary-desc">
                Fasilitas pendukung keselamatan penikmat musik techno berkecepatan tinggi.
              </p>
              <div className="sanctuary-specs-list">
                <div className="sanctuary-spec-row">
                  <span>Air Mineral:</span>
                  <strong>Gratis Sepanjang Malam</strong>
                </div>
                <div className="sanctuary-spec-row">
                  <span>Pos Medis:</span>
                  <strong>Siaga 24 Jam di Pintu Bunker</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Tiket Tersedia untuk Malam 2 */}
        <section className="night-tickets-section" style={{ marginBottom: '3rem' }}>
          <div className="dossier-sub-header">
            <div className="section-eyebrow">
              <span>AKSES MASUK RESMI</span>
            </div>
            <h2 className="dossier-sub-title text-gold-metallic">
              TIKET MASUK // NIGHT II & 2-NIGHT PASS
            </h2>
            <p className="dossier-sub-desc">
              Pilih tiket akses untuk pertunjukan Elena Vex di Malam 2. Transaksi resmi via Artatix.
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

        {/* Section: Arahan & Tata Tertib Malam 2 (Crisp & Simple) */}
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
                <EyeOff size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">DILARANG FLASH KAMERA</h3>
              <p className="pillar-desc">
                Dilarang menggunakan lampu flash handphone di area dance floor The Under-Vault.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Pencahayaan Redup</span>
              </div>
            </article>

            <article className="dossier-pillar-card">
              <div className="pillar-index-tag">ARAHAN // 02</div>
              <div className="pillar-icon-wrap">
                <Shield size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">ALAS KAKI TERTUTUP</h3>
              <p className="pillar-desc">
                Wajib mengenakan sepatu tertutup (sneakers/boots). Dilarang sandal jepit dan selop.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Keamanan Lantai Dansa</span>
              </div>
            </article>

            <article className="dossier-pillar-card">
              <div className="pillar-index-tag">ARAHAN // 03</div>
              <div className="pillar-icon-wrap">
                <Sparkles size={20} style={{ color: 'var(--color-gold-antique)' }} />
              </div>
              <h3 className="pillar-title">RUANG AMAN (SAFE SPACE)</h3>
              <p className="pillar-desc">
                Toleransi nol terhadap pelecehan atau agresi. Petugas keamanan siap membantu 24 jam.
              </p>
              <div className="pillar-footer-spec">
                <CheckCircle2 size={13} style={{ color: 'var(--color-gold-antique)' }} />
                <span>Petugas Siaga</span>
              </div>
            </article>
          </div>
        </section>

      </div>
    </main>
  );
};

export default NightTwoEventPage;
