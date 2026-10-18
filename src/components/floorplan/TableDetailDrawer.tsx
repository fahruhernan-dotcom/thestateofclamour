import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TableSpot, TableStatus } from '../../types/tableTypes';
import { ADMIN_DAY1, ADMIN_DAY2 } from '../../data/reservationData';
import { HIDE_TABLE_AVAILABILITY_STATUS } from '../../data/floorPlanData';
import {
  X,
  Lock,
  CheckCircle2,
  Users,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Ticket,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
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
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);

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

  // Mobile Sheet Swipe-to-dismiss gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY > 0 && panelRef.current) {
      panelRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null && touchCurrentY.current !== null) {
      const deltaY = touchCurrentY.current - touchStartY.current;
      if (deltaY > 85) {
        onClose();
        return;
      }
    }
    if (panelRef.current) {
      panelRef.current.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
      panelRef.current.style.transform = '';
      setTimeout(() => {
        if (panelRef.current) panelRef.current.style.transition = '';
      }, 280);
    }
    touchStartY.current = null;
    touchCurrentY.current = null;
  };

  if (!spot) return null;

  const isAvailable = HIDE_TABLE_AVAILABILITY_STATUS ? true : status === 'available';
  const minSpend = day === 'day-1' ? spot.formattedMinSpendDay1 : spot.formattedMinSpendDay2;
  const admin = day === 'day-1' ? ADMIN_DAY1 : ADMIN_DAY2;
  const venueLabel = spot.venue === 'tetra' ? 'TETRA SOLO' : 'MIZU COMMONROOM';
  const complementCount = spot.complementTickets || 2;

  const handleWhatsAppBooking = () => {
    if (!isAvailable) return;

    if (onSelectForBooking) {
      onSelectForBooking(spot);
    }

    const venueName = spot.venue === 'tetra' ? 'Tetra Solo' : 'Mizu Commonroom';
    const dayName = day === 'day-1' ? 'Day 1 (30 Okt)' : 'Day 2 (31 Okt)';
    const message = `Halo ${admin.name}, saya ingin reservasi meja *${spot.code}* di *${venueName}* (${spot.name}) untuk The State of Clamor: ${dayName}.\n\n• Minimum Charge: ${minSpend}\n• Booking Fee: ${spot.formattedBookingFee || '-'}\n• Kapasitas: ${spot.capacityText} (${complementCount} Tiket Masuk)\n\nMohon konfirmasi ketersediaan meja untuk pembayaran Booking Fee. Terima kasih!`;
    const waUrl = `https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('0374541630');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return createPortal(
    <TooltipProvider>
      <div className="table-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div
          ref={panelRef}
          className="table-drawer-panel"
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
              <div className="drawer-heading-block">
                <h2 className="drawer-table-code">{spot.code}</h2>
                <p className="drawer-table-name">{spot.name}</p>
              </div>
            </div>

            <Tooltip>
              <TooltipTrigger
                type="button"
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Tutup Detail Meja"
              >
                <X size={16} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                <span>Tutup</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded ml-1.5 border border-white/15">Esc</kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Apple Inset Grouped Card 1: Pricing & Booking Fee */}
          <div className="drawer-pricing-card">
            <div className="pricing-stat-col">
              <span className="pricing-label">Min. Charge ({day === 'day-1' ? 'Day 1' : 'Day 2'})</span>
              <span className="pricing-value-hero">{minSpend}</span>
            </div>
            {spot.formattedBookingFee && (
              <div className="pricing-stat-col has-border-left">
                <span className="pricing-label">Booking Fee</span>
                <span className="pricing-value-fee">{spot.formattedBookingFee}</span>
              </div>
            )}
          </div>

          {/* Apple Inset Grouped Card 2: Table Specifications */}
          <div className="drawer-specs-grouped">
            <div className="drawer-spec-row">
              <div className="spec-label-cluster">
                <Users size={14} className="spec-icon" />
                <span className="spec-label">Kapasitas Tamu</span>
              </div>
              <span className="spec-value">{spot.capacityText}</span>
            </div>

            <div className="drawer-spec-row">
              <div className="spec-label-cluster">
                <Ticket size={14} className="spec-icon spec-icon-accent" />
                <span className="spec-label">Inklusi Tiket Masuk</span>
              </div>
              <span className="spec-value spec-value-highlight">
                {complementCount} Tiket Masuk Gratis
              </span>
            </div>
          </div>

          {/* Apple Inset Grouped Card 3: Official Bank Verification Card */}
          {spot.formattedBookingFee && (
            <div className="drawer-bank-card">
              <div className="bank-header-strip">
                <div className="bank-badge-cluster">
                  <CreditCard size={13} className="text-zinc-400" />
                  <span className="bank-tag-apple">Rekening Resmi Pembayaran</span>
                </div>
                <span className="bank-provider-pill">BCA</span>
              </div>
              <div className="bank-details-row">
                <div className="bank-number-group">
                  <span className="bank-account-number">0374 5416 30</span>
                  <span className="bank-beneficiary-name">a/n M. Ferdian Wahyu</span>
                </div>
                <button
                  type="button"
                  className={`bank-copy-action ${copied ? 'is-copied' : ''}`}
                  onClick={handleCopyAccount}
                  title="Salin Nomor Rekening BCA"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Tersalin' : 'Salin Rek'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Apple Inset Grouped Card 4: Official Terms Guidelines */}
          <div className="drawer-terms-card">
            <div className="terms-icon-wrapper">
              <ShieldCheck size={16} className="terms-icon-svg" />
            </div>
            <p className="terms-text">
              <strong>Ketentuan:</strong> Booking Fee hanya untuk mengunci meja &amp; sudah termasuk <strong>{complementCount} tiket masuk gratis</strong>. Booking Fee <strong>tidak mengurangi nominal Minimum Charge</strong>.
            </p>
          </div>

          {/* Action Button: Tactile WhatsApp CTA */}
          {isAvailable ? (
            <button
              type="button"
              className="drawer-cta-action is-available"
              onClick={handleWhatsAppBooking}
            >
              <div className="cta-icon-bubble">
                <MessageCircle size={18} />
              </div>
              <div className="cta-content-group">
                <span className="cta-main-title">Reservasi {spot.code} via WhatsApp</span>
                <span className="cta-sub-caption">Terhubung langsung dengan Admin {day === 'day-1' ? 'Day 1' : 'Day 2'}</span>
              </div>
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

export default TableDetailDrawer;
