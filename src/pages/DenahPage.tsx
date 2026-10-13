import React, { useState } from 'react';
import { FloorPlanViewer } from '../components/floorplan/FloorPlanViewer';
import { OfficialFAQSection } from '../components/OfficialFAQSection';
import { Compass, Calendar, ArrowLeft } from 'lucide-react';
import '../styles/denah.css';

interface Props {
  onBack: () => void;
  onNavigateToReservasi: (packageId?: string) => void;
}

export const DenahPage: React.FC<Props> = ({ onBack, onNavigateToReservasi }) => {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2'>('day-1');

  return (
    <main className="denah-page-container">
      {/* Back Button */}
      <div className="denah-back-bar">
        <button
          type="button"
          onClick={onBack}
          className="denah-back-btn"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Header Cluster */}
      <header className="denah-header-cluster">
        <div className="denah-eyebrow-pill">
          <Compass size={13} className="text-gold-antique" />
          <span>DENAH VENUE RESMI // MIZU COMMONROOM</span>
        </div>
        <h1 className="denah-main-title">
          TATA LETAK SANCTUARY &amp; DENAH PARTY
        </h1>
        <p className="denah-subtitle-desc">
          Navigasi interaktif denah <strong>Lantai 1</strong> &amp; <strong>Lantai 2</strong> The State of Clamour.
          Status meja (Tersedia vs Terisi) tersinkronisasi secara real-time. Klik pin meja untuk spesifikasi dan reservasi langsung via WhatsApp.
        </p>

        {/* Day Selector Pill */}
        <div className="denah-day-toggle-bar" role="tablist" aria-label="Pilih Hari Acara">
          <button
            type="button"
            className={`denah-day-btn ${selectedDay === 'day-1' ? 'is-active' : ''}`}
            onClick={() => setSelectedDay('day-1')}
          >
            <Calendar size={13} />
            <span>DAY 1: SWEAR IN CONTINENTAL (30 OKT)</span>
          </button>
          <button
            type="button"
            className={`denah-day-btn ${selectedDay === 'day-2' ? 'is-active' : ''}`}
            onClick={() => setSelectedDay('day-2')}
          >
            <Calendar size={13} />
            <span>DAY 2: THE UNDER-VAULT (31 OKT)</span>
          </button>
        </div>
      </header>

      {/* Interactive Dual-Floor Viewer */}
      <section className="w-full max-w-6xl mx-auto mb-12">
        <FloorPlanViewer
          day={selectedDay}
          onDayChange={setSelectedDay}
          onNavigateToBookingForm={(spot) => onNavigateToReservasi(spot.packageIdRef)}
        />
      </section>

      {/* Official FAQ & Guidelines */}
      <OfficialFAQSection />

      {/* Bottom Fast Access Banner */}
      <section className="denah-bottom-banner">
        <h2 className="denah-banner-title">AMANKAN TEMPAT DUDUK TERBAIK ANDA</h2>
        <p className="denah-banner-desc">
          Kapasitas sofa dan meja VVIP sangat terbatas. Hubungi admin resmi untuk konsultasi penempatan meja dan penguncian nomor meja Anda malam ini.
        </p>

        <div className="denah-banner-actions">
          <button
            type="button"
            className="denah-primary-action btn-press"
            onClick={() => onNavigateToReservasi()}
          >
            LIHAT PAKET RESERVASI MEJA →
          </button>
          <button
            type="button"
            className="denah-secondary-action btn-press"
            onClick={onBack}
          >
            KEMBALI KE BERANDA
          </button>
        </div>
      </section>
    </main>
  );
};

export default DenahPage;
