import React, { useState, useEffect } from 'react';
import {
  reservationPackages,
  ADMIN_DAY1,
  ADMIN_DAY2,
  buildWhatsAppReservationUrl
} from '../../data/reservationData';
import { MessageCircle, Users } from 'lucide-react';
import '../../styles/reservasi.css';

interface Props {
  day: 'day-1' | 'day-2';
  initialPackageId?: string;
  onToast: (msg: string) => void;
}

export const EventReservationSection: React.FC<Props> = ({
  day,
  initialPackageId,
  onToast
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || reservationPackages[0].id
  );
  const [guestName, setGuestName] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(6);
  const [customNotes, setCustomNotes] = useState<string>('');

  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  const activeAdmin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
  const dayTitleLabel = day === 'day-1' ? 'DAY 1 // JUMAT, 30 OKT (SWEAR IN CONTINENTAL)' : 'DAY 2 // SABTU, 31 OKT (SWEAR IN CONTINENTAL)';

  const waReservation = buildWhatsAppReservationUrl({
    day,
    packageId: selectedPackageId,
    guestName,
    guestCount,
    customMessage: customNotes
  });

  const handleSendWhatsApp = () => {
    onToast(`Membuka WhatsApp resmi ${activeAdmin.name}...`);
    window.open(waReservation.url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectPackageCard = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const widgetEl = document.getElementById(`reservasi-widget-anchor-${day}`);
    if (widgetEl) {
      const offset = 80;
      const targetY = widgetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  };

  const handleFastGeneralInquiry = () => {
    const msg = `Halo ${activeAdmin.name}, saya ingin konsultasi ketersediaan meja/sofa VIP untuk acara The State of Clamor (${activeAdmin.dateLabel}). Mohon info nomor meja yang masih available. Terima kasih!`;
    const url = `https://wa.me/${activeAdmin.phone}?text=${encodeURIComponent(msg)}`;
    onToast(`Menghubungi ${activeAdmin.name}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="reservasi" className="reservasi-embedded-section" style={{ marginBottom: '4rem', scrollMarginTop: '80px' }}>
      {/* Header Cluster */}
      <div className="dossier-sub-header">
        <div className="section-eyebrow">
          <span>RESERVASI MEJA // {dayTitleLabel}</span>
        </div>
        <h2 className="dossier-sub-title text-gold-metallic">
          RESERVASI MEJA &amp; SOFA
        </h2>
        <p className="dossier-sub-desc" style={{ maxWidth: '660px', color: 'var(--color-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
          Pilih posisi meja atau sofa favoritmu untuk menikmati malam pertunjukan. Reservasi terhubung langsung ke WhatsApp <strong>{activeAdmin.name}</strong>.
        </p>
      </div>

      {/* Admin Duty Information Banner */}
      <aside className="admin-duty-banner" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="admin-duty-info">
          <div className="admin-duty-icon">
            <MessageCircle size={20} />
          </div>
          <div className="admin-duty-text">
            <span>Admin Siaga Resmi: <strong>{activeAdmin.name}</strong> ({activeAdmin.displayPhone})</span>
            <br />
            <small style={{ color: 'var(--color-dim)' }}>
              *Konfirmasi nomor sofa, penempatan posisi pit, dan invoice diteruskan instan ke kontak WhatsApp ini.
            </small>
          </div>
        </div>

        <button
          type="button"
          className="admin-fast-chat-btn"
          onClick={handleFastGeneralInquiry}
        >
          <MessageCircle size={15} />
          <span>KONSULTASI LANGSUNG DENGAN ADMIN</span>
        </button>
      </aside>

      {/* Interactive Quick WhatsApp Reservation Form Widget */}
      <div id={`reservasi-widget-anchor-${day}`} className="reservasi-interactive-widget">
        <div className="widget-title-cluster">
          <h3 className="widget-title">FORMULIR CEPAT RESERVASI WHATSAPP</h3>
          <p className="widget-desc">
            Pilih paket dan isi data di bawah. Pesan akan terformat otomatis dan diteruskan langsung ke WhatsApp <strong>{activeAdmin.name}</strong>.
          </p>
        </div>

        <div className="widget-form-grid">
          {/* Pilihan Paket */}
          <div className="form-field-group">
            <label className="form-field-label">Pilihan Paket Meja / Sofa</label>
            <select
              className="form-field-select"
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
            >
              {reservationPackages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({day === 'day-1' ? pkg.formattedMinSpendDay1 : pkg.formattedMinSpendDay2})
                </option>
              ))}
            </select>
          </div>

          {/* Nama Pemesan */}
          <div className="form-field-group">
            <label className="form-field-label">Nama Pemesan / Atas Nama</label>
            <input
              type="text"
              className="form-field-input"
              placeholder="Contoh: Sakti &amp; Rekan"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          {/* Jumlah Hadirin */}
          <div className="form-field-group">
            <label className="form-field-label">Estimasi Jumlah Hadirin</label>
            <input
              type="number"
              min={1}
              max={25}
              className="form-field-input"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          {/* Catatan Khusus */}
          <div className="form-field-group form-field-group-wide">
            <label className="form-field-label">Catatan Tambahan / Preferensi Posisi (Opsional)</label>
            <input
              type="text"
              className="form-field-input"
              placeholder="Contoh: Request brand minuman tertentu, perayaan ulang tahun, posisi dekat panggung"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </div>
        </div>

        {/* WhatsApp Message Live Preview Box */}
        <div className="message-preview-container">
          <div className="message-preview-header">
            <span>PREVIEW PESAN OTOMATIS (AKAN DIKIRIM KE: {activeAdmin.displayPhone})</span>
            <span style={{ color: '#25d366' }}>● READY TO TRANSMIT</span>
          </div>
          <div className="message-preview-text">
            {waReservation.message}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="whatsapp-submit-btn btn-press"
          onClick={handleSendWhatsApp}
        >
          <MessageCircle size={18} />
          <span>KIRIM RESERVASI KE {activeAdmin.name.toUpperCase()} VIA WHATSAPP →</span>
        </button>
      </div>

      {/* Package Catalog Cards Grid */}
      <div style={{ marginTop: '3.5rem' }}>
        <div className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span>KATALOG LENGKAP PAKET MEJA &amp; SOFA SANCTUARY</span>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--color-gold-antique)', fontSize: '0.85rem', marginBottom: '2rem', fontFamily: 'var(--font-mono, monospace)' }}>
          Harga minimum spend berlaku untuk <strong>{activeAdmin.dateLabel}</strong>
        </p>

        <div className="packages-catalog-grid">
          {reservationPackages.map(pkg => {
            const isSelected = pkg.id === selectedPackageId;
            const priceLabel = day === 'day-1' ? pkg.formattedMinSpendDay1 : pkg.formattedMinSpendDay2;

            return (
              <article
                key={pkg.id}
                className={`package-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelectPackageCard(pkg.id)}
              >
                {pkg.badgeLabel && (
                  <span className="package-badge">{pkg.badgeLabel}</span>
                )}

                <div className="package-zone-meta">
                  <span>{pkg.zoneCode} // {pkg.zoneName.toUpperCase()}</span>
                </div>

                <h3 className="package-card-title">{pkg.name}</h3>
                <p className="package-card-tagline">{pkg.tagline}</p>

                <div className="package-price-block">
                  <span className="package-price-label">MINIMUM SPEND ({day.toUpperCase()})</span>
                  <div className="package-price-val">{priceLabel}</div>
                  <span className="package-capacity-tag">
                    <Users size={12} /> Kapasitas: {pkg.capacityText}
                  </span>
                </div>

                <ul className="package-inclusions-list">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>

                <div className="package-card-action">
                  <button
                    type="button"
                    className="package-select-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPackageCard(pkg.id);
                    }}
                  >
                    {isSelected ? '✓ PAKET DIPILIH' : 'PILIH PAKET INI →'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
