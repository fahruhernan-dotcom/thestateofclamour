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
          <a href="#hero" className="nav-brand-title">
            THE STATE OF CLAMOUR
          </a>

          <div className="nav-links-cluster">
            <a
              href="#lineup"
              className={`nav-link-item ${activeTab === 'lineup' ? 'active' : ''}`}
            >
              BINTANG TAMU
            </a>
            <a
              href="#the-passage"
              className={`nav-link-item ${activeTab === 'the-passage' ? 'active' : ''}`}
            >
              TIKET ACARA
            </a>
            <a
              href="#the-night"
              className={`nav-link-item ${activeTab === 'the-night' ? 'active' : ''}`}
            >
              JADWAL ACARA
            </a>
            <button
              type="button"
              onClick={onOpenDossier}
              className="nav-link-item"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-gold-antique)',
                fontWeight: 700,
              }}
            >
              DETAIL EVENT →
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>

          <a href="#the-passage" className="nav-action-btn btn-press nav-action-desktop-only">
            AMBIL TIKET →
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
            <span className="mobile-drawer-brand">THE STATE OF CLAMOUR</span>
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
