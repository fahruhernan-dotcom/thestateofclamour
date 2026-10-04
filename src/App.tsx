import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { NightOneEventPage } from './pages/NightOneEventPage';
import { NightTwoEventPage } from './pages/NightTwoEventPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { Footer } from './components/Footer';
import { initialEvent, initialTickets, initialArtists, archivedIndividualArtists, IS_LINEUP_TEASER_MODE } from './data/eventData';
import { Artist, EventData, TicketTier } from './types';
import { Check } from 'lucide-react';
import { CrypticPreloader } from './components/CrypticPreloader';

type ViewMode = 'home' | 'event-night-1' | 'event-night-2' | 'full-dossier';

export const App: React.FC = () => {
  const [event] = useState<EventData>(initialEvent);
  const [tickets] = useState<TicketTier[]>(initialTickets);
  const [artists] = useState<Artist[]>(initialArtists);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [dossierInitialTab, setDossierInitialTab] = useState<'protocols' | 'architecture' | 'timetable' | 'guide'>('protocols');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);

  // Preserve home scroll position across page transitions
  const homeScrollYRef = useRef<number>(0);

  // Continuously track home scroll position while in home view
  useEffect(() => {
    if (currentView !== 'home') return;
    const handleHomeScroll = () => {
      homeScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    };
    window.addEventListener('scroll', handleHomeScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleHomeScroll);
  }, [currentView]);

  // Seamless home scroll restoration
  const restoreHomeScroll = useCallback(() => {
    const targetY = homeScrollYRef.current;
    if (targetY > 0) {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }, 50);
        setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }, 160);
      });
    }
  }, []);

  // Parse view from hash
  const parseViewFromHash = (hash: string): { view: ViewMode; tab?: 'protocols' | 'architecture' | 'timetable' | 'guide' } => {
    if (IS_LINEUP_TEASER_MODE) {
      return { view: 'home' };
    }
    if (hash === '#/event/night-1' || hash === '#event-night-1' || hash === '#night-1') {
      return { view: 'event-night-1' };
    }
    if (hash === '#/event/night-2' || hash === '#event-night-2' || hash === '#night-2') {
      return { view: 'event-night-2' };
    }
    if (hash.startsWith('#dossier') || hash.startsWith('#/event/full-dossier') || hash === '#details') {
      let tab: 'protocols' | 'architecture' | 'timetable' | 'guide' = 'protocols';
      if (hash.includes('timetable')) tab = 'timetable';
      else if (hash.includes('architecture')) tab = 'architecture';
      else if (hash.includes('guide')) tab = 'guide';
      return { view: 'full-dossier', tab };
    }
    return { view: 'home' };
  };

  // Sync hash routing on mount and hashchange with motion
  useEffect(() => {
    const handleHash = () => {
      const { view, tab } = parseViewFromHash(window.location.hash);
      if (tab) setDossierInitialTab(tab);

      if (view !== currentView) {
        if (currentView === 'home' && view !== 'home') {
          homeScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        }

        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentView(view);
          if (view === 'home') {
            restoreHomeScroll();
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
          setTimeout(() => {
            setIsTransitioning(false);
          }, 80);
        }, 180);
      }
    };

    // Initial load
    const initial = parseViewFromHash(window.location.hash);
    if (initial.tab) setDossierInitialTab(initial.tab);
    setCurrentView(initial.view);

    // Ensure fresh page load starts at the very top (Hero arrival) unless deep-linked by hash
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView, restoreHomeScroll]);


  // Global Nocturnal Torchlight Lantern tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = `${(e.clientX / window.innerWidth) * 100}%`;
    const y = `${(e.clientY / window.innerHeight) * 100}%`;
    e.currentTarget.style.setProperty('--torch-x', x);
    e.currentTarget.style.setProperty('--torch-y', y);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCheckout = (ticket: TicketTier) => {
    showToast(`Membuka loket tiket resmi untuk ${ticket.name}...`);
    if (ticket.ticketUrl) {
      window.open(ticket.ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleScrollToTickets = () => {
    const el = document.getElementById('the-passage');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const activeTier = tickets.find(t => t.status === 'active');
      if (activeTier) {
        setHighlightedTicketId(activeTier.id);
        setTimeout(() => setHighlightedTicketId(null), 2500);
      }
    }
  };

  // Smooth cinematic page navigation with intelligent scroll retention
  const navigateTo = (view: ViewMode, hash = '') => {
    if (currentView === view && window.location.hash === hash) return;

    // Capture home scroll position before navigating away
    if (currentView === 'home' && view !== 'home') {
      homeScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      if (hash) {
        window.location.hash = hash;
      } else {
        window.history.pushState(null, '', ' ');
      }

      if (view === 'home') {
        restoreHomeScroll();
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 80);
    }, 180);
  };


  const handleOpenNight1 = () => {
    if (IS_LINEUP_TEASER_MODE) return;
    navigateTo('event-night-1', '#/event/night-1');
  };

  const handleOpenNight2 = () => {
    if (IS_LINEUP_TEASER_MODE) return;
    navigateTo('event-night-2', '#/event/night-2');
  };




  const handleBackToHome = () => {
    navigateTo('home', '');
  };

  const handleGetTicketsFromDossier = () => {
    navigateTo('home', '');
    setTimeout(() => {
      handleScrollToTickets();
    }, 250);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="clamer-app-canvas"
      style={{ minHeight: '100vh', position: 'relative', backgroundColor: 'var(--color-void)' }}
    >
      {/* Zero-Asset Ceremonial Entrance Preloader */}
      <CrypticPreloader />

      {/* Top Precision Laser Transit Beam */}
      <div
        className={`page-transition-beam ${isTransitioning ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      {/* Optical Velvet Shutter Veil */}
      <div
        className={`page-transition-veil ${isTransitioning ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      {/* Nocturnal Torchlight Ambient Lantern */}
      <div className="nocturnal-torchlight" aria-hidden="true" />

      {/* 35mm Analog Film Grain Overlay */}
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* Dynamic Multi-Page File Router with Smooth Entrance Animation */}
      <div key={currentView} className="page-view-wrapper page-entrance-anim">
        {currentView === 'home' && (
          <HomePage
            event={event}
            artists={artists}
            tickets={tickets}
            highlightedTicketId={highlightedTicketId}
            onOpenNight1={handleOpenNight1}
            onOpenNight2={handleOpenNight2}
            onCheckout={handleCheckout}
            onScrollToTickets={handleScrollToTickets}
            onToast={showToast}
          />
        )}

        {currentView === 'event-night-1' && (
          <NightOneEventPage
            artists={archivedIndividualArtists}
            tickets={tickets}
            onBack={handleBackToHome}
            onCheckout={handleCheckout}
            onViewNight2={handleOpenNight2}
          />
        )}

        {currentView === 'event-night-2' && (
          <NightTwoEventPage
            artists={archivedIndividualArtists}
            tickets={tickets}
            onBack={handleBackToHome}
            onCheckout={handleCheckout}
            onViewNight1={handleOpenNight1}
          />
        )}

        {currentView === 'full-dossier' && (
          <EventDetailsPage
            artists={artists}
            tickets={tickets}
            initialTab={dossierInitialTab}
            onBack={handleBackToHome}
            onGetTickets={handleGetTicketsFromDossier}
          />
        )}
      </div>

      {/* Cinematic Footer & Credits */}
      <Footer />

      {/* Discreet Atmospheric Toast Alert */}
      <div className={`clamour-toast-alert ${toastMessage ? 'is-visible' : ''}`} role="status">
        <Check size={15} style={{ color: 'var(--color-gold-antique)' }} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default App;
