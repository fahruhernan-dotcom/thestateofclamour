import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Instagram } from 'lucide-react';
import '../styles/navbar.css';

export type NavViewMode = 'home' | 'event-night-1' | 'event-night-2' | 'full-dossier' | 'denah' | 'reservasi';

interface Props {
  currentView?: NavViewMode;
  onOpenDossier?: () => void;
  onNavigate?: (view: NavViewMode, hash?: string, scrollTargetId?: string) => void;
}

export const FloatingNavbar: React.FC<Props> = ({
  currentView = 'home',
  onOpenDossier,
  onNavigate
}) => {
  // Track whether navbar is at the top of Section 2 (subtle gradient) or scrolled (frosted glass)
  const [isAtTop, setIsAtTop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (currentView === 'home') {
      const el = typeof document !== 'undefined' ? document.getElementById('lineup') : null;
      if (el) {
        return el.getBoundingClientRect().top > -100;
      }
      return true;
    }
    return window.scrollY <= 30;
  });

  // Track scroll direction & visibility (Section 1 Hero -> hidden, Section 2 -> visible)
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (currentView === 'home') {
      const el = typeof document !== 'undefined' ? document.getElementById('lineup') : null;
      return el ? el.getBoundingClientRect().top <= 140 : false;
    }
    return true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const initialY = window.scrollY;

    if (currentView === 'home') {
      const lineupEl = document.getElementById('lineup');
      if (lineupEl) {
        const rect = lineupEl.getBoundingClientRect();
        if (rect.top > 200) {
          setIsVisible(false);
          setIsAtTop(true);
        } else if (rect.top <= 140 && rect.top > -100) {
          setIsVisible(true);
          setIsAtTop(true);
        } else if (rect.top <= -100) {
          setIsVisible(true);
          setIsAtTop(false);
        }
      } else {
        setIsVisible(false);
        setIsAtTop(true);
      }
    } else {
      setIsVisible(true);
      setIsAtTop(initialY <= 30);
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          if (currentView === 'home') {
            // ========================================================
            // LANDING PAGE (BERANDA) - IDLIX STREAMING CINEMA HEADER:
            // 1. Hero Section 1: 100% clean & hidden
            // 2. Section 2 Headline Arrival: In-place fade-in dissolve (top cinema gradient)
            // 3. Scroll deeper into cards: Silky transition to deep frosted glass sticky header
            // ========================================================
            const lineupEl = document.getElementById('lineup');
            if (lineupEl) {
              const rect = lineupEl.getBoundingClientRect();

              // Still inside Section 1 / Hero (Lineup hasn't arrived yet)
              if (rect.top > 200) {
                setIsVisible(false);
                setIsAtTop(true);
              }
              // Section 2 Headline ("THE GUESTS: When the gates unlock...") -> Fade-in (Top Cinema Gradient)
              else if (rect.top <= 140 && rect.top > -100) {
                setIsVisible(true);
                setIsAtTop(true);
              }
              // Scrolled deeper into Section 2 Lineup & beyond -> Sticky Frosted Glass (Permanent Companion)
              else if (rect.top <= -100) {
                setIsAtTop(false);
                setIsVisible(true);
              }
            } else {
              setIsVisible(false);
              setIsAtTop(true);
            }
          } else {
            // ========================================================
            // SUBPAGES (MALAM I, MALAM II, DENAH, RESERVASI, DOSSIER)
            // ========================================================
            if (currentY <= 30) {
              setIsAtTop(true);
            } else if (currentY > 30) {
              setIsAtTop(false);
            }

            setIsVisible(true);
          }

          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((targetView: NavViewMode, hash = '', scrollTargetId = '') => {
    closeMobileMenu();

    if (onNavigate) {
      onNavigate(targetView, hash, scrollTargetId);
    } else {
      if (hash) window.location.hash = hash;
    }

    if (currentView === 'home' && targetView === 'home' && scrollTargetId) {
      setTimeout(() => {
        const el = document.getElementById(scrollTargetId);
        if (el) {
          if (scrollTargetId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const navbarOffset = window.innerWidth <= 768 ? 76 : 92;
            const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
          }
        }
      }, 50);
    }
  }, [closeMobileMenu, onNavigate, currentView]);

  const handleOpenDossierTab = useCallback(() => {
    closeMobileMenu();
    if (onOpenDossier) {
      setTimeout(() => onOpenDossier(), 80);
    } else if (onNavigate) {
      onNavigate('full-dossier', '#dossier');
    }
  }, [closeMobileMenu, onOpenDossier, onNavigate]);

  // Direct handlers for streaming navigation
  const handleHomeClick = () => handleNavClick('home', '', 'hero');
  const handleNight1Click = () => handleNavClick('event-night-1', '#/event/night-1');
  const handleNight2Click = () => handleNavClick('event-night-2', '#/event/night-2');

  const handleTicketClick = () => {
    if (currentView === 'event-night-1' || currentView === 'event-night-2') {
      const el = document.getElementById('tickets');
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        return;
      }
    }
    handleNavClick('home', '#the-passage', 'the-passage');
  };

  const handleDenahClick = () => {
    if (currentView === 'event-night-1' || currentView === 'event-night-2') {
      const el = document.getElementById('denah');
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        return;
      }
    }
    handleNavClick('event-night-1', '#/event/night-1#denah', 'denah');
  };

  const handleReservasiClick = () => {
    closeMobileMenu();
    if (currentView === 'event-night-1' || currentView === 'event-night-2') {
      const el = document.getElementById('reservasi');
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        return;
      }
    }
    handleNavClick('reservasi', '#/reservasi', 'reservasi');
  };

  return (
    <>
      {/* Morphing Navbar: Flush Top Bar -> Floating Sticky Pill */}
      <header
        className={`cinematic-navbar fixed left-0 right-0 top-0 z-[100] flex justify-center pointer-events-none ${
          isVisible || isMobileMenuOpen ? 'is-visible' : 'is-hidden'
        }`}
      >
        <div
          className={`navbar-capsule-bar pointer-events-auto ${
            isAtTop ? 'is-at-top' : 'is-morphed'
          }`}
        >
          {/* Brand Logo & Home Return */}
          <button
            type="button"
            className="site-logo-action nav-brand-link"
            onClick={handleHomeClick}
            aria-label="Kembali ke Beranda The State of Clamour"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <img
              src="/apple-touch-icon.png"
              alt="Clamour Emblem"
              className="nav-brand-logo-img logo-img"
              width="24"
              height="24"
            />
            <span className="nav-brand-title site-logo-lockup">CLAMOUR</span>
          </button>

          {/* Right Action Cluster: Desktop Nav Links (NIGHT 1 & NIGHT 2) + TICKETS CTA + Mobile Burger */}
          <div className="nav-right-cluster">
            {/* Desktop Navigation Links: Repositioned directly next to TICKETS */}
            <nav className="header-desktop-nav nav-links-cluster" aria-label="Menu">
              {/* NIGHT 1 */}
              <button
                type="button"
                className={`header-nav-link header-nav-text nav-link-item ${
                  currentView === 'event-night-1' ? 'header-nav-link--active active-pill' : ''
                }`}
                onClick={handleNight1Click}
                title="Dossier Night 1"
                style={{ background: 'transparent', cursor: 'pointer' }}
              >
                <span className="nav-roll-inner">
                  <span className="nav-roll-default">NIGHT 1</span>
                  <span className="nav-roll-hover" aria-hidden="true">NIGHT 1</span>
                </span>
              </button>

              <span className="nav-links-dot" aria-hidden="true">·</span>

              {/* NIGHT 2 */}
              <button
                type="button"
                className={`header-nav-link header-nav-text nav-link-item ${
                  currentView === 'event-night-2' ? 'header-nav-link--active active-pill' : ''
                }`}
                onClick={handleNight2Click}
                title="Dossier Night 2"
                style={{ background: 'transparent', cursor: 'pointer' }}
              >
                <span className="nav-roll-inner">
                  <span className="nav-roll-default">NIGHT 2</span>
                  <span className="nav-roll-hover" aria-hidden="true">NIGHT 2</span>
                </span>
              </button>
            </nav>

            {/* Desktop Right CTA Button */}
            <div className="nav-action-desktop-only">
              <button
                type="button"
                className="nav-action-btn btn-press"
                onClick={handleReservasiClick}
                style={{ cursor: 'pointer' }}
                title="Reservasi VIP Meja & Sofa"
              >
                <span className="nav-roll-inner">
                  <span className="nav-roll-default">RESERVE →</span>
                  <span className="nav-roll-hover" aria-hidden="true">RESERVE →</span>
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className={`nav-mobile-toggle header-mobile-menu-trigger ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              <span className="nav-toggle-icon nav-toggle-burger">
                <Menu size={18} strokeWidth={2} />
              </span>
              <span className="nav-toggle-icon nav-toggle-close">
                <X size={18} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Frosted Glass Navigation Drawer */}
      <div
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-drawer-inner">
          {/* Close Header */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand-group">
              <img
                src="/apple-touch-icon.png"
                alt="Clamour Emblem"
                className="mobile-drawer-logo"
                width="24"
                height="24"
              />
              <span className="mobile-drawer-brand">THE STATE OF CLAMOUR</span>
            </div>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMobileMenu}
              aria-label="Tutup menu"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mobile-drawer-links" aria-label="Mobile Navigation">
            <button
              type="button"
              className={`mobile-drawer-link ${currentView === 'home' ? 'is-active' : ''}`}
              onClick={handleHomeClick}
            >
              <span className="mobile-drawer-link-kicker">01</span>
              <span className="mobile-drawer-link-label">BERANDA RESMI</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className={`mobile-drawer-link ${currentView === 'event-night-1' ? 'is-active' : ''}`}
              onClick={handleNight1Click}
            >
              <span className="mobile-drawer-link-kicker">02</span>
              <span className="mobile-drawer-link-label">MALAM I · 30 OKT (SWEAR IN CONTINENTAL)</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className={`mobile-drawer-link ${currentView === 'event-night-2' ? 'is-active' : ''}`}
              onClick={handleNight2Click}
            >
              <span className="mobile-drawer-link-kicker">03</span>
              <span className="mobile-drawer-link-label">MALAM II · 31 OKT (THE UNDER-VAULT)</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={handleTicketClick}
            >
              <span className="mobile-drawer-link-kicker">04</span>
              <span className="mobile-drawer-link-label">TIKET RESMI (ARTATIX)</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={handleDenahClick}
            >
              <span className="mobile-drawer-link-kicker">05</span>
              <span className="mobile-drawer-link-label">DENAH &amp; ORIENTASI VENUE</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={handleReservasiClick}
            >
              <span className="mobile-drawer-link-kicker">06</span>
              <span className="mobile-drawer-link-label">RESERVASI VIP (SOFA &amp; TABLE)</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={handleOpenDossierTab}
            >
              <span className="mobile-drawer-link-kicker">07</span>
              <span className="mobile-drawer-link-label">PANDUAN &amp; FAQ</span>
            </button>
          </nav>

          {/* Bottom CTA & Social Dispatch */}
          <div className="mobile-drawer-bottom">
            <button
              type="button"
              className="mobile-drawer-cta"
              onClick={handleReservasiClick}
            >
              RESERVE VIP SOFA &amp; MEJA →
            </button>

            {/* Official Social Dispatch Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem' }}>
              <a
                href="https://www.instagram.com/thestateofclamor/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--color-gold-antique)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textDecoration: 'none'
                }}
              >
                <Instagram size={15} />
                <span>@thestateofclamor</span>
              </a>

              <span style={{ color: 'var(--color-dim)', fontSize: '0.7rem' }}>·</span>

              <a
                href="https://www.tiktok.com/@thestateofclamor"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--color-gold-antique)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textDecoration: 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>

            <span className="mobile-drawer-meta">
              MIZU COMMONROOM · 30–31 OKT 2026
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default FloatingNavbar;
