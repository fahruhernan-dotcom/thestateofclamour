import { Announcement, Artist, EventData, TicketTier } from '../types';

export const initialEvent: EventData = {
  id: 'evt-clamor-2026',
  slug: 'the-state-of-clamor-2026',
  title: 'THE STATE OF CLAMOR',
  tagline: 'SWEAR IN CONTINENTAL',
  description: 'Two nights of nocturnal sound and monumental assembly.',
  startDate: '2026-10-30T20:00:00+07:00',
  endDate: '2026-10-31T04:00:00+07:00',
  venueName: 'MIZU COMMONROOM',
  venueCity: '',
  heroVideoUrl: '/assets/hero_monument.mp4',
  heroPosterUrl: '/assets/hero_monument.jpg',
  isActive: true
};

export const initialAnnouncement: Announcement = {
  id: 'ann-clamor-01',
  eventId: 'evt-clamor-2026',
  message: 'SWEAR IN CONTINENTAL · 30 — 31 OCTOBER 2026 · GATES UNSEALED 20:00',
  isEnabled: false,
  badgeText: 'DISPATCH'
};

// Official checkout destination for every ticket tier
export const TICKET_URL = 'https://artatix.co.id/event/swear_in_continental/ticket';

// Official Social Channels
export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/thestateofclamor/?hl=en';
export const OFFICIAL_TIKTOK_URL = 'https://www.tiktok.com/@thestateofclamor';

// Archived Blind Tickets (Day 1 & Day 2 passes - Sold Out)
export const archivedBlindTickets: TicketTier[] = [
  {
    id: 'tkt-blind-day1',
    eventId: 'evt-clamor-2026',
    name: 'BLIND TICKET DAY 1',
    category: '1 Night Pass · 30 Oct',
    price: 50000,
    perks: ['Admission Day 1 · 30 October', 'General assembly access'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Blind Ticket',
    sortOrder: 1
  },
  {
    id: 'tkt-blind-day2',
    eventId: 'evt-clamor-2026',
    name: 'BLIND TICKET DAY 2',
    category: '1 Night Pass · 31 Oct',
    price: 50000,
    perks: ['Admission Day 2 · 31 October', 'General assembly access'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Blind Ticket',
    sortOrder: 2
  }
];

// Active Early Bird Tickets (Day 1, Day 2, and 2 Days Pass - Dynamic sync via Artatix API)
export const earlyBirdTickets: TicketTier[] = [
  {
    id: 'tkt-early-day1',
    eventId: 'evt-clamor-2026',
    name: 'EARLY BIRD DAY 1',
    category: '1 Night Pass · 30 Oct',
    price: 100000,
    perks: ['Single night admission (30 Oct)', 'General assembly access', 'Official wristband access pass'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Early Bird',
    sortOrder: 1
  },
  {
    id: 'tkt-early-day2',
    eventId: 'evt-clamor-2026',
    name: 'EARLY BIRD DAY 2',
    category: '1 Night Pass · 31 Oct',
    price: 100000,
    perks: ['Single night admission (31 Oct)', 'General assembly access', 'Official wristband access pass'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Early Bird',
    sortOrder: 2
  },
  {
    id: 'tkt-early-2days',
    eventId: 'evt-clamor-2026',
    name: 'EARLY BIRD 2 DAYS PASS',
    category: '2 Nights Pass · 30 & 31 Oct',
    price: 180000,
    perks: ['Full 2-night admission (30 & 31 Oct)', 'Save Rp 20.000 vs single day passes', 'General assembly access all nights'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Best Value',
    isProtagonist: true,
    sortOrder: 3
  }
];

export const getActiveTickets = (): TicketTier[] => {
  return earlyBirdTickets;
};

export const initialTickets: TicketTier[] = earlyBirdTickets;

// ---------------------------------------------------------------------------
// LINEUP TEASER MODE
// true  -> guestlist shows ONE flyer card (Gothic poster) playing Far's audio.
// false -> guestlist shows the individual guest cards (Malvin & Far) again.
// When the official per-guest flyers are ready, update imageUrl/posterUrl
// below and flip this flag to false. No component logic needs to change.
export const IS_LINEUP_TEASER_MODE = true;

// Set to true once the official multi-stage running order / lineup is publicly announced
export const IS_RUNDOWN_RELEASED = false;

// Individual guests (hidden while teaser mode is on — data & logic kept intact)
export const archivedIndividualArtists: Artist[] = [
  {
    id: 'art-malvin',
    eventId: 'evt-clamor-2026',
    name: 'Malvin',
    dayLabel: 'Day 1',
    stageName: 'Mizu Commonroom',
    performanceTime: '20:00 WIB',
    imageUrl: '/assets/guest_malvin_poster.png',
    videoUrl: '/assets/guest_malvin.mp4',
    posterUrl: '/assets/guest_malvin_poster.png',
    audioPreviewUrl: null,
    sortOrder: 1
  },
  {
    id: 'art-far',
    eventId: 'evt-clamor-2026',
    name: 'Far',
    dayLabel: 'Day 2',
    stageName: 'Mizu Commonroom',
    performanceTime: '20:00 WIB',
    imageUrl: '/assets/guest_far_poster.png',
    videoUrl: '/assets/guest_far.mp4',
    posterUrl: '/assets/guest_far_poster.png',
    audioPreviewUrl: null,
    sortOrder: 2
  }
];

// ---------------------------------------------------------------------------
// DUAL-TIER LINEUP (DAY 1 & DAY 2)
// Using official Gothic teaser poster for all cards until client releases individual assets
// ---------------------------------------------------------------------------
export const day1Artists: Artist[] = [
  {
    id: 'art-day1-1',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '20:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 1
  },
  {
    id: 'art-day1-2',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '22:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 2
  },
  {
    id: 'art-day1-3',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '00:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 3
  }
];

export const day2Artists: Artist[] = [
  {
    id: 'art-day2-1',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '20:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 1
  },
  {
    id: 'art-day2-2',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '22:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 2
  },
  {
    id: 'art-day2-3',
    eventId: 'evt-clamor-2026',
    name: 'Swear In Continental · ?',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '00:00 WIB',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 3
  }
];

export const teaserFlyerArtists: Artist[] = day1Artists;
export const teaserFlyerArtist: Artist = day1Artists[0];

export const initialArtists: Artist[] = [...day1Artists, ...day2Artists];
