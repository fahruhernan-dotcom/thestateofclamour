import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Ticket,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../data/reservationData';
import '../styles/faq.css';

interface FAQItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: React.ReactNode;
}

export const OfficialFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const faqData: FAQItem[] = [
    {
      id: 'faq-1',
      icon: <Ticket size={18} />,
      question: '1. Booking Fee & Complementary Tiket',
      answer: (
        <div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Booking Fee</strong> bertujuan untuk mengunci sofa / meja RSVP pilihan Anda. Setelah pembayaran Booking Fee berhasil diverifikasi oleh admin, Anda akan mendapatkan <strong>complimentary tickets</strong> sesuai dengan kuota meja yang telah ditentukan:
          </p>
          <ul className="faq-list">
            <li><strong>Table / Small Table (4 PAX):</strong> Termasuk 2 Complimentary Tickets.</li>
            <li><strong>VIP / Mezzanine / Sofa (6 PAX):</strong> Termasuk 3 Complimentary Tickets.</li>
            <li><strong>VVIP Royal (8 PAX):</strong> Termasuk 4 Complimentary Tickets.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-2',
      icon: <ShieldCheck size={18} />,
      question: '2. Kebijakan Refund (Refund Policy)',
      answer: (
        <p>
          Booking Fee yang telah dibayarkan bersifat <strong>non-refundable (tidak dapat dikembalikan)</strong> karena dialokasikan secara eksklusif untuk mengunci ketersediaan meja pilihan Anda dan mencegah reservasi ganda oleh tamu lain.
        </p>
      )
    },
    {
      id: 'faq-3',
      icon: <MapPin size={18} />,
      question: '3. Akses Venue (Mizu Commonroom & Tetra Solo)',
      answer: (
        <p>
          Seluruh pemegang reservasi VIP / Table RSVP dan tiket resmi mendapatkan <strong>akses penuh ke seluruh area Tetra Solo &amp; Mizu Commonroom</strong> selama acara The State of Clamour berlangsung (30 &amp; 31 Oktober 2026).
        </p>
      )
    },
    {
      id: 'faq-4',
      icon: <Sparkles size={18} />,
      question: '4. Ketentuan Minimum Charge',
      answer: (
        <div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Booking Fee TIDAK mengurangi minimum charge</strong> yang berlaku, meskipun complimentary tickets telah disertakan dalam paket.
          </p>
          <p style={{ color: '#d4cfc7' }}>
            Para tamu tetap diwajibkan untuk memenuhi <em>minimum charge</em> sesuai dengan ketentuan sofa atau meja yang dipilih. Pembayaran minimum charge diselesaikan secara terpisah langsung di lokasi acara (F&amp;B order).
          </p>
        </div>
      )
    },
    {
      id: 'faq-5',
      icon: <ShieldCheck size={18} />,
      question: '5. Jaminan Layanan & Dedicated Butler',
      answer: (
        <p>
          Semua tamu yang telah melakukan RSVP terverifikasi akan mendapatkan layanan prioritas, pengawalan, dan akses langsung ke area tempat duduk sesuai nomor meja yang dipilih. Tim hospitality kami memastikan pelayanan terbaik sepanjang malam.
        </p>
      )
    },
    {
      id: 'faq-6',
      icon: <Clock size={18} />,
      question: '6. Jadwal Penukaran Tiket Fisik / Wristband',
      answer: (
        <div>
          <p style={{ marginBottom: '0.5rem' }}>
            Penukaran ticket tersedia mulai dari <strong>H-1</strong> dan pada <strong>hari acara (Hari H)</strong>:
          </p>
          <ul className="faq-list">
            <li><strong>Hari H:</strong> Jalur khusus penukaran ticket dibuka mulai <strong>pukul 20.00 WIB</strong> melalui jalur penukaran yang telah disediakan di gerbang utama venue.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-7',
      icon: <CreditCard size={18} />,
      question: '7. Rekening Pembayaran Resmi & Kontak RSVP',
      answer: (
        <div>
          <p style={{ marginBottom: '0.65rem' }}>
            Untuk mencegah penipuan, seluruh pembayaran reservasi hanya sah jika ditransfer ke rekening bank resmi di bawah ini:
          </p>
          <div className="faq-bank-grid">
            <div className="faq-bank-card">
              <span className="faq-bank-label">Transfer Booking Fee:</span>
              <strong className="faq-bank-acc">BCA 0374541630</strong>
              <span className="faq-bank-name">a/n M. Ferdian Wahyu</span>
            </div>
            <div className="faq-bank-card">
              <span className="faq-bank-label">Transfer Down Payment:</span>
              <strong className="faq-bank-acc">BCA 037-379-1196</strong>
              <span className="faq-bank-name">a/n Bagus Dwi Setyawan</span>
            </div>
          </div>
          <div className="faq-contact-strip">
            <span style={{ color: 'var(--color-dim)' }}>Kontak Admin Resmi:</span>
            <span style={{ color: 'var(--color-gold-antique)', fontFamily: 'var(--font-mono)' }}>Day 1: {ADMIN_DAY1.displayPhone}</span>
            <span style={{ color: 'var(--color-dim)' }}>·</span>
            <span style={{ color: 'var(--color-gold-antique)', fontFamily: 'var(--font-mono)' }}>Day 2: {ADMIN_DAY2.displayPhone}</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="official-faq-section">
      <div className="faq-header">
        <div className="faq-eyebrow">
          <HelpCircle size={12} />
          <span>PRIORITY RSVP GUIDE BOOK // FAQ</span>
        </div>
        <h2 className="faq-title">
          PANDUAN &amp; KETENTUAN RESERVASI RESMI
        </h2>
        <p className="faq-desc">
          Informasi resmi perihal kuncian meja, tiket komplementer, kebijakan minimum charge, dan rekening transfer The State of Clamour.
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
                  <div className="faq-icon-box">
                    {item.icon}
                  </div>
                  <span className="faq-question-text">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`faq-chevron ${isOpen ? 'is-open' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="faq-content-body">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OfficialFAQSection;
