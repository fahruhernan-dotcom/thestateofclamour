import React from 'react';
import { TableSpot, TableStatus } from '../../types/tableTypes';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../../data/reservationData';
import { X, Lock, CheckCircle2, Users, Crown, MessageCircle } from 'lucide-react';

interface Props {
  spot: TableSpot | null;
  status: TableStatus;
  day: 'day-1' | 'day-2';
  onClose: () => void;
  onSelectForBooking?: (spot: TableSpot) => void;
}

export const TableDetailDrawer: React.FC<Props> = ({
  spot,
  status,
  day,
  onClose,
  onSelectForBooking
}) => {
  if (!spot) return null;

  const isAvailable = status === 'available';
  const minSpend = day === 'day-1' ? spot.formattedMinSpendDay1 : spot.formattedMinSpendDay2;
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;

  const handleWhatsAppBooking = () => {
    if (!isAvailable) return;

    if (onSelectForBooking) {
      onSelectForBooking(spot);
    }

    const eventTheme = day === 'day-1' ? 'Swear in Continental' : 'The Under-Vault';
    const message = `Halo ${admin.name}, saya ingin reservasi meja *${spot.code}* di *Lantai ${spot.floor}* (${spot.name}) untuk The State of Clamour: ${eventTheme} (${admin.dateLabel}). Mohon konfirmasi ketersediaannya. Terima kasih!`;
    const waUrl = `https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="table-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="table-drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-cluster">
            <div className="drawer-meta-badges">
              <span className="badge-floor">LANTAI {spot.floor}</span>
              <span className="badge-floor">{spot.zoneTag}</span>
              <span className={`badge-status ${isAvailable ? 'is-available' : 'is-occupied'}`}>
                {isAvailable ? (
                  <>
                    <CheckCircle2 size={11} /> TERSEDIA
                  </>
                ) : (
                  <>
                    <Lock size={11} /> TERISI / BOOKED
                  </>
                )}
              </span>
            </div>
            <h2 className="drawer-table-code">{spot.code} // {spot.name}</h2>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Tutup Detail"
          >
            <X size={18} />
          </button>
        </div>

        {/* Details Grid */}
        <div className="drawer-details-grid">
          <div className="detail-card">
            <span className="detail-label">Kapasitas Tamu</span>
            <span className="detail-value flex items-center gap-1">
              <Users size={14} className="text-gold-antique" /> {spot.capacityText}
            </span>
          </div>

          <div className="detail-card">
            <span className="detail-label">Minimum Spend ({day === 'day-1' ? 'Day 1' : 'Day 2'})</span>
            <span className="detail-value gold">{minSpend}</span>
          </div>
        </div>

        {/* Description & Inclusions */}
        <p className="text-xs text-[#a6a4a0] leading-relaxed">
          {spot.description}
        </p>

        {spot.inclusions && spot.inclusions.length > 0 && (
          <div className="drawer-inclusions-list">
            <span className="detail-label">Inklusi Eksklusif:</span>
            {spot.inclusions.map((item, idx) => (
              <div key={idx} className="inclusion-item">
                <Crown size={12} className="text-[#c5a869] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {isAvailable ? (
          <button
            type="button"
            className="drawer-cta-action is-available"
            onClick={handleWhatsAppBooking}
          >
            <MessageCircle size={18} />
            <span>Reservasi {spot.code} via WhatsApp</span>
          </button>
        ) : (
          <div className="drawer-cta-action is-occupied">
            <Lock size={16} />
            <span>Meja Ini Telah Terisi / Reserved</span>
          </div>
        )}
      </div>
    </div>
  );
};
