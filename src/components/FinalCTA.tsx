import React, { useRef, useState } from 'react';
import { Sparkles, MessageCircle, X, ChevronRight } from 'lucide-react';
import { ADMIN_DAY1, ADMIN_DAY2, buildAdminGeneralInquiryUrl } from '../data/reservationData';

interface Props {
  onTicketClick?: () => void;
  onToast?: (msg: string) => void;
}

export const FinalCTA: React.FC<Props> = ({ onToast }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = `translate(0px, 0px)`;
  };

  const handleOpenWhatsApp = (day: 'day-1' | 'day-2') => {
    const inquiry = buildAdminGeneralInquiryUrl(day);
    if (onToast) {
      onToast(`Menghubungi ${inquiry.admin.name}...`);
    }
    window.open(inquiry.url, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <section className="final-gateway-section">
      {/* Volumetric Red Portal Light Beam */}
      <div className="final-volumetric-beam-glow" aria-hidden="true" />
      <div className="final-volumetric-beam-core" aria-hidden="true" />

      <div className="final-gateway-panel">
        <p className="section-eyebrow">
          <Sparkles size={13} style={{ color: 'var(--color-gold-antique)' }} />
          <span>30 — 31 OCTOBER 2026 // MIZU COMMONROOM</span>
        </p>

        <h2 className="section-headline" style={{ marginBottom: '1.25rem' }}>
          THE DOORS ARE OPENING
        </h2>

        <p className="section-subheadline" style={{ marginBottom: '2.5rem' }}>
          Two nights of sound, movement, and monumental assembly.
        </p>

        {/* Primary Enter / Inquire Trigger */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            ref={btnRef}
            type="button"
            onClick={() => setIsModalOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="btn-enter-state btn-press"
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            <span>KONSULTASI &amp; CHAT ADMIN RESMI</span>
          </button>
        </div>

        {/* Quick Dual Admin WhatsApp Pills */}
        <div className="final-admin-dual-actions">
          <button
            type="button"
            className="btn-admin-wa-pill"
            onClick={() => handleOpenWhatsApp('day-1')}
            title={`Hubungi Admin Day 1: ${ADMIN_DAY1.displayPhone}`}
          >
            <span className="wa-pill-dot" />
            <MessageCircle size={14} className="text-[#25d366]" />
            <span>DAY 01 ADMIN: {ADMIN_DAY1.displayPhone}</span>
          </button>

          <button
            type="button"
            className="btn-admin-wa-pill is-day2"
            onClick={() => handleOpenWhatsApp('day-2')}
            title={`Hubungi Admin Day 2: ${ADMIN_DAY2.displayPhone}`}
          >
            <span className="wa-pill-dot" />
            <MessageCircle size={14} className="text-[#25d366]" />
            <span>DAY 02 ADMIN: {ADMIN_DAY2.displayPhone}</span>
          </button>
        </div>
      </div>

      {/* Admin Contact Selection Modal */}
      {isModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="admin-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">HUBUNGI ADMIN RESMI ACARA</h3>
                <p className="admin-modal-subtitle">
                  Pilih hari acara untuk konsultasi tiket, ketersediaan meja/sofa, atau informasi umum The State of Clamour.
                </p>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-cards-list">
              {/* Day 1 Admin Card */}
              <div
                className="admin-select-card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenWhatsApp('day-1')}
              >
                <div className="admin-card-info">
                  <span className="admin-card-day-badge">NIGHT 01 // JUMAT, 30 OKT 2026</span>
                  <div className="admin-card-name">{ADMIN_DAY1.name}</div>
                  <div className="admin-card-phone">
                    <MessageCircle size={13} />
                    <span>{ADMIN_DAY1.displayPhone}</span>
                  </div>
                  <span className="text-[11px] text-[#a6a4a0] mt-1">
                    Swear In Continental · Live Hip-Hop &amp; Alternative Energy
                  </span>
                </div>

                <div className="admin-card-cta-btn">
                  <span>Chat Day 1</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Day 2 Admin Card */}
              <div
                className="admin-select-card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenWhatsApp('day-2')}
              >
                <div className="admin-card-info">
                  <span className="admin-card-day-badge">NIGHT 02 // SABTU, 31 OKT 2026</span>
                  <div className="admin-card-name">{ADMIN_DAY2.name}</div>
                  <div className="admin-card-phone">
                    <MessageCircle size={13} />
                    <span>{ADMIN_DAY2.displayPhone}</span>
                  </div>
                  <span className="text-[11px] text-[#a6a4a0] mt-1">
                    Techno Under-Vault · Modular &amp; Industrial Sub-Bass
                  </span>
                </div>

                <div className="admin-card-cta-btn">
                  <span>Chat Day 2</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinalCTA;
