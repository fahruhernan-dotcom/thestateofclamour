import React, { useState, useEffect, useRef } from 'react';
import { Check, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Default to the first ticket on mobile
  const targetInitial = 0;
  const [activeIndex, setActiveIndex] = useState(targetInitial);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  // Center on Presale 01 immediately on initial mount (horizontal carousel only, never scrolls the window)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || tickets.length === 0) return;

    const centerTarget = () => {
      const targetCard = el.children[targetInitial] as HTMLElement | undefined;
      if (targetCard) {
        const targetLeft = targetCard.offsetLeft - (el.clientWidth - targetCard.clientWidth) / 2;
        el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'instant' });
      }
    };

    // Re-run after layout/fonts settle so the recommended card is reliably centered
    const raf = requestAnimationFrame(centerTarget);
    const timer = setTimeout(centerTarget, 60);
    const timer2 = setTimeout(centerTarget, 350);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [targetInitial, tickets.length]);

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el || el.children.length === 0) return;

    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      if (!child) continue;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(scrollCenter - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  const scrollToCard = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      const targetLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
      el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      setActiveIndex(idx);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(tickets.length - 1, activeIndex + 1);
    scrollToCard(nextIdx);
  };

  return (
    <section id="the-passage" ref={sectionRef} className="tickets-mobile-section" aria-label="Tiket Masuk The State of Clamour">
      {/* Mobile Cathedral Atmospheric Backdrop */}
      <div className="passage-mobile-cathedral-backdrop" aria-hidden="true">
        <picture>
          <source
            srcSet="/assets/cathedral_passage_mobile.webp"
            type="image/webp"
          />
          <img
            src="/assets/cathedral_passage_mobile.png"
            alt=""
            className="passage-mobile-cathedral-img"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="passage-mobile-cathedral-overlay" />
      </div>

      <div className={`tickets-mobile-header ${isRevealed ? 'is-revealed' : ''}`}>
        <span className="tickets-mobile-eyebrow">THE THRESHOLD</span>
        <h2 className="tickets-mobile-headline">THE PASSAGE</h2>
        <p className="tickets-mobile-tagline">
          Entry begins here.
        </p>

        <div className="tickets-mobile-hairline-draw" aria-hidden="true" />

        <p className="tickets-mobile-subtext">
          All passes include verified RFID access to the venue. Select your tier below.
        </p>
      </div>

      {/* Horizontal Swipeable Cards Deck (Centered on Presale 01 by default) */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className={`tickets-mobile-deck-carousel ${isRevealed ? 'is-revealed' : ''}`}
      >
        {tickets.map((ticket, cardIdx) => {
          const isSoldOut = ticket.status === 'sold_out';
          const isActive = ticket.status === 'active';
          const isHighlighted = highlightedTicketId === ticket.id;
          const isProtagonist = false;

          return (
            <article
              key={ticket.id}
              className={`ticket-mobile-card ${cardIdx === activeIndex ? 'is-focused' : ''} ${isProtagonist ? 'is-protagonist' : ''} ${ticket.id === 'tkt-vip' ? 'is-vip' : ''} ${isActive ? 'is-active-tier' : ''} ${isSoldOut ? 'is-sold-out' : ''} ${isHighlighted ? 'is-spotlighted' : ''}`}
            >
              {/* Protagonist Crown Ribbon */}
              {isProtagonist && (
                <div className="ticket-mobile-protagonist-ribbon">
                  <span>★ RECOMMENDED TIER</span>
                </div>
              )}

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
                  <span className={`ticket-mobile-category ${isProtagonist ? 'is-protagonist-cat' : ''} ${ticket.id === 'tkt-vip' ? 'is-vip-cat' : ''}`}>
                    {ticket.category}
                  </span>
                  {!isSoldOut && (ticket.quota != null || ticket.badgeLabel) && (
                    <span className="live-allocation-pulse-badge">
                      <span className="allocation-pulse-dot" />
                      <span>{ticket.quota != null ? `LIMITED · ${ticket.quota} SLOTS` : ticket.badgeLabel?.toUpperCase()}</span>
                    </span>
                  )}
                  {ticket.id === 'tkt-vip' && (
                    <span className="live-allocation-pulse-badge vip-pill">
                      <span className="allocation-pulse-dot subtle" />
                      <span>EXCLUSIVE</span>
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="ticket-mobile-soldout-badge">
                      EXHAUSTED
                    </span>
                  )}
                </div>

                <h3 className="ticket-mobile-title">{ticket.name}</h3>

                <div className="ticket-mobile-divider" />

                <div className="ticket-mobile-price">
                  <span className="ticket-mobile-price-curr">Rp</span>
                  <span className="ticket-mobile-price-val">{ticket.price.toLocaleString('id-ID')}</span>
                </div>

                <div className="ticket-mobile-perks-list">
                  {ticket.perks.map((perk, i) => (
                    <div key={i} className="ticket-mobile-perk-item">
                      <Check
                        size={13}
                        style={{
                          flexShrink: 0,
                          marginTop: '2px',
                          color: isSoldOut ? 'var(--color-dim)' : isProtagonist ? 'var(--color-crimson)' : 'var(--color-gold-antique)',
                        }}
                      />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ticket-mobile-card-bottom">
                {isSoldOut ? (
                  <button
                    type="button"
                    disabled
                    className="ticket-mobile-action-btn is-disabled"
                  >
                    CAPACITY REACHED
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckout(ticket)}
                    className={`ticket-mobile-action-btn ${isProtagonist ? 'is-protagonist-cta' : ''} ${ticket.id === 'tkt-vip' ? 'is-vip-cta' : ''}`}
                  >
                    <span>{ticket.id === 'tkt-vip' ? 'RESERVE VIP TABLE →' : 'GET TICKETS →'}</span>
                  </button>
                )}

                <div className="ticket-mobile-auth-guarantee">
                  <ShieldCheck size={11} style={{ color: 'var(--color-gold-antique)' }} />
                  <span>OFFICIAL VERIFIED RFID PASS</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile Deck Pagination & Navigation Bar */}
      <div className="tickets-mobile-deck-controls">
        <div className="tickets-mobile-counter-row">
          <button
            type="button"
            className="tickets-mobile-nav-arrow"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous Tier"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="tickets-mobile-deck-dots">
            {tickets.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                className={`tickets-mobile-deck-dot ${activeIndex === idx ? 'is-active' : ''}`}
                onClick={() => scrollToCard(idx)}
                aria-label={`Lihat ${t.name}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="tickets-mobile-nav-arrow"
            onClick={handleNext}
            disabled={activeIndex === tickets.length - 1}
            aria-label="Next Tier"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="tickets-mobile-status-text">
          <span className="tickets-mobile-step-pill">{activeIndex + 1} / {tickets.length}</span>
          <span className="tickets-mobile-tier-name">{tickets[activeIndex]?.name}</span>
        </div>
      </div>
    </section>
  );
};

export default TicketSectionMobile;
