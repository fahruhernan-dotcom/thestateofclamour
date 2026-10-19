import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { NightOneEventPage } from './pages/NightOneEventPage';
import { NightTwoEventPage } from './pages/NightTwoEventPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { DenahPage } from './pages/DenahPage';
import { ReservasiPage } from './pages/ReservasiPage';
import { FloatingNavbar } from './components/FloatingNavbar';
import { Footer } from './components/Footer';
import { initialEvent, getActiveTickets, PRESALE_1_RELEASE_TIME, initialArtists, IS_LINEUP_TEASER_MODE } from './data/eventData';
import { Artist, EventData, TicketTier } from './types';
import { Check } from 'lucide-react';
import { CrypticPreloader } from './components/CrypticPreloader';
import { fetchLiveArtatixTickets } from './services/artatixService';

type ViewMode = 'home' | 'event-night-1' | 'event-night-2' | 'full-dossier' | 'denah' | 'reservasi';

export const App: React.FC = () => {
  const event: EventData = initialEvent;
  const [tickets, setTickets] = useState<TicketTier[]>(getActiveTickets);
  const artists: Artist[] = initialArtists;
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [dossierInitialTab, setDossierInitialTab] = useState<'protocols' | 'architecture' | 'timetable' | 'guide'>('protocols');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);
  const [selectedReservationPackageId, setSelectedReservationPackageId] = useState<string | undefined>(undefined);
  const [selectedReservationDay, setSelectedReservationDay] = useState<'day-1' | 'day-2'>('day-1');
  const [previousView, setPreviousView] = useState<ViewMode>('home');

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
  const parseViewFromHash = (hash: string): { view: ViewMode; tab?: 'protocols' | 'architecture' | 'timetable' | 'guide'; scrollTarget?: string; day?: 'day-1' | 'day-2' } => {
    if (hash === '#/denah' || hash === '#denah') {
      return { view: 'denah' };
    }
    if (hash.startsWith('#/reservasi') || hash.startsWith('#reservasi')) {
      const day = (hash.includes('day=day-2') || hash.includes('day-2')) ? 'day-2' : 'day-1';
      return { view: 'reservasi', day };
    }
    if (hash.startsWith('#/event/night-1') || hash === '#event-night-1' || hash === '#night-1' || hash === '#/day-1' || hash === '#day-1') {
      const scrollTarget = hash.includes('#denah') ? 'denah' : hash.includes('#reservasi') ? 'reservasi' : undefined;
      return { view: 'event-night-1', scrollTarget };
    }
    if (hash.startsWith('#/event/night-2') || hash === '#event-night-2' || hash === '#night-2' || hash === '#/day-2' || hash === '#day-2') {
      const scrollTarget = hash.includes('#denah') ? 'denah' : hash.includes('#reservasi') ? 'reservasi' : undefined;
      return { view: 'event-night-2', scrollTarget };
    }
    if (hash.startsWith('#dossier') || hash.startsWith('#/event/full-dossier') || hash === '#details') {
      let tab: 'protocols' | 'architecture' | 'timetable' | 'guide' = 'protocols';
      if (hash.includes('timetable')) tab = 'timetable';
      else if (hash.includes('architecture')) tab = 'architecture';
      else if (hash.includes('guide')) tab = 'guide';
      return { view: 'full-dossier', tab };
    }
    if (IS_LINEUP_TEASER_MODE) {
      return { view: 'home' };
    }
    return { view: 'home' };
  };

  // Sync hash routing on mount and hashchange with motion
  useEffect(() => {
    const handleHash = () => {
      const { view, tab, scrollTarget, day } = parseViewFromHash(window.location.hash);
      if (tab) setDossierInitialTab(tab);
      if (day) setSelectedReservationDay(day);

      if (view !== currentView) {
        setPreviousView(currentView);
        if (currentView === 'home' && view !== 'home') {
          homeScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        }

        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentView(view);
          if (view === 'home') {
            const hash = window.location.hash;
            if (hash === '#lineup' || hash === '#the-passage') {
              const targetId = hash.replace('#', '');
              setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                  const navbarOffset = window.innerWidth <= 768 ? 76 : 92;
                  const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
                  window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
                }
              }, 100);
            } else {
              restoreHomeScroll();
            }
          } else {
            if (scrollTarget) {
              setTimeout(() => {
                const el = document.getElementById(scrollTarget);
                if (el) {
                  const offset = 80;
                  const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
                }
              }, 120);
            } else {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          }
          setTimeout(() => {
            setIsTransitioning(false);
          }, 80);
        }, 180);
      } else if (scrollTarget) {
        const el = document.getElementById(scrollTarget);
        if (el) {
          const offset = 80;
          const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
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

  // Automated Presale 1 Ticket Release Scheduler & Dynamic Artatix Sync
  useEffect(() => {
    const syncTicketsWithScheduleAndArtatix = () => {
      const scheduledTickets = getActiveTickets();
      fetchLiveArtatixTickets(scheduledTickets).then((result) => {
        if (result.isLive && Object.keys(result.statusMap).length > 0) {
          setTickets(scheduledTickets.map((t) => ({
            ...t,
            status: result.statusMap[t.id] ?? t.status
          })));
        } else {
          setTickets(scheduledTickets);
        }
      });
    };

    // Single initial sync on page load
    syncTicketsWithScheduleAndArtatix();

    // Release timer for Presale 1 (Friday, 16 Oct 2026 at 14:50 WIB)
    const releaseTimestamp = new Date(PRESALE_1_RELEASE_TIME).getTime();
    const remainingMs = releaseTimestamp - Date.now();

    let timerId: ReturnType<typeof setTimeout> | null = null;
    if (remainingMs > 0) {
      timerId = setTimeout(() => {
        syncTicketsWithScheduleAndArtatix();
        showToast('LOKET PRESALE 1 TELAH DIBUKA RESMI!');
      }, remainingMs);
    }

    // Sync when tab wakes from sleep or visitor refocuses the window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncTicketsWithScheduleAndArtatix();
      }
    };

    // Passive sync when visitor changes URL query (?tier=presale_1 / ?tier=early_bird) or hash
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('hashchange', syncTicketsWithScheduleAndArtatix);
    window.addEventListener('popstate', syncTicketsWithScheduleAndArtatix);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('hashchange', syncTicketsWithScheduleAndArtatix);
      window.removeEventListener('popstate', syncTicketsWithScheduleAndArtatix);
    };
  }, []);

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

  // Smooth cinematic page navigation with intelligent scroll retention & in-page section scrolling
  const navigateTo = (view: ViewMode, hash = '', scrollTargetId = '') => {
    // If staying on home, handle direct smooth scroll without screen flash/transition
    if (currentView === 'home' && view === 'home') {
      if (hash && window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
      }
      if (scrollTargetId) {
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
      }
      return;
    }

    if (currentView === view && window.location.hash === hash) return;

    if (currentView !== view) {
      setPreviousView(currentView);
    }

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
        const targetId = scrollTargetId || (hash.startsWith('#') ? hash.slice(1) : '');
        if (targetId && targetId !== 'hero' && document.getElementById(targetId)) {
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) {
              const navbarOffset = window.innerWidth <= 768 ? 76 : 92;
              const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
              window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            }
          }, 80);
        } else if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          restoreHomeScroll();
        }
      } else {
        if (scrollTargetId) {
          setTimeout(() => {
            const el = document.getElementById(scrollTargetId);
            if (el) {
              const offset = 80;
              const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            }
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 80);
    }, 180);
  };


  const handleOpenNight1 = () => {
    navigateTo('event-night-1', '#/event/night-1');
  };

  const handleOpenNight2 = () => {
    navigateTo('event-night-2', '#/event/night-2');
  };

  const handleOpenDenah = () => {
    navigateTo('denah', '#/denah');
  };

  const handleOpenReservasi = (packageId?: string, targetDay: 'day-1' | 'day-2' = 'day-1') => {
    setPreviousView(currentView);
    if (packageId) setSelectedReservationPackageId(packageId);
    setSelectedReservationDay(targetDay);
    navigateTo('reservasi', `#/reservasi?day=${targetDay}`);
  };

  const handleBackFromReservasi = () => {
    if (previousView === 'event-night-1') {
      handleOpenNight1();
    } else if (previousView === 'event-night-2') {
      handleOpenNight2();
    } else if (previousView === 'denah') {
      handleOpenDenah();
    } else {
      handleBackToHome();
    }
  };

  const handleOpenDossier = (tab: 'protocols' | 'architecture' | 'timetable' | 'guide' = 'timetable') => {
    setDossierInitialTab(tab);
    navigateTo('full-dossier', `#dossier-${tab}`);
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

      {/* Persistent Cinematic Navbar (Smooth Entrance from Section 2 & on Subpages) */}
      <FloatingNavbar
        currentView={currentView}
        onNavigate={(view, hash, scrollTargetId) => navigateTo(view, hash, scrollTargetId)}
        onOpenDossier={() => handleOpenDossier('timetable')}
      />

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
            onOpenReservasi={handleOpenReservasi}
            onCheckout={handleCheckout}
            onScrollToTickets={handleScrollToTickets}
            onToast={showToast}
          />
        )}

        {currentView === 'denah' && (
          <DenahPage
            onBack={handleBackToHome}
            onNavigateToReservasi={(pkgId) => handleOpenReservasi(pkgId)}
          />
        )}

        {currentView === 'reservasi' && (
          <ReservasiPage
            initialPackageId={selectedReservationPackageId}
            initialDay={selectedReservationDay}
            onBack={handleBackFromReservasi}
            onNavigateToDenah={handleOpenDenah}
            onToast={showToast}
          />
        )}

        {currentView === 'event-night-1' && (
          <NightOneEventPage
            tickets={tickets}
            initialPackageId={selectedReservationPackageId}
            onBack={handleBackToHome}
            onCheckout={handleCheckout}
            onOpenReservasi={(day) => handleOpenReservasi(undefined, day || 'day-1')}
            onViewNight2={handleOpenNight2}
            onToast={showToast}
          />
        )}

        {currentView === 'event-night-2' && (
          <NightTwoEventPage
            tickets={tickets}
            initialPackageId={selectedReservationPackageId}
            onBack={handleBackToHome}
            onCheckout={handleCheckout}
            onOpenReservasi={(day) => handleOpenReservasi(undefined, day || 'day-2')}
            onViewNight1={handleOpenNight1}
            onToast={showToast}
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
      <div className={`clamor-toast-alert ${toastMessage ? 'is-visible' : ''}`} role="status">
        <Check size={15} style={{ color: 'var(--color-gold-antique)' }} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default App;
