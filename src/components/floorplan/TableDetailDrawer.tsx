import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TableSpot, TableStatus } from '../../types/tableTypes';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../../data/reservationData';
import { HIDE_TABLE_AVAILABILITY_STATUS } from '../../data/floorPlanData';
import { X, Lock, CheckCircle2, Users, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const isAvailable = HIDE_TABLE_AVAILABILITY_STATUS ? true : status === 'available';
  const minSpend = day === 'day-1' ? spot.formattedMinSpendDay1 : spot.formattedMinSpendDay2;
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;

  const handleWhatsAppBooking = () => {
    if (!isAvailable) return;

    if (onSelectForBooking) {
      onSelectForBooking(spot);
    }

    const venueName = spot.venue === 'tetra' ? 'Tetra Solo' : 'Mizu Commonroom';
    const dayName = day === 'day-1' ? 'Day 1 (30 Okt)' : 'Day 2 (31 Okt)';
    const message = `Halo ${admin.name}, saya ingin reservasi meja *${spot.code}* di *${venueName}* (${spot.name}) untuk The State of Clamor: ${dayName}.\n\n• Minimum Charge: ${minSpend}\n• Booking Fee: ${spot.formattedBookingFee || '-'}\n• Kapasitas: ${spot.capacityText} (${spot.complementTickets || 2} Tiket Masuk)\n\nMohon konfirmasi ketersediaan meja untuk pembayaran Booking Fee. Terima kasih!`;
    const waUrl = `https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('0374541630');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const venueLabel = spot.venue === 'tetra' ? 'TETRA SOLO' : 'MIZU COMMONROOM';

  return createPortal(
    <TooltipProvider>
      <div className="table-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="table-drawer-panel" onClick={e => e.stopPropagation()}>
          {/* iOS Grabber Handle for Mobile Sheets */}
          <div className="drawer-grabber" />

          {/* Header */}
          <div className="drawer-header">
            <div className="drawer-title-cluster">
              <div className="drawer-meta-badges">
                <span className="badge-floor">{venueLabel}</span>
                <span className="badge-zone">{spot.zoneTag}</span>
                {HIDE_TABLE_AVAILABILITY_STATUS ? (
                  <span className="badge-status is-available">
                    <Sparkles size={11} /> RESERVASI VIP
                  </span>
                ) : (
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
                )}
              </div>
              <div className="drawer-title-row">
                <h2 className="drawer-table-code">{spot.code}</h2>
                <span className="drawer-title-sep">·</span>
                <span className="drawer-table-name">{spot.name}</span>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger
                type="button"
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Tutup Detail Meja"
              >
                <X size={15} strokeWidth={1.8} />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <span>Tutup</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded ml-1.5 border border-white/15">Esc</kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* iOS Inset Grouped Specs Card */}
          <div className="drawer-specs-grouped">
            <div className="drawer-spec-row">
              <div className="spec-label-cluster">
                <Users size={13} className="spec-icon" />
                <span className="spec-label">Kapasitas Tamu</span>
              </div>
              <span className="spec-value">{spot.capacityText} ({spot.complementTickets || 2} Tiket)</span>
            </div>

            <div className="drawer-spec-row">
              <div className="spec-label-cluster">
                <span className="spec-label">Min. Charge ({day === 'day-1' ? 'Day 1' : 'Day 2'})</span>
              </div>
              <span className="spec-value spec-value-strong">{minSpend}</span>
            </div>

            {spot.formattedBookingFee && (
              <div className="drawer-spec-row">
                <div className="spec-label-cluster">
                  <span className="spec-label">Booking Fee (Kuncian)</span>
                </div>
                <span className="spec-value-badge">{spot.formattedBookingFee}</span>
              </div>
            )}

            {spot.formattedBookingFee && (
              <div className="drawer-bank-row">
                <div className="bank-info-cluster">
                  <span className="bank-tag">Rekening Resmi</span>
                  <span className="bank-account">BCA <strong>0374541630</strong> a/n M. Ferdian Wahyu</span>
                </div>
                <button
                  type="button"
                  className="bank-copy-btn"
                  onClick={handleCopyAccount}
                  title="Salin Nomor Rekening BCA"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Tersalin' : 'Salin Rek'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {spot.description && (
            <p className="drawer-description-text">
              {spot.description}
            </p>
          )}

          {/* Ketentuan Resmi */}
          <div className="drawer-terms-card">
            <span className="terms-icon">💡</span>
            <p className="terms-text">
              <strong>Ketentuan:</strong> Booking Fee mengunci meja &amp; termasuk {spot.complementTickets || 2} tiket complimentary. Sisa minimum charge diselesaikan di lokasi acara.
            </p>
          </div>

          {/* Action Button */}
          {isAvailable ? (
            <button
              type="button"
              className="drawer-cta-action is-available"
              onClick={handleWhatsAppBooking}
            >
              <MessageCircle size={16} />
              <span>Reservasi {spot.code} via WhatsApp</span>
            </button>
          ) : (
            <div className="drawer-cta-action is-occupied">
              <Lock size={15} />
              <span>Meja Ini Telah Terisi / Reserved</span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>,
    document.body
  );
};
