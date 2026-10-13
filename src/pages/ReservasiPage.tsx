import React, { useState, useRef, useEffect } from 'react';
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
  const conciergeCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollToCard = (idx: number) => {
    const el = conciergeCarouselRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  };

  const handleDaySelect = (day: 'day-1' | 'day-2') => {
    setSelectedDay(day);
    scrollToCard(day === 'day-1' ? 0 : 1);
  };

  // Synchronize carousel position when selectedDay changes
  useEffect(() => {
    const el = conciergeCarouselRef.current;
    if (!el) return;
    const idx = selectedDay === 'day-1' ? 0 : 1;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      if (Math.abs(el.scrollLeft - targetLeft) > 30) {
        el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }
  }, [selectedDay]);

  const handleCarouselScroll = () => {
    const el = conciergeCarouselRef.current;
    if (!el || el.children.length === 0) return;
    if (window.innerWidth >= 768) return;

    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      if (!child) continue;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(scrollCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    const newDay = closestIdx === 0 ? 'day-1' : 'day-2';
    if (newDay !== selectedDay) {
      setSelectedDay(newDay);
    }
  };

  const handleConciergeChat = (day: 'day-1' | 'day-2') => {
    const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
    const eventName = 'Swear in Continental';
    const msg = `Halo ${admin.name}, saya ingin konsultasi reservasi meja VIP & sofa party untuk The State of Clamour: ${eventName} (${admin.dateLabel}). Mohon informasi rekomendasi posisi terbaik & paket yang tersedia. Terima kasih!`;
    const url = `https://wa.me/${admin.phone}?text=${encodeURIComponent(msg)}`;
    onToast(`Menghubungi ${admin.name}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="reservasi-page-container">
      {/* Top Navigation Bar */}
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
          <Crown size={12} className="reservasi-eyebrow-icon" />
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
          <Sparkles size={13} className="concierge-header-icon" />
          <span>LAYANAN KONSULTASI VIP LANGSUNG</span>
        </div>

        <div
          ref={conciergeCarouselRef}
          onScroll={handleCarouselScroll}
          className="reservasi-concierge-grid"
        >
          {/* Day 1 Admin Card */}
          <article className={`concierge-card ${selectedDay === 'day-1' ? 'is-selected-day' : ''}`}>
            <div className="concierge-card-header">
              <span className="concierge-badge">NIGHT 01 // 30 OKTOBER 2026</span>
              <div className="concierge-status-indicator">
                <span className="concierge-status-dot" />
                <span>ONLINE</span>
              </div>
            </div>

            <div className="concierge-card-body">
              <h2 className="concierge-title">{ADMIN_DAY1.name}</h2>
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
                  <span className="meta-value mono">{ADMIN_DAY1.displayPhone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="concierge-action-btn btn-press"
              onClick={() => handleConciergeChat('day-1')}
            >
              <MessageCircle size={15} />
              <span>KONSULTASI ADMIN DAY 1</span>
            </button>
          </article>

          {/* Day 2 Admin Card */}
          <article className={`concierge-card ${selectedDay === 'day-2' ? 'is-selected-day' : ''}`}>
            <div className="concierge-card-header">
              <span className="concierge-badge">NIGHT 02 // 31 OKTOBER 2026</span>
              <div className="concierge-status-indicator">
                <span className="concierge-status-dot" />
                <span>ONLINE</span>
              </div>
            </div>

            <div className="concierge-card-body">
              <h2 className="concierge-title">{ADMIN_DAY2.name}</h2>
              <p className="concierge-theme">Theme: Swear in Continental</p>
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
                  <span className="meta-value mono">{ADMIN_DAY2.displayPhone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="concierge-action-btn btn-press"
              onClick={() => handleConciergeChat('day-2')}
            >
              <MessageCircle size={15} />
              <span>KONSULTASI ADMIN DAY 2</span>
            </button>
          </article>
        </div>

        {/* Mobile Carousel Pagination Dots (Apple Minimalist) */}
        <div className="concierge-carousel-dots" role="tablist" aria-label="Navigasi VIP Concierge">
          <button
            type="button"
            className={`carousel-dot ${selectedDay === 'day-1' ? 'is-active' : ''}`}
            onClick={() => handleDaySelect('day-1')}
            aria-label="Pilih Night 01 - Swear in Continental"
          />
          <button
            type="button"
            className={`carousel-dot ${selectedDay === 'day-2' ? 'is-active' : ''}`}
            onClick={() => handleDaySelect('day-2')}
            aria-label="Pilih Night 02 - Swear in Continental"
          />
        </div>

        <div className="concierge-guarantee-note">
          <ShieldCheck size={14} className="guarantee-icon shrink-0" />
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
            Status ketersediaan meja otomatis tersinkronisasi dengan{' '}
            <strong>{selectedDay === 'day-1' ? 'DAY 1: Swear in Continental (30 Okt)' : 'DAY 2: Swear in Continental (31 Okt)'}</strong>.
            Klik pin meja pada denah untuk melihat detail spesifikasi serta reservasi instan.
          </p>
        </div>

        {/* Embedded FloorPlanViewer Component */}
        <div className="reservasi-floorplan-container">
          <FloorPlanViewer
            day={selectedDay}
            onDayChange={handleDaySelect}
          />
        </div>
      </section>

      {/* Official FAQ & Priority RSVP Guide */}
      <OfficialFAQSection />
    </main>
  );
};

export default ReservasiPage;

