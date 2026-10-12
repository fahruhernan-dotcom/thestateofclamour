import React, { useState, useEffect } from 'react';
import {
  reservationPackages,
  ADMIN_DAY1,
  ADMIN_DAY2,
  buildWhatsAppReservationUrl
} from '../data/reservationData';
import {
  Crown,
  MessageCircle,
  Users
} from 'lucide-react';
import '../styles/reservasi.css';

interface Props {
  initialPackageId?: string;
  onBack: () => void;
  onNavigateToDenah: () => void;
  onToast: (msg: string) => void;
}

export const ReservasiPage: React.FC<Props> = ({
  initialPackageId,
  onBack,
  onNavigateToDenah,
  onToast
}) => {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2'>('day-1');
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

  const activeAdmin = selectedDay === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;

  const waReservation = buildWhatsAppReservationUrl({
    day: selectedDay,
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
    const widgetEl = document.getElementById('reservasi-widget-anchor');
    if (widgetEl) {
      widgetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFastGeneralInquiry = (day: 'day-1' | 'day-2') => {
    const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
    const msg = `Halo ${admin.name}, saya ingin konsultasi umum mengenai ketersediaan meja/sofa VIP untuk acara The State of Clamour (${admin.dateLabel}). Mohon informasinya. Terima kasih!`;
    const url = `https://wa.me/${admin.phone}?text=${encodeURIComponent(msg)}`;
    onToast(`Menghubungi ${admin.name}...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="reservasi-page-container">
      {/* Header Cluster */}
      <header className="reservasi-header-cluster">
        <div className="reservasi-eyebrow-pill">
          <Crown size={14} className="text-gold-antique" />
          <span>VIP HOSPITALITY &amp; BOTTLE SERVICE // MIZU COMMONROOM</span>
        </div>
        <h1 className="reservasi-main-title">
          RESERVASI MEJA &amp; SOFA PARTY
        </h1>
        <p className="reservasi-subtitle-desc">
          Nikmati malam megah <strong>The State of Clamour</strong> (30 &amp; 31 Okt 2026) dengan kenyamanan sofa privat, dedicated personal butler, serta paket botol minuman premium terkurasi.
        </p>
      </header>

      {/* Day Switcher Tab Cluster */}
      <section className="reservasi-day-switcher" aria-label="Pilih Hari Acara">
        <div
          className={`day-tab-card ${selectedDay === 'day-1' ? 'is-active' : ''}`}
          onClick={() => setSelectedDay('day-1')}
          role="button"
          tabIndex={0}
        >
          <span className="day-tab-badge">NIGHT 01 // 30 OKTOBER 2026</span>
          <h2 className="day-tab-title">ADMIN RSVP DAY 1</h2>
          <span className="day-tab-meta">Gates Unsealed 20:00 WIB</span>
          <div className="day-tab-admin-duty">
            <MessageCircle size={13} />
            <span>ADMIN RSVP DAY 1: {ADMIN_DAY1.displayPhone}</span>
          </div>
        </div>

        <div
          className={`day-tab-card ${selectedDay === 'day-2' ? 'is-active' : ''}`}
          onClick={() => setSelectedDay('day-2')}
          role="button"
          tabIndex={0}
        >
          <span className="day-tab-badge">NIGHT 02 // 31 OKTOBER 2026</span>
          <h2 className="day-tab-title">ADMIN RSVP DAY 2</h2>
          <span className="day-tab-meta">Gates Unsealed 20:00 WIB</span>
          <div className="day-tab-admin-duty">
            <MessageCircle size={13} />
            <span>ADMIN RSVP DAY 2: {ADMIN_DAY2.displayPhone}</span>
          </div>
        </div>
      </section>

      {/* Admin Duty Information Banner */}
      <aside className="admin-duty-banner">
        <div className="admin-duty-info">
          <div className="admin-duty-icon">
            <MessageCircle size={20} />
          </div>
          <div className="admin-duty-text">
            <span>Admin Bertugas Saat Ini: <strong>{activeAdmin.name}</strong> ({activeAdmin.displayPhone})</span>
            <br />
            <small style={{ color: 'var(--color-dim)' }}>
              *Reservasi Day 1 &amp; Day 2 dikelola oleh kontak admin terpisah agar konfirmasi nomor meja berlangsung instan.
            </small>
          </div>
        </div>

        <button
          type="button"
          className="admin-fast-chat-btn"
          onClick={() => handleFastGeneralInquiry(selectedDay)}
        >
          <MessageCircle size={15} />
          <span>TANYA CEPAT ADMIN {selectedDay === 'day-1' ? 'DAY 1' : 'DAY 2'}</span>
        </button>
      </aside>

      {/* Interactive Quick WhatsApp Reservation Form Widget */}
      <section id="reservasi-widget-anchor" className="reservasi-interactive-widget">
        <div className="widget-title-cluster">
          <h2 className="widget-title">FORMULIR CEPAT RESERVASI WHATSAPP</h2>
          <p className="widget-desc">
            Pilih paket dan isi data di bawah. Pesan akan terformat otomatis dan diteruskan langsung ke WhatsApp <strong>{activeAdmin.name}</strong>.
          </p>
        </div>

        <div className="widget-form-grid">
          {/* Pilihan Hari */}
          <div className="form-field-group">
            <label className="form-field-label">Hari Acara</label>
            <select
              className="form-field-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as 'day-1' | 'day-2')}
            >
              <option value="day-1">Day 1 (Jumat, 30 Okt 2026 - Swear In Continental)</option>
              <option value="day-2">Day 2 (Sabtu, 31 Okt 2026 - The Under-Vault)</option>
            </select>
          </div>

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
                  {pkg.name} ({selectedDay === 'day-1' ? pkg.formattedMinSpendDay1 : pkg.formattedMinSpendDay2})
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
              placeholder="Contoh: Request brand minuman tertentu, perayaan ulang tahun, dll"
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
      </section>

      {/* Package Catalog Grid */}
      <section className="reservasi-catalog-section">
        <div className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span>KATALOG LENGKAP PAKET MEJA &amp; SOFA SANCTUARY</span>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.86rem', marginBottom: '2.5rem' }}>
          Harga minimum spend berlaku untuk <strong>{selectedDay === 'day-1' ? 'Day 1 (Jumat, 30 Okt)' : 'Day 2 (Sabtu, 31 Okt)'}</strong>.
        </p>

        <div className="packages-catalog-grid">
          {reservationPackages.map(pkg => {
            const isSelected = pkg.id === selectedPackageId;
            const minSpend = selectedDay === 'day-1' ? pkg.formattedMinSpendDay1 : pkg.formattedMinSpendDay2;

            return (
              <article
                key={pkg.id}
                className={`package-card ${pkg.isPopular ? 'is-popular' : ''}`}
                style={isSelected ? { borderColor: 'var(--color-gold-antique)', background: 'rgba(23, 28, 38, 0.95)' } : {}}
              >
                {pkg.badgeLabel && (
                  <span className="package-badge-tag">{pkg.badgeLabel}</span>
                )}

                <span className="package-zone-header">{pkg.zoneCode} // {pkg.zoneName}</span>
                <h3 className="package-title">{pkg.name}</h3>
                <p className="package-tagline">{pkg.tagline}</p>

                <div className="package-price-box">
                  <div className="price-box-label">MINIMUM SPEND ({selectedDay === 'day-1' ? 'DAY 1' : 'DAY 2'})</div>
                  <div className="price-box-amount">{minSpend}</div>
                  <div className="price-box-capacity">
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Kapasitas: <strong>{pkg.capacityText}</strong>
                  </div>
                </div>

                <ul className="package-inclusions-list">
                  {pkg.inclusions.map((inc, idx) => (
                    <li key={idx}>{inc}</li>
                  ))}
                </ul>

                <div className="package-card-action">
                  <button
                    type="button"
                    className="package-select-btn btn-press"
                    onClick={() => handleSelectPackageCard(pkg.id)}
                  >
                    <span>{isSelected ? '✓ PAKET DIPILIH' : 'PILIH PAKET INI →'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA & Cross Links */}
      <section className="reservasi-footer-banner">
        <h2 className="reservasi-banner-title">INGIN MELIHAT POSISI SOFA TERLEBIH DAHULU?</h2>
        <p className="reservasi-banner-desc">
          Buka denah arsitektur interaktif Mizu Commonroom untuk melihat letak meja VVIP, balkon Mezzanine, dan posisi panggung utama.
        </p>

        <div className="reservasi-banner-actions">
          <button
            type="button"
            className="denah-primary-action btn-press"
            onClick={onNavigateToDenah}
          >
            LIHAT DENAH LOKASI MEJA →
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
export default ReservasiPage;
