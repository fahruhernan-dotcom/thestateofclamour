import React, { useEffect } from 'react';
import { FloatingNavbar } from '../components/FloatingNavbar';
import { HeroSection } from '../components/HeroSection';
import { LineupSection } from '../components/LineupSection';
import { TicketSection } from '../components/TicketSection';
import { StageRundown } from '../components/StageRundown';
import { FinalCTA } from '../components/FinalCTA';
import { Artist, EventData, TicketTier } from '../types';
import { startPreload } from '../utils/mediaPreloader';

interface Props {
  event: EventData;
  artists: Artist[];
  tickets: TicketTier[];
  highlightedTicketId: string | null;
  onOpenNight1: () => void;
  onOpenNight2: () => void;
  onOpenFullDossier: (tab?: 'protocols' | 'architecture' | 'timetable' | 'guide') => void;
  onCheckout: (ticket: TicketTier) => void;
  onScrollToTickets: () => void;
  onToast: (msg: string) => void;
}

export const HomePage: React.FC<Props> = ({
  event,
  artists,
  tickets,
  highlightedTicketId,
  onOpenNight1,
  onOpenNight2,
  onOpenFullDossier,
  onCheckout,
  onScrollToTickets,
  onToast,
}) => {
  useEffect(() => {
    // Silently preload media in background for zero-latency playback
    startPreload();
  }, []);

  return (
    <>
      {/* Scroll-Triggered Minimalist Floating Navbar */}
      <FloatingNavbar onOpenDossier={() => onOpenFullDossier('timetable')} />

      {/* Unified Scene 01: Hero Approach & Section 1 Guest Storytelling */}
      <HeroSection event={event} />


      {/* Scene 02: The Guests (Concert Energy Spread with 3D Tilt & Strobe Flash) */}
      <LineupSection
        artists={artists}
        onToast={onToast}
        onOpenNight1={onOpenNight1}
        onOpenNight2={onOpenNight2}
      />

      {/* Scene 03: The Passage (Zero-Cosplay Admission Passes with Foil Reflection) */}
      <TicketSection
        tickets={tickets}
        highlightedTicketId={highlightedTicketId}
        onCheckout={onCheckout}
      />

      {/* Scene 04: The Events (Multi-Event Showcase & Direct Access to Individual Night Pages) */}
      <StageRundown
        artists={artists}
        onOpenNight1={onOpenNight1}
        onOpenNight2={onOpenNight2}
        onOpenFullDossier={() => onOpenFullDossier('timetable')}
      />

      {/* Scene 05: Enter The State (Final Call to Action with Volumetric Beam) */}
      <FinalCTA onTicketClick={onScrollToTickets} />
    </>
  );
};

export default HomePage;
