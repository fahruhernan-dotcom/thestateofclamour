import React from 'react';
import { Check, ShieldCheck, Flame } from 'lucide-react';
import { TicketTier } from '../types';

interface Props {
  tickets: TicketTier[];
  highlightedTicketId?: string | null;
  onCheckout: (ticket: TicketTier) => void;
}

export const TicketSection: React.FC<Props> = ({ tickets, highlightedTicketId, onCheckout }) => {
  const formatIDR = (val: number) => {
    return 'Rp' + val.toLocaleString('id-ID');
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    const y = `${((e.clientY - rect.top) / rect.height) * 100}%`;
    card.style.setProperty('--foil-x', x);
    card.style.setProperty('--foil-y', y);
  };

  return (
    <section id="the-passage" className="cinematic-section">
      <h2 className="section-headline">
        THE PASSAGE
      </h2>

      <p className="section-subheadline">
        Official passes into the nocturnal assembly.
      </p>

      <p className="section-body-text">
        All passes include verified RFID access to the venue. Early tiers unlock priority entry lanes. Select your tier below.
      </p>

      <div className="passage-matrix-grid">
        {tickets.map((ticket) => {
          const isSoldOut = ticket.status === 'sold_out';
          const isActive = ticket.status === 'active';
          const isHighlighted = highlightedTicketId === ticket.id;

          return (
            <article
              key={ticket.id}
              onMouseMove={handleCardMouseMove}
              className={`admission-document-card ${isActive ? 'is-active-tier' : ''} ${isSoldOut ? 'is-sold-out' : ''} ${isHighlighted ? 'is-spotlighted' : ''}`}
            >
              {/* Foil Specular Glint Layer */}
              <div className="card-foil-specular-layer" aria-hidden="true" />

              {/* Faint Embossed Watermark Admission Seal */}
              <div className="admission-seal-watermark" aria-hidden="true">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M50 15 L53 23 L62 23 L55 28 L57 36 L50 31 L43 36 L45 28 L38 23 L47 23 Z" fill="currentColor" opacity="0.6" />
                  <text x="50" y="52" textAnchor="middle" fontSize="6.5" fontFamily="Cinzel" fill="currentColor" letterSpacing="0.2em">CLAMOUR</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="4.2" fontFamily="Inter" fill="currentColor" letterSpacing="0.15em">ADMIT ONE</text>
                  <text x="50" y="68" textAnchor="middle" fontSize="3.8" fontFamily="Inter" fill="currentColor" letterSpacing="0.1em">OCT 2026</text>
                </svg>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <p className="admission-category-tag">
                    {ticket.category}
                  </p>
                  {isActive && (
                    <span className="live-allocation-pulse-badge">
                      <span className="pulse-dot" />
                      <Flame size={12} style={{ color: 'var(--color-gold-antique)' }} />
                      <span>84% ALLOCATED</span>
                    </span>
                  )}
                </div>

                <h3 className="admission-tier-title">
                  {ticket.name}
                </h3>

                <div className="admission-hairline-sep" />

                <p className="admission-price-display">
                  {formatIDR(ticket.price)}
                </p>

                <div className="admission-perks-list">
                  {ticket.perks.map((perk, i) => (
                    <div key={i} className="admission-perk-item">
                      <Check
                        size={14}
                        style={{
                          flexShrink: 0,
                          marginTop: '3px',
                          color: isSoldOut ? 'var(--color-dim)' : 'var(--color-gold-antique)'
                        }}
                      />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                {isSoldOut ? (
                  <button
                    type="button"
                    disabled
                    className="admission-action-btn is-disabled"
                  >
                    CAPACITY REACHED
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckout(ticket)}
                    className="admission-action-btn btn-press"
                  >
                    <span>GET TICKETS →</span>
                  </button>
                )}

                <div className="admission-auth-guarantee">
                  <ShieldCheck size={12} style={{ color: 'var(--color-gold-antique)', flexShrink: 0 }} />
                  <span>OFFICIAL VERIFIED PASS</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
