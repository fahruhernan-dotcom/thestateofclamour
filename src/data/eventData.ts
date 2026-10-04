import { Announcement, Artist, EventData, TicketTier } from '../types';

export const initialEvent: EventData = {
  id: 'evt-clamour-2026',
  slug: 'the-state-of-clamour-2026',
  title: 'THE STATE OF CLAMOUR',
  tagline: 'SWEAR IN CONTINENTAL',
  description: 'Two nights of nocturnal sound and monumental assembly.',
  startDate: '2026-10-30T21:00:00+07:00',
  endDate: '2026-10-31T04:00:00+07:00',
  venueName: 'MIZU COMMONROOM',
  venueCity: 'SURAKARTA',
  heroVideoUrl: '/assets/hero_monument.mp4',
  heroPosterUrl: '/assets/hero_monument.jpg',
  isActive: true
};

export const initialAnnouncement: Announcement = {
  id: 'ann-clamour-01',
  eventId: 'evt-clamour-2026',
  message: 'SWEAR IN CONTINENTAL · 30 — 31 OCTOBER 2026 · GATES UNSEALED 21:00',
  isEnabled: false,
  badgeText: 'DISPATCH'
};

// Official checkout destination for every ticket tier
export const TICKET_URL = 'https://artatix.co.id/event/swear_in_continental';

export const initialTickets: TicketTier[] = [
  {
    id: 'tkt-blind-day1',
    eventId: 'evt-clamour-2026',
    name: 'BLIND TICKET DAY 1',
    category: '1 Night Pass · 30 Oct',
    price: 50000,
    perks: ['Admission Day 1 · 30 October', 'General assembly access'],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Blind Ticket',
    sortOrder: 1
  },
  {
    id: 'tkt-blind-day2',
    eventId: 'evt-clamour-2026',
    name: 'BLIND TICKET DAY 2',
    category: '1 Night Pass · 31 Oct',
    price: 50000,
    perks: ['Admission Day 2 · 31 October', 'General assembly access'],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Blind Ticket',
    sortOrder: 2
  }
];

// ---------------------------------------------------------------------------
// LINEUP TEASER MODE
// true  -> guestlist shows ONE flyer card (Gothic poster) playing Far's audio.
// false -> guestlist shows the individual guest cards (Malvin & Far) again.
// When the official per-guest flyers are ready, update imageUrl/posterUrl
// below and flip this flag to false. No component logic needs to change.
// ---------------------------------------------------------------------------
export const IS_LINEUP_TEASER_MODE = true;

// Individual guests (hidden while teaser mode is on — data & logic kept intact)
export const archivedIndividualArtists: Artist[] = [
  {
    id: 'art-malvin',
    eventId: 'evt-clamour-2026',
    name: 'Malvin',
    dayLabel: 'Day 1',
    stageName: 'Mizu Commonroom',
    performanceTime: '22:00 WIB',
    imageUrl: '/assets/guest_malvin_poster.png',
    videoUrl: '/assets/guest_malvin.mp4',
    posterUrl: '/assets/guest_malvin_poster.png',
    audioPreviewUrl: null,
    sortOrder: 1
  },
  {
    id: 'art-far',
    eventId: 'evt-clamour-2026',
    name: 'Far',
    dayLabel: 'Day 2',
    stageName: 'Mizu Commonroom',
    performanceTime: '23:30 WIB',
    imageUrl: '/assets/guest_far_poster.png',
    videoUrl: '/assets/guest_far.mp4',
    posterUrl: '/assets/guest_far_poster.png',
    audioPreviewUrl: null,
    sortOrder: 2
  }
];

// Flyer card: static poster visual (videoUrl null) + Far's track as audio-only source
export const teaserFlyerArtist: Artist = {
  id: 'art-teaser-flyer',
  eventId: 'evt-clamour-2026',
  name: 'Swear In Continental',
  dayLabel: '30 — 31 Oktober',
  stageName: 'Mizu Commonroom',
  performanceTime: '21:00 WIB',
  imageUrl: '/assets/state_of_clamour_gothic_poster.jpg',
  videoUrl: null,
  posterUrl: '/assets/state_of_clamour_gothic_poster.jpg',
  audioPreviewUrl: '/assets/guest_far.mp4',
  sortOrder: 1
};

export const initialArtists: Artist[] = IS_LINEUP_TEASER_MODE
  ? [teaserFlyerArtist]
  : archivedIndividualArtists;
