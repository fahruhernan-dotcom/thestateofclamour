import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Ticket,
  MapPin,
  Clock,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  AlertTriangle,
  Users
} from 'lucide-react';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../data/reservationData';
import '../styles/faq.css';

interface FAQItem {
  id: string;
  indexNumber: string;
  tag: string;
  icon: React.ReactNode;
  question: string;
  answer: React.ReactNode;
}

export const OfficialFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {
      // Fallback
    });
  };

  const faqData: FAQItem[] = [
    {
      id: 'faq-1',
      indexNumber: '01',
      tag: 'COMPLIMENTARY ACCESS',
      icon: <Ticket size={18} />,
      question: 'Booking Fee & Kuota Tiket Komplementer',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.85rem' }}>
            <strong>Booking Fee</strong> bertujuan untuk mengunci kepemilikan sofa / meja RSVP pilihan Anda di denah venue. Setelah pembayaran Booking Fee diverifikasi oleh admin resmi, Anda berhak mendapatkan <strong>tiket komplementer (Complimentary Tickets)</strong> sesuai kuota kapasitas meja:
          </p>
          <div className="faq-quota-grid">
            <div className="faq-quota-card">
              <span className="faq-quota-pax">Kapasitas 4 PAX</span>
              <span className="faq-quota-tier">Table / Small Table</span>
              <div className="faq-quota-badge">
                <Ticket size={13} />
                <span>2 Complimentary Tickets</span>
              </div>
            </div>
            <div className="faq-quota-card">
              <span className="faq-quota-pax">Kapasitas 6 PAX</span>
              <span className="faq-quota-tier">VIP / Mezzanine / Sofa</span>
              <div className="faq-quota-badge">
                <Ticket size={13} />
                <span>3 Complimentary Tickets</span>
              </div>
            </div>
            <div className="faq-quota-card">
              <span className="faq-quota-pax">Kapasitas 8 PAX</span>
              <span className="faq-quota-tier">VVIP Royal Center</span>
              <div className="faq-quota-badge">
                <Ticket size={13} />
                <span>4 Complimentary Tickets</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#8e8b82', marginTop: '0.65rem' }}>
            * Tiket komplementer dapat langsung ditukarkan dengan wristband resmi di fast-track VIP access pada hari acara.
          </p>
        </div>
      )
    },
    {
      id: 'faq-2',
      indexNumber: '02',
      tag: 'STRICT PROTOCOL',
      icon: <ShieldCheck size={18} />,
      question: 'Kebijakan Pengembalian Dana (Refund Policy)',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.5rem' }}>
            Seluruh transaksi <strong>Booking Fee bersifat Non-Refundable (tidak dapat dikembalikan atau dibatalkan)</strong> dalam kondisi apapun.
          </p>
          <div className="faq-callout-box">
            <AlertTriangle size={18} className="faq-callout-icon" />
            <div>
              <div className="faq-callout-title">Ketentuan Penguncian Eksklusif</div>
              <p style={{ fontSize: '0.82rem', color: '#c4c0b6', margin: 0, lineHeight: 1.55 }}>
                Setelah nomor meja Anda terverifikasi, sistem dan admin segera mengunci spot tersebut dari seluruh antrean publik tamu lain guna menjamin ketersediaan kursi Anda saat tiba di lokasi.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-3',
      indexNumber: '03',
      tag: 'ALL-ACCESS PRIVILEGE',
      icon: <MapPin size={18} />,
      question: 'Akses Kawasan Venue (Tetra Solo & Mizu Commonroom)',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.75rem' }}>
            Seluruh pemegang reservasi VIP Table / Sofa dan tiket resmi The State of Clamour mendapatkan <strong>akses penuh tanpa batas</strong> ke seluruh area dua venue ikonik:
          </p>
          <div className="faq-venues-grid">
            <div className="faq-venue-card">
              <span className="faq-venue-name">TETRA SOLO</span>
              <span className="faq-venue-desc">
                Area panggung monumental, panggung utama, line-array 360 acoustic sound, area pit energik, dan floor festival.
              </span>
            </div>
            <div className="faq-venue-card">
              <span className="faq-venue-name">MIZU COMMONROOM</span>
              <span className="faq-venue-desc">
                Sanctuari VIP &amp; VVIP Mezzanine bertingkat, private bar, lounge eksklusif, dan akses elevated stage view.
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-4',
      indexNumber: '04',
      tag: 'F&B MINIMUM SPEND',
      icon: <Sparkles size={18} />,
      question: 'Ketentuan Minimum Charge (Min. Spend)',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.65rem' }}>
            <strong>Booking Fee TIDAK memotong atau mengurangi nilai minimum charge</strong> yang tertera pada paket meja, meskipun complimentary tickets telah termasuk di dalamnya.
          </p>
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.025)', borderRadius: '8px', border: '1px solid rgba(197, 168, 105, 0.18)' }}>
            <span style={{ fontSize: '0.82rem', color: '#e6e2d8', display: 'block', lineHeight: 1.6 }}>
              Para tamu tetap diwajibkan untuk memenuhi <em>minimum charge</em> yang ditentukan dengan memesan makanan, botol minuman, dan racikan cocktail langsung di meja Anda saat acara berlangsung.
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'faq-5',
      indexNumber: '05',
      tag: 'VIP HOSPITALITY',
      icon: <Users size={18} />,
      question: 'Jaminan Layanan & Dedicated Butler Service',
      answer: (
        <p style={{ margin: '0.25rem 0' }}>
          Tamu RSVP terverifikasi akan mendapatkan layanan prioritas sejak kedatangan: pengawalan langsung oleh tim hospitality ke sofa nomor Anda, personal table butler, serta prioritas pesanan botol tanpa perlu mengantre di kasir bar utama.
        </p>
      )
    },
    {
      id: 'faq-6',
      indexNumber: '06',
      tag: 'GATE TIMELINE',
      icon: <Clock size={18} />,
      question: 'Jadwal & Jalur Penukaran Tiket Fisik / Wristband',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.75rem' }}>
            Penukaran e-voucher / tiket resmi menjadi wristband fisik tersedia dengan jadwal berikut:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-gold-antique)', fontWeight: 700 }}>[H-1 ACARA]</span>
              <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Early wristband pickup di venue (lokasi &amp; jam diumumkan via Instagram resmi).</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-gold-antique)', fontWeight: 700 }}>[HARI H]</span>
              <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Loket VIP Fast-Track dibuka mulai <strong>pukul 20.00 WIB</strong> di gerbang utama venue.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-7',
      indexNumber: '07',
      tag: 'OFFICIAL ACCOUNTS',
      icon: <CreditCard size={18} />,
      question: 'Rekening Pembayaran Resmi BCA & Kontak WhatsApp',
      answer: (
        <div>
          <p style={{ margin: '0.25rem 0 0.85rem' }}>
            Untuk keamanan dan mencegah penipuan oleh pihak tidak berwenang, seluruh pembayaran reservasi hanya sah jika ditransfer ke rekening bank resmi berikut:
          </p>

          <div className="faq-bank-grid">
            {/* Card 1: Booking Fee */}
            <div className="faq-bank-card-premium">
              <div className="faq-bank-header">
                <span className="faq-bank-type-pill">Transfer Booking Fee</span>
                <span className="faq-bank-verified">
                  <ShieldCheck size={12} /> Terverifikasi
                </span>
              </div>
              <div className="faq-bank-number-row">
                <span className="faq-bank-number">0374541630</span>
                <button
                  type="button"
                  className={`faq-bank-copy-btn ${copiedKey === 'bf' ? 'is-copied' : ''}`}
                  onClick={() => copyToClipboard('0374541630', 'bf')}
                  title="Salin Nomor Rekening"
                >
                  {copiedKey === 'bf' ? (
                    <>
                      <Check size={12} /> TERSALIN
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> SALIN
                    </>
                  )}
                </button>
              </div>
              <span className="faq-bank-owner">Bank BCA · a/n M. Ferdian Wahyu</span>
            </div>

            {/* Card 2: Down Payment */}
            <div className="faq-bank-card-premium">
              <div className="faq-bank-header">
                <span className="faq-bank-type-pill">Transfer Down Payment</span>
                <span className="faq-bank-verified">
                  <ShieldCheck size={12} /> Terverifikasi
                </span>
              </div>
              <div className="faq-bank-number-row">
                <span className="faq-bank-number">0373791196</span>
                <button
                  type="button"
                  className={`faq-bank-copy-btn ${copiedKey === 'dp' ? 'is-copied' : ''}`}
                  onClick={() => copyToClipboard('0373791196', 'dp')}
                  title="Salin Nomor Rekening"
                >
                  {copiedKey === 'dp' ? (
                    <>
                      <Check size={12} /> TERSALIN
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> SALIN
                    </>
                  )}
                </button>
              </div>
              <span className="faq-bank-owner">Bank BCA · a/n Bagus Dwi Setyawan</span>
            </div>
          </div>

          {/* Admin Contacts */}
          <div className="faq-contact-bar">
            <span style={{ fontSize: '0.8rem', color: '#a6a4a0' }}>
              Konfirmasi Bukti Transfer ke Admin Resmi:
            </span>
            <div className="faq-contact-links">
              <a
                href={`https://wa.me/${ADMIN_DAY1.phone}?text=${encodeURIComponent('Halo Admin Day 1, saya ingin konfirmasi pembayaran reservasi The State of Clamour.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-contact-btn"
              >
                <MessageSquare size={13} />
                <span>Admin Day 1 ({ADMIN_DAY1.displayPhone})</span>
              </a>
              <a
                href={`https://wa.me/${ADMIN_DAY2.phone}?text=${encodeURIComponent('Halo Admin Day 2, saya ingin konfirmasi pembayaran reservasi The State of Clamour.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-contact-btn"
              >
                <MessageSquare size={13} />
                <span>Admin Day 2 ({ADMIN_DAY2.displayPhone})</span>
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="official-faq-section" id="faq-section">
      <div className="faq-header">
        <div className="faq-eyebrow">
          <HelpCircle size={13} />
          <span>CONCIERGE &amp; RESERVATION FAQ</span>
        </div>
        <h2 className="faq-title">
          PANDUAN &amp; KETENTUAN RESERVASI
        </h2>
        <p className="faq-desc">
          Informasi resmi perihal penguncian meja VIP, tiket komplementer, kebijakan minimum charge, dan rekening transfer The State of Clamour.
        </p>
      </div>

      <div className="faq-accordion-list">
        {faqData.map(item => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="faq-trigger-btn"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <div className="faq-trigger-left">
                  <span className="faq-index-badge">{item.indexNumber}</span>
                  <div className="faq-icon-box">
                    {item.icon}
                  </div>
                  <div className="faq-question-lockup">
                    <span className="faq-question-tag">{item.tag}</span>
                    <span className="faq-question-text">
                      {item.question}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={19}
                  className={`faq-chevron ${isOpen ? 'is-open' : ''}`}
                />
              </button>

              <div className={`faq-content-grid ${isOpen ? 'is-open' : ''}`}>
                <div className="faq-content-overflow">
                  <div className="faq-content-body">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OfficialFAQSection;
