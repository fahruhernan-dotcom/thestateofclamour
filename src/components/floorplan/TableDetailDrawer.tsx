import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TableSpot, TableStatus } from '../../types/tableTypes';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../../data/reservationData';
import { X, Lock, CheckCircle2, Users, MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
  useEffect(() => {
    if (!spot) return;

    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [spot, onClose]);

  if (!spot) return null;

  const isAvailable = status === 'available';
  const minSpend = day === 'day-1' ? spot.formattedMinSpendDay1 : spot.formattedMinSpendDay2;
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;

  const handleWhatsAppBooking = () => {
    if (!isAvailable) return;

    if (onSelectForBooking) {
      onSelectForBooking(spot);
    }

    const venueName = spot.venue === 'tetra' ? 'Tetra Solo' : 'Mizu Commonroom';
    const dayName = day === 'day-1' ? 'Day 1 (30 Okt)' : 'Day 2 (31 Okt)';
    const message = `Halo ${admin.name}, saya ingin reservasi meja *${spot.code}* di *${venueName}* (${spot.name}) untuk The State of Clamour: ${dayName}.\n\n• Minimum Charge: ${minSpend}\n• Booking Fee: ${spot.formattedBookingFee || '-'}\n• Kapasitas: ${spot.capacityText} (${spot.complementTickets || 2} Tiket Masuk)\n\nMohon konfirmasi ketersediaan meja untuk pembayaran Booking Fee. Terima kasih!`;
    const waUrl = `https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const venueLabel = spot.venue === 'tetra' ? 'TETRA SOLO' : 'MIZU COMMONROOM';

  return createPortal(
    <TooltipProvider>
      <div className="table-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="table-drawer-panel" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="drawer-header">
            <div className="drawer-title-cluster">
              <div className="drawer-meta-badges">
                <span className="badge-floor">{venueLabel}</span>
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

            <Tooltip>
              <TooltipTrigger
                type="button"
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Tutup Detail Meja"
              >
                <X size={16} strokeWidth={2.4} />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <span>Tutup</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded ml-1.5 border border-white/15">Esc</kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Details Grid */}
          <div className="drawer-details-grid">
            <div className="detail-card">
              <span className="detail-label">Kapasitas &amp; Tiket</span>
              <span className="detail-value flex items-center gap-1.5">
                <Users size={14} className="text-[#a6a4a0]" /> {spot.capacityText} ({spot.complementTickets || 2} Tiket)
              </span>
            </div>

            <div className="detail-card">
              <span className="detail-label">Minimum Charge ({day === 'day-1' ? 'Day 1' : 'Day 2'})</span>
              <span className="detail-value gold">{minSpend}</span>
            </div>

            {spot.formattedBookingFee && (
              <div className="detail-card" style={{ gridColumn: 'span 2' }}>
                <span className="detail-label">Booking Fee (Kuncian Meja)</span>
                <span className="detail-value" style={{ color: '#ffffff' }}>
                  <strong>{spot.formattedBookingFee}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#8e8d8a', marginLeft: '8px' }}>
                    (Transfer ke BCA: 0374541630 a/n M. Ferdian Wahyu)
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-[#a6a4a0] leading-relaxed">
            {spot.description}
          </p>

          {/* Ketentuan Resmi Sesuai Guide Book */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.7rem 0.9rem', fontSize: '0.72rem', color: '#9e9ea0', lineHeight: '1.45' }}>
            💡 <strong style={{ color: '#e5e2dc' }}>Ketentuan:</strong> Booking Fee mengunci meja dan sudah termasuk {spot.complementTickets || 2} tiket complimentary. Minimum charge diselesaikan secara terpisah di lokasi acara.
          </div>

          {/* Action Button */}
          {isAvailable ? (
            <button
              type="button"
              className="drawer-cta-action is-available"
              onClick={handleWhatsAppBooking}
            >
              <MessageCircle size={17} />
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
    </TooltipProvider>,
    document.body
  );
};
