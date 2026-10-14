import React, { useState } from 'react';
import {
  ChevronDown,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../data/reservationData';
import '../styles/faq.css';

interface FAQItem {
  id: string;
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
      question: 'Bagaimana ketentuan Booking Fee & Tiket Komplementer?',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.75rem' }}>
            <strong>Booking Fee</strong> berfungsi untuk mengunci sofa atau meja pilihan Anda. Setelah pembayaran diverifikasi, Anda akan langsung mendapatkan <strong>Complimentary Tickets</strong> sesuai kapasitas meja:
          </p>
          <div className="faq-apple-matrix">
            <div className="faq-matrix-card">
              <span className="faq-matrix-tier">Table / Small Table</span>
              <span className="faq-matrix-capacity">Kapasitas 4 Orang</span>
              <span className="faq-matrix-ticket">Termasuk 2 Tiket Masuk</span>
            </div>
            <div className="faq-matrix-card">
              <span className="faq-matrix-tier">VIP / Mezzanine / Sofa</span>
              <span className="faq-matrix-capacity">Kapasitas 6 Orang</span>
              <span className="faq-matrix-ticket">Termasuk 3 Tiket Masuk</span>
            </div>
            <div className="faq-matrix-card">
              <span className="faq-matrix-tier">VVIP Royal Center</span>
              <span className="faq-matrix-capacity">Kapasitas 8 Orang</span>
              <span className="faq-matrix-ticket">Termasuk 4 Tiket Masuk</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#86868b', marginTop: '0.6rem' }}>
            Tiket komplementer dapat langsung ditukarkan dengan wristband resmi di antrean Fast-Track saat hari acara.
          </p>
        </div>
      )
    },
    {
      id: 'faq-2',
      question: 'Apakah Booking Fee dapat dikembalikan (Refund)?',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.5rem' }}>
            Seluruh transaksi Booking Fee bersifat <strong>non-refundable (tidak dapat dibatalkan atau dikembalikan)</strong>.
          </p>
          <div className="faq-apple-note">
            Nomor meja yang telah Anda pesan langsung dikunci dari publik untuk mencegah pemesanan ganda dan menjamin spot meja tetap tersedia khusus untuk rombongan Anda.
          </div>
        </div>
      )
    },
    {
      id: 'faq-3',
      question: 'Area mana saja yang dapat diakses oleh pemegang reservasi?',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.75rem' }}>
            Pemegang reservasi meja dan tiket resmi mendapatkan <strong>akses penuh tanpa batas</strong> ke dua area venue:
          </p>
          <div className="faq-apple-venues">
            <div className="faq-venue-box">
              <div className="faq-venue-title">Tetra Solo</div>
              <div className="faq-venue-desc">
                Panggung utama, tata suara 360°, area pit festival, dan pertunjukan headliner.
              </div>
            </div>
            <div className="faq-venue-box">
              <div className="faq-venue-title">Mizu Commonroom</div>
              <div className="faq-venue-desc">
                Lounge bertingkat VIP &amp; VVIP Mezzanine, private bar, dan elevated stage view.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-4',
      question: 'Bagaimana ketentuan Minimum Charge F&B?',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.6rem' }}>
            <strong>Booking Fee tidak memotong nominal Minimum Charge</strong>, meskipun tiket masuk komplementer sudah disertakan dalam paket meja.
          </p>
          <div className="faq-apple-note">
            Tamu tetap diwajibkan memenuhi <em>minimum spend</em> sesuai nominal paket meja dengan memesan makanan dan botol minuman secara langsung di lokasi acara.
          </div>
        </div>
      )
    },
    {
      id: 'faq-5',
      question: 'Apa saja fasilitas khusus untuk tamu reservasi meja?',
      answer: (
        <p style={{ margin: '0.2rem 0' }}>
          Tamu reservasi meja mendapatkan kepastian tempat duduk/sofa yang dipesan, pendampingan dari staf venue ke nomor meja, serta kemudahan pemesanan langsung di area meja.
        </p>
      )
    },
    {
      id: 'faq-6',
      question: 'Kapan jadwal penukaran tiket fisik / wristband?',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.65rem' }}>
            Penukaran e-voucher menjadi wristband fisik resmi dibuka pada:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
            <div>
              <strong>H-1 Acara:</strong> Penukaran awal di venue (lokasi stan dan jam buka diumumkan melalui Instagram resmi).
            </div>
            <div>
              <strong>Hari Acara (30 &amp; 31 Oktober):</strong> Loket Fast-Track dibuka mulai <strong>pukul 20.00 WIB</strong> di gerbang utama venue.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-7',
      question: 'Rekening pembayaran resmi & kontak WhatsApp',
      answer: (
        <div>
          <p style={{ margin: '0.2rem 0 0.75rem' }}>
            Demi keamanan transaksi, pembayaran reservasi hanya sah jika ditransfer ke rekening bank resmi berikut:
          </p>

          <div className="faq-apple-wallet-grid">
            {/* Booking Fee */}
            <div className="faq-wallet-card">
              <div className="faq-wallet-header">
                <span className="faq-wallet-type">Transfer Booking Fee</span>
                <span style={{ fontSize: '0.72rem', color: '#86868b' }}>BCA</span>
              </div>
              <div className="faq-wallet-row">
                <span className="faq-wallet-number">0374541630</span>
                <button
                  type="button"
                  className={`faq-wallet-copy-btn ${copiedKey === 'bf' ? 'is-copied' : ''}`}
                  onClick={() => copyToClipboard('0374541630', 'bf')}
                >
                  {copiedKey === 'bf' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'bf' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <span className="faq-wallet-owner">a/n M. Ferdian Wahyu</span>
            </div>

            {/* Down Payment */}
            <div className="faq-wallet-card">
              <div className="faq-wallet-header">
                <span className="faq-wallet-type">Transfer Down Payment</span>
                <span style={{ fontSize: '0.72rem', color: '#86868b' }}>BCA</span>
              </div>
              <div className="faq-wallet-row">
                <span className="faq-wallet-number">0373791196</span>
                <button
                  type="button"
                  className={`faq-wallet-copy-btn ${copiedKey === 'dp' ? 'is-copied' : ''}`}
                  onClick={() => copyToClipboard('0373791196', 'dp')}
                >
                  {copiedKey === 'dp' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'dp' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <span className="faq-wallet-owner">a/n Bagus Dwi Setyawan</span>
            </div>
          </div>

          {/* WhatsApp Admin Pills */}
          <div className="faq-wallet-contact">
            <span style={{ fontSize: '0.82rem', color: '#86868b' }}>
              Konfirmasi Bukti Transfer:
            </span>
            <div className="faq-wallet-actions">
              <a
                href={`https://wa.me/${ADMIN_DAY1.phone}?text=${encodeURIComponent('Halo Admin Day 1, saya ingin konfirmasi pembayaran reservasi The State of Clamor.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-wallet-link"
              >
                <MessageSquare size={13} />
                <span>Admin Day 1 ({ADMIN_DAY1.displayPhone})</span>
              </a>
              <a
                href={`https://wa.me/${ADMIN_DAY2.phone}?text=${encodeURIComponent('Halo Admin Day 2, saya ingin konfirmasi pembayaran reservasi The State of Clamor.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-wallet-link"
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
        <span className="faq-eyebrow">Informasi Resmi</span>
        <h2 className="faq-title">Pertanyaan yang Sering Diajukan</h2>
        <p className="faq-desc">
          Ketentuan reservasi meja, tiket komplementer, kebijakan minimum charge, dan nomor rekening resmi.
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
                <span className="faq-question-text">{item.question}</span>
                <ChevronDown
                  size={18}
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
