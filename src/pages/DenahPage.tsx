import React, { useState } from 'react';
import { FloorPlanViewer } from '../components/floorplan/FloorPlanViewer';
import { venueZones } from '../data/reservationData';
import { Compass, Volume2, Users, Calendar, ArrowLeft } from 'lucide-react';
import '../styles/denah.css';

interface Props {
  onBack: () => void;
  onNavigateToReservasi: (packageId?: string) => void;
}

export const DenahPage: React.FC<Props> = ({ onBack, onNavigateToReservasi }) => {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2'>('day-1');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-vvip');

  return (
    <main className="denah-page-container">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto w-full mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-[#a6a4a0] hover:text-[#c5a869] transition-colors py-2 px-3 rounded border border-white/10 bg-black/40"
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
        <div className="inline-flex items-center p-1 rounded-lg bg-[#0b0e14] border border-[#c5a869]/30 mt-3 gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDay === 'day-1'
                ? 'bg-[#c5a869] text-black shadow-lg shadow-[#c5a869]/20'
                : 'text-[#a6a4a0] hover:text-white'
            }`}
            onClick={() => setSelectedDay('day-1')}
          >
            <Calendar size={13} />
            <span>DAY 1: SWEAR IN CONTINENTAL (30 OKT)</span>
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedDay === 'day-2'
                ? 'bg-[#c5a869] text-black shadow-lg shadow-[#c5a869]/20'
                : 'text-[#a6a4a0] hover:text-white'
            }`}
            onClick={() => setSelectedDay('day-2')}
          >
            <Calendar size={13} />
            <span>DAY 2: TECHNO UNDER-VAULT (31 OKT)</span>
          </button>
        </div>
      </header>

      {/* Interactive Dual-Floor Viewer */}
      <section className="w-full max-w-6xl mx-auto mb-12">
        <FloorPlanViewer
          day={selectedDay}
          onNavigateToBookingForm={(spot) => onNavigateToReservasi(spot.packageIdRef)}
        />
      </section>

      {/* Zone Detail Ledger Cards */}
      <section className="denah-ledger-section">
        <div className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span>DETAIL SPESIFIKASI &amp; FASILITAS ZONA SANCTUARY</span>
        </div>

        <div className="denah-zones-grid">
          {venueZones.map(zone => {
            const isSelected = zone.id === selectedZoneId;
            return (
              <article
                key={zone.id}
                id={`zone-card-${zone.id}`}
                className={`denah-zone-card ${isSelected ? 'is-active' : ''}`}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                <div className="zone-card-header">
                  <span className="zone-code-tag">{zone.code}</span>
                  <span className="zone-category-tag">{zone.category}</span>
                </div>

                <h3 className="zone-card-title">{zone.name}</h3>
                <div className="zone-sound-profile">
                  <Volume2 size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                  {zone.soundProfile}
                </div>

                <p className="zone-card-desc">{zone.description}</p>

                <ul className="zone-facilities-list">
                  {zone.facilities.map((fac, idx) => (
                    <li key={idx}>{fac}</li>
                  ))}
                </ul>

                <div className="zone-card-footer">
                  {zone.associatedPackageId ? (
                    <button
                      type="button"
                      className="zone-reserve-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToReservasi(zone.associatedPackageId);
                      }}
                    >
                      RESERVASI DI ZONA INI →
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-dim)', textAlign: 'center', padding: '0.4rem 0' }}>
                      <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {zone.capacity}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

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
