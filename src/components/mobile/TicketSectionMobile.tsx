import React from 'react';
import { Check, ShieldCheck, Flame } from 'lucide-react';
import { TicketTier } from '../../types';

interface Props {
  tickets: TicketTier[];
  highlightedTicketId?: string | null;
  onCheckout: (ticket: TicketTier) => void;
}

export const TicketSectionMobile: React.FC<Props> = ({
  tickets,
  highlightedTicketId,
  onCheckout,
}) => {
  const formatIDR = (val: number) => {
    return 'Rp' + val.toLocaleString('id-ID');
  };

  return (
    <section id="the-passage" className="tickets-mobile-section" aria-label="Tiket Masuk The State of Clamour">
      <div className="tickets-mobile-header">
        <span className="tickets-mobile-eyebrow">THE PASSAGE</span>
        <h2 className="tickets-mobile-headline">ADMISSION TICKETS</h2>
        <p className="tickets-mobile-subtext">
          Official passes into the nocturnal assembly.
        </p>
      </div>

      <div className="tickets-mobile-cards-stack">
        {tickets.map((ticket) => {
          const isSoldOut = ticket.status === 'sold_out';
          const isActive = ticket.status === 'active';
          const isHighlighted = highlightedTicketId === ticket.id;

          return (
            <article
              key={ticket.id}
              className={`ticket-mobile-card ${isActive ? 'is-active-tier' : ''} ${isSoldOut ? 'is-sold-out' : ''} ${isHighlighted ? 'is-spotlighted' : ''}`}
            >
              {/* Embossed Watermark Seal */}
              <div className="ticket-mobile-seal-watermark" aria-hidden="true">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="0.8" />
                  <text x="50" y="52" textAnchor="middle" fontSize="6.5" fontFamily="Cinzel" fill="currentColor" letterSpacing="0.2em">CLAMOUR</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="4.2" fontFamily="Inter" fill="currentColor" letterSpacing="0.15em">ADMIT ONE</text>
                </svg>
              </div>

              <div className="ticket-mobile-card-top">
                <div className="ticket-mobile-tag-row">
                  <span className="ticket-mobile-category">{ticket.category}</span>
                  {isActive && (
                    <span className="ticket-mobile-status-badge">
                      <Flame size={11} />
                      <span>KUOTA MENIPIS</span>
                    </span>
                  )}
                </div>

                <h3 className="ticket-mobile-title">{ticket.name}</h3>

                <div className="ticket-mobile-divider" />

                <div className="ticket-mobile-price">
                  {formatIDR(ticket.price)}
                </div>

                <div className="ticket-mobile-perks-list">
                  {ticket.perks.map((perk, i) => (
                    <div key={i} className="ticket-mobile-perk-item">
                      <Check
                        size={14}
                        style={{
                          flexShrink: 0,
                          marginTop: '2px',
                          color: isSoldOut ? 'var(--color-dim)' : 'var(--color-gold-antique)',
                        }}
                      />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isSoldOut ? (
                  <button
                    type="button"
                    disabled
                    className="ticket-mobile-action-btn is-disabled"
                  >
                    KUOTA TERCAPAI
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckout(ticket)}
                    className="ticket-mobile-action-btn"
                  >
                    <span>BELI TIKET →</span>
                  </button>
                )}

                <div className="ticket-mobile-auth-guarantee">
                  <ShieldCheck size={12} style={{ color: 'var(--color-gold-antique)' }} />
                  <span>TIKET RESMI TERVERIFIKASI</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TicketSectionMobile;
