import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Instagram, ChevronRight, ArrowUpRight } from 'lucide-react';
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
              {/* DAY 1 */}
              <button
                type="button"
                className={`header-nav-link header-nav-text nav-link-item ${
                  currentView === 'event-night-1' ? 'header-nav-link--active active-pill' : ''
                }`}
                onClick={handleNight1Click}
                title="Day 1 // Swear in Continental"
                style={{ background: 'transparent', cursor: 'pointer' }}
              >
                <span className="nav-roll-inner">
                  <span className="nav-roll-default">DAY 1</span>
                  <span className="nav-roll-hover" aria-hidden="true">DAY 1</span>
                </span>
              </button>

              <span className="nav-links-dot" aria-hidden="true">·</span>

              {/* DAY 2 */}
              <button
                type="button"
                className={`header-nav-link header-nav-text nav-link-item ${
                  currentView === 'event-night-2' ? 'header-nav-link--active active-pill' : ''
                }`}
                onClick={handleNight2Click}
                title="Day 2 // Swear in Continental"
                style={{ background: 'transparent', cursor: 'pointer' }}
              >
                <span className="nav-roll-inner">
                  <span className="nav-roll-default">DAY 2</span>
                  <span className="nav-roll-hover" aria-hidden="true">DAY 2</span>
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

      {/* Mobile Frosted Glass Navigation Drawer (Apple iOS Inset Grouped) */}
      <div
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-drawer-inner">
          {/* iOS Top Bar Header */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand-group">
              <img
                src="/apple-touch-icon.png"
                alt="Clamour Emblem"
                className="mobile-drawer-logo"
                width="28"
                height="28"
              />
              <div className="mobile-drawer-brand-text">
                <span className="mobile-drawer-brand">THE STATE OF CLAMOUR</span>
                <span className="mobile-drawer-brand-sub">ANNUAL SANCTUARY 2026</span>
              </div>
            </div>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMobileMenu}
              aria-label="Tutup menu"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>

          {/* Group 1: Navigasi Hari Acara (Events & Days) */}
          <div className="mobile-nav-section">
            <span className="mobile-nav-section-title">EKSPLORASI ACARA</span>
            <div className="mobile-nav-group">
              <button
                type="button"
                className={`mobile-nav-item ${currentView === 'home' ? 'is-active' : ''}`}
                onClick={handleHomeClick}
              >
                <div className="mobile-nav-item-content">
                  <span className="mobile-nav-item-title">Beranda Resmi</span>
                  <span className="mobile-nav-item-sub">Manifesto &amp; Sanctuary Utama</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'home' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>

              <div className="mobile-nav-inset-divider" />

              <button
                type="button"
                className={`mobile-nav-item ${currentView === 'event-night-1' ? 'is-active' : ''}`}
                onClick={handleNight1Click}
              >
                <div className="mobile-nav-item-content">
                  <div className="mobile-nav-title-row">
                    <span className="mobile-nav-item-title">Day 1 · Swear in Continental</span>
                    <span className="mobile-nav-date-badge">30 OKT</span>
                  </div>
                  <span className="mobile-nav-item-sub">Tetra Solo &amp; Mizu Commonroom</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'event-night-1' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>

              <div className="mobile-nav-inset-divider" />

              <button
                type="button"
                className={`mobile-nav-item ${currentView === 'event-night-2' ? 'is-active' : ''}`}
                onClick={handleNight2Click}
              >
                <div className="mobile-nav-item-content">
                  <div className="mobile-nav-title-row">
                    <span className="mobile-nav-item-title">Day 2 · Swear in Continental</span>
                    <span className="mobile-nav-date-badge">31 OKT</span>
                  </div>
                  <span className="mobile-nav-item-sub">Tetra Solo &amp; Mizu Commonroom</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'event-night-2' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: Tiket & Akses Venue */}
          <div className="mobile-nav-section">
            <span className="mobile-nav-section-title">TIKET &amp; RESERVASI TEMPAT</span>
            <div className="mobile-nav-group">
              <button
                type="button"
                className={`mobile-nav-item mobile-nav-item--featured ${currentView === 'reservasi' ? 'is-active' : ''}`}
                onClick={handleReservasiClick}
              >
                <div className="mobile-nav-item-content">
                  <div className="mobile-nav-title-row">
                    <span className="mobile-nav-item-title text-gold font-semibold">Reservasi VIP Meja &amp; Sofa</span>
                    <span className="mobile-nav-highlight-badge">KUNCI MEJA</span>
                  </div>
                  <span className="mobile-nav-item-sub">Live Floor Plan 75 Meja (Tetra &amp; Mizu)</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'reservasi' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>

              <div className="mobile-nav-inset-divider" />

              <button
                type="button"
                className={`mobile-nav-item ${currentView === 'denah' ? 'is-active' : ''}`}
                onClick={handleDenahClick}
              >
                <div className="mobile-nav-item-content">
                  <span className="mobile-nav-item-title">Denah &amp; Orientasi Venue</span>
                  <span className="mobile-nav-item-sub">Peta Dua Lantai &amp; Posisi Stage</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'denah' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>

              <div className="mobile-nav-inset-divider" />

              <button
                type="button"
                className="mobile-nav-item"
                onClick={handleTicketClick}
              >
                <div className="mobile-nav-item-content">
                  <div className="mobile-nav-title-row">
                    <span className="mobile-nav-item-title">Tiket Masuk (Artatix)</span>
                    <ArrowUpRight size={14} className="text-[#c5a869]" />
                  </div>
                  <span className="mobile-nav-item-sub">Beli Tiket Presale &amp; General Admission</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>
            </div>
          </div>

          {/* Group 3: Panduan & FAQ */}
          <div className="mobile-nav-section">
            <span className="mobile-nav-section-title">INFORMASI &amp; PERATURAN</span>
            <div className="mobile-nav-group">
              <button
                type="button"
                className={`mobile-nav-item ${currentView === 'full-dossier' ? 'is-active' : ''}`}
                onClick={handleOpenDossierTab}
              >
                <div className="mobile-nav-item-content">
                  <span className="mobile-nav-item-title">Panduan Acara &amp; FAQ</span>
                  <span className="mobile-nav-item-sub">Dresscode, Batasan Usia &amp; Prosedur Masuk</span>
                </div>
                <div className="mobile-nav-item-trailing">
                  {currentView === 'full-dossier' && <span className="mobile-nav-active-pill">AKTIF</span>}
                  <ChevronRight size={16} className="mobile-nav-chevron" />
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Social & Metadata Dispatch */}
          <div className="mobile-drawer-footer">
            <div className="mobile-drawer-socials">
              <a
                href="https://www.instagram.com/thestateofclamor/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-drawer-social-link"
              >
                <Instagram size={14} />
                <span>@thestateofclamor</span>
              </a>
              <span className="mobile-drawer-social-dot">·</span>
              <a
                href="https://www.tiktok.com/@thestateofclamor"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-drawer-social-link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>
            <span className="mobile-drawer-venue-tag">
              MIZU COMMONROOM &amp; TETRA SOLO · 30–31 OKT 2026
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default FloatingNavbar;
