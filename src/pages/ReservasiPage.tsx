import React, { useState } from 'react';
import {
  ADMIN_DAY1,
  ADMIN_DAY2
} from '../data/reservationData';
import { FloorPlanViewer } from '../components/floorplan/FloorPlanViewer';
import { OfficialFAQSection } from '../components/OfficialFAQSection';
import {
  Crown,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import '../styles/reservasi.css';

interface Props {
  initialPackageId?: string;
  onBack: () => void;
  onNavigateToDenah?: () => void;
  onToast: (msg: string) => void;
}

export const ReservasiPage: React.FC<Props> = ({
  onBack,
  onToast
}) => {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2'>('day-1');

  const handleConciergeChat = (day: 'day-1' | 'day-2') => {
    const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
    const eventName = day === 'day-1' ? 'Swear in Continental' : 'The Under-Vault';
    const msg = `Halo ${admin.name}, saya ingin konsultasi reservasi meja VIP & sofa party untuk The State of Clamour: ${eventName} (${admin.dateLabel}). Mohon informasi rekomendasi posisi terbaik & paket yang tersedia. Terima kasih!`;
    const url = `https://wa.me/${admin.phone}?text=${encodeURIComponent(msg)}`;
    onToast(`Menghubungi ${admin.name}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="reservasi-page-container">
      {/* Top Navigation */}
      <div className="reservasi-top-bar">
        <button
          type="button"
          onClick={onBack}
          className="reservasi-back-btn btn-press"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Editorial Header */}
      <header className="reservasi-header-cluster">
        <div className="reservasi-eyebrow-pill">
          <Crown size={13} className="text-[#c5a869]" />
          <span>VIP HOSPITALITY // MIZU COMMONROOM</span>
        </div>
        <h1 className="reservasi-main-title">
          RESERVASI MEJA &amp; SOFA
        </h1>
        <p className="reservasi-subtitle-desc">
          Pesan meja atau sofa eksklusif Anda untuk <strong>The State of Clamour</strong> (30 &amp; 31 Okt 2026).
          Pilih nomor meja secara interaktif dengan status live Supabase, atau konsultasikan langsung dengan VIP Concierge resmi.
        </p>
      </header>

      {/* Dual VIP Concierge Hotline Cards */}
      <section className="reservasi-concierge-section" aria-label="VIP Concierge Hotline">
        <div className="concierge-section-header">
          <Sparkles size={14} className="text-[#c5a869]" />
          <span>LAYANAN KONSULTASI VIP LANGSUNG</span>
        </div>

        <div className="reservasi-concierge-grid">
          {/* Day 1 Admin Card */}
          <article className="concierge-card">
            <div className="concierge-card-header">
              <span className="concierge-badge">NIGHT 01 // 30 OKTOBER 2026</span>
              <div className="concierge-status-indicator">
                <span className="concierge-status-dot" />
                <span>ONLINE</span>
              </div>
            </div>

            <h2 className="concierge-title">ADMIN RSVP DAY 1</h2>
            <p className="concierge-theme">Theme: Swear in Continental</p>
            <p className="concierge-desc">
              Dedicated hospitality, bottle packages, private butler &amp; reservasi meja Lantai 1 &amp; Lantai 2 khusus Day 1.
            </p>

            <div className="concierge-meta-box">
              <div className="meta-row">
                <span className="meta-label">PIC Resmi:</span>
                <span className="meta-value">{ADMIN_DAY1.name}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">WhatsApp:</span>
                <span className="meta-value gold">{ADMIN_DAY1.displayPhone}</span>
              </div>
            </div>

            <button
              type="button"
              className="concierge-action-btn btn-press"
              onClick={() => handleConciergeChat('day-1')}
            >
              <MessageCircle size={16} />
              <span>KONSULTASI ADMIN DAY 1</span>
            </button>
          </article>

          {/* Day 2 Admin Card */}
          <article className="concierge-card">
            <div className="concierge-card-header">
              <span className="concierge-badge">NIGHT 02 // 31 OKTOBER 2026</span>
              <div className="concierge-status-indicator">
                <span className="concierge-status-dot" />
                <span>ONLINE</span>
              </div>
            </div>

            <h2 className="concierge-title">ADMIN RSVP DAY 2</h2>
            <p className="concierge-theme">Theme: The Under-Vault</p>
            <p className="concierge-desc">
              Dedicated hospitality, bottle packages, private butler &amp; reservasi meja Lantai 1 &amp; Lantai 2 khusus Day 2.
            </p>

            <div className="concierge-meta-box">
              <div className="meta-row">
                <span className="meta-label">PIC Resmi:</span>
                <span className="meta-value">{ADMIN_DAY2.name}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">WhatsApp:</span>
                <span className="meta-value gold">{ADMIN_DAY2.displayPhone}</span>
              </div>
            </div>

            <button
              type="button"
              className="concierge-action-btn btn-press"
              onClick={() => handleConciergeChat('day-2')}
            >
              <MessageCircle size={16} />
              <span>KONSULTASI ADMIN DAY 2</span>
            </button>
          </article>
        </div>

        <div className="concierge-guarantee-note">
          <ShieldCheck size={14} className="text-[#c5a869] shrink-0" />
          <span>Nomor WhatsApp resmi di atas adalah satu-satunya kanal terverifikasi reservasi VIP Table The State of Clamour.</span>
        </div>
      </section>

      {/* Interactive Floor Plan & Table Inventory Section */}
      <section className="reservasi-inventory-section" aria-label="Inventaris Meja Interaktif">
        <div className="inventory-section-header">
          <div className="section-eyebrow">
            <span>DENAH VENUE &amp; INVENTARIS MEJA REAL-TIME</span>
          </div>
          <h2 className="inventory-section-title">
            PILIH POSISI MEJA &amp; CEK KETERSEDIAAN
          </h2>
          <p className="inventory-section-desc">
            Pilih hari acara di bawah untuk menyinkronkan status ketersediaan 73 meja fisik di Mizu Commonroom.
            Klik pin meja atau beralih ke Mode Daftar untuk melihat detail spesifikasi serta reservasi instan.
          </p>

          {/* Tactile Apple-Style Day Switcher */}
          <div className="reservasi-day-segmented" role="tablist" aria-label="Pilih Hari Acara">
            <button
              type="button"
              className={`segmented-pill-btn ${selectedDay === 'day-1' ? 'is-active' : ''}`}
              onClick={() => setSelectedDay('day-1')}
              role="tab"
              aria-selected={selectedDay === 'day-1'}
            >
              <Calendar size={13} />
              <span>DAY 1: SWEAR IN CONTINENTAL (30 OKT)</span>
            </button>
            <button
              type="button"
              className={`segmented-pill-btn ${selectedDay === 'day-2' ? 'is-active' : ''}`}
              onClick={() => setSelectedDay('day-2')}
              role="tab"
              aria-selected={selectedDay === 'day-2'}
            >
              <Calendar size={13} />
              <span>DAY 2: THE UNDER-VAULT (31 OKT)</span>
            </button>
          </div>
        </div>

        {/* Embedded FloorPlanViewer Component */}
        <div className="reservasi-floorplan-container">
          <FloorPlanViewer
            day={selectedDay}
          />
        </div>
      </section>

      {/* Official FAQ & Priority RSVP Guide */}
      <OfficialFAQSection />
    </main>
  );
};

export default ReservasiPage;
