import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface Props {
  onOpenDossier?: () => void;
}

export const FloatingNavbar: React.FC<Props> = ({ onOpenDossier }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'lineup' | 'the-passage' | 'the-night'>('lineup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // STRICT RULE: Navbar ONLY appears when reaching Section 2 (The Guests / Lineup) and downwards.
          // Zero navbar intrusion throughout the entire Hero entrance & Section 1 storytelling experience!
          const lineupEl = document.getElementById('lineup');
          if (lineupEl) {
            const lineupTop = lineupEl.getBoundingClientRect().top + window.scrollY;
            const isAtLineupOrBelow = window.scrollY >= (lineupTop - 60);
            setIsScrolled(isAtLineupOrBelow);
          } else {
            setIsScrolled(false);
          }

          const sections = ['the-night', 'the-passage', 'lineup'] as const;
          const scrollPos = window.scrollY + 250;

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el && el.offsetTop <= scrollPos) {
              setActiveTab(sectionId);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial evaluation
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleMobileNavClick = useCallback((href: string) => {
    closeMobileMenu();
    // Small delay to let body scroll unlock before scrolling
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }, [closeMobileMenu]);

  const handleMobileDossier = useCallback(() => {
    closeMobileMenu();
    if (onOpenDossier) {
      setTimeout(() => onOpenDossier(), 80);
    }
  }, [closeMobileMenu, onOpenDossier]);

  return (
    <>
      <header className={`cinematic-navbar ${isScrolled ? 'is-visible' : 'is-hidden'}`}>
        <nav className="navbar-inner-bar" role="navigation" aria-label="Official Assembly Navigation">
          <a href="#hero" className="nav-brand-link" aria-label="Kembali ke atas">
            <img
              src="/apple-touch-icon.png"
              alt="Clamour Emblem"
              className="nav-brand-logo-img"
              width="26"
              height="26"
            />
            <span className="nav-brand-title">CLAMOUR</span>
          </a>

          {/* Desktop Ultra-Minimalist Links with Bedimcode Rolling Text */}
          <div className="nav-links-cluster">
            <a
              href="#lineup"
              className={`nav-link-item ${activeTab === 'lineup' ? 'active' : ''}`}
            >
              <span className="nav-roll-inner">
                <span className="nav-roll-default">LINEUP</span>
                <span className="nav-roll-hover" aria-hidden="true">LINEUP</span>
              </span>
            </a>
            <span className="nav-links-dot" aria-hidden="true">·</span>
            <a
              href="#the-night"
              className={`nav-link-item ${activeTab === 'the-night' ? 'active' : ''}`}
            >
              <span className="nav-roll-inner">
                <span className="nav-roll-default">JADWAL</span>
                <span className="nav-roll-hover" aria-hidden="true">JADWAL</span>
              </span>
            </a>
          </div>

          {/* Mobile Rotating Morphing Toggle */}
          <button
            type="button"
            className={`nav-mobile-toggle ${isMobileMenuOpen ? 'is-active' : ''}`}
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

          {/* Desktop CTA with Bedimcode Rolling Text */}
          <a href="#the-passage" className="nav-action-btn btn-press nav-action-desktop-only">
            <span className="nav-roll-inner">
              <span className="nav-roll-default">AMBIL TIKET →</span>
              <span className="nav-roll-hover" aria-hidden="true">AMBIL TIKET →</span>
            </span>
          </a>
        </nav>
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
              className="mobile-drawer-link"
              onClick={() => handleMobileNavClick('#lineup')}
            >
              <span className="mobile-drawer-link-kicker">01</span>
              <span className="mobile-drawer-link-label">BINTANG TAMU</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleMobileNavClick('#the-passage')}
            >
              <span className="mobile-drawer-link-kicker">02</span>
              <span className="mobile-drawer-link-label">TIKET ACARA</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link"
              onClick={() => handleMobileNavClick('#the-night')}
            >
              <span className="mobile-drawer-link-kicker">03</span>
              <span className="mobile-drawer-link-label">JADWAL ACARA</span>
            </button>

            <div className="mobile-drawer-divider" />

            <button
              type="button"
              className="mobile-drawer-link mobile-drawer-link-gold"
              onClick={handleMobileDossier}
            >
              <span className="mobile-drawer-link-kicker">✦</span>
              <span className="mobile-drawer-link-label">DETAIL EVENT</span>
            </button>
          </nav>

          {/* Bottom CTA */}
          <div className="mobile-drawer-bottom">
            <button
              type="button"
              className="mobile-drawer-cta"
              onClick={() => handleMobileNavClick('#the-passage')}
            >
              AMBIL TIKET →
            </button>
            <span className="mobile-drawer-meta">
              SWEAR IN CONTINENTAL · 30–31 OKT 2026
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
