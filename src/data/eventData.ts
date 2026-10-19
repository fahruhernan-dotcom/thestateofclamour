import { Announcement, Artist, EventData, TicketTier } from '../types';

export const initialEvent: EventData = {
  id: 'evt-clamor-2026',
  slug: 'the-state-of-clamor-2026',
  title: 'THE STATE OF CLAMOR',
  tagline: 'SWEAR IN CONTINENTAL',
  description: 'Two nights of nocturnal sound and monumental assembly.',
  startDate: '2026-10-30T20:00:00+07:00',
  endDate: '2026-10-31T04:00:00+07:00',
  venueName: 'MIZU COMMONROOM & TETRA',
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
    category: 'Day 1 Pass · 30 Okt',
    price: 100000,
    perks: ['Akses masuk Day 1 (30 Okt)', 'General assembly access', 'Official wristband access pass'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Early Bird',
    sortOrder: 1
  },
  {
    id: 'tkt-early-day2',
    eventId: 'evt-clamor-2026',
    name: 'EARLY BIRD DAY 2',
    category: 'Day 2 Pass · 31 Okt',
    price: 100000,
    perks: ['Akses masuk Day 2 (31 Okt)', 'General assembly access', 'Official wristband access pass'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Early Bird',
    sortOrder: 2
  },
  {
    id: 'tkt-early-2days',
    eventId: 'evt-clamor-2026',
    name: 'EARLY BIRD 2 DAYS PASS',
    category: '2 Days Pass · 30 & 31 Okt',
    price: 180000,
    perks: ['Akses penuh 2 Hari (30 & 31 Okt)', 'Hemat Rp 20.000 vs tiket harian', 'General assembly access all days'],
    status: 'sold_out',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Best Value',
    isProtagonist: true,
    sortOrder: 3
  }
];

// Active Presale 1 Tickets (Single, Couple, Group 1 Day Pass & 2 Days Pass - Artatix)
export const presale1Tickets: TicketTier[] = [
  {
    id: 'tkt-presale1-single',
    eventId: 'evt-clamor-2026',
    name: 'PRESALE 1 · 1 DAY PASS',
    category: '1 Day Pass · Single (1 Pax)',
    price: 169000,
    perks: [
      'Akses masuk 1 Hari (Day 1 atau Day 2)',
      'Akses seluruh stage & assembly',
      'Official wristband access pass'
    ],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Single',
    sortOrder: 1
  },
  {
    id: 'tkt-presale1-couple',
    eventId: 'evt-clamor-2026',
    name: 'PRESALE 1 · COUPLE PASS',
    category: '1 Day Pass · Couple Bundle (2 Pax)',
    price: 318000,
    perks: [
      'Admission untuk 2 Hadirin (Day 1 atau Day 2)',
      'Hemat Rp 20.000 vs 2x Single Pass',
      '2x Official wristband access pass'
    ],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Couple Bundle',
    sortOrder: 2
  },
  {
    id: 'tkt-presale1-group',
    eventId: 'evt-clamor-2026',
    name: 'PRESALE 1 · GROUP PASS',
    category: '1 Day Pass · Group Bundle (4 Pax)',
    price: 596000,
    perks: [
      'Admission untuk 4 Hadirin (Day 1 atau Day 2)',
      'Hanya Rp 149.000/org (Hemat Rp 80.000)',
      '4x Official wristband access pass'
    ],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Group Bundle',
    sortOrder: 3
  },
  {
    id: 'tkt-presale1-2days',
    eventId: 'evt-clamor-2026',
    name: 'PRESALE 1 · 2 DAYS PASS',
    category: '2 Days Pass · Full Day 1 & Day 2',
    price: 299000,
    perks: [
      'Akses penuh 2 Hari (Day 1 & Day 2)',
      'Akses ke seluruh panggung & assembly',
      'Official 2-Day wristband access pass'
    ],
    status: 'active',
    ticketUrl: TICKET_URL,
    badgeLabel: 'Best Value',
    isProtagonist: true,
    sortOrder: 4
  }
];

// Release timestamp for Presale 1: Friday, 16 October 2026 at 14:50:00 WIB
export const PRESALE_1_RELEASE_TIME = '2026-10-16T14:50:00+07:00';

export const isPresale1Active = (releaseTime = PRESALE_1_RELEASE_TIME): boolean => {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    if (
      searchParams.get('tier') === 'presale_1' ||
      searchParams.get('tier') === 'presale1' ||
      searchParams.get('preview') === 'presale1' ||
      hash.includes('preview-presale1') ||
      hash.includes('presale-1')
    ) {
      return true;
    }
    if (searchParams.get('tier') === 'early_bird' || hash.includes('preview-early-bird')) {
      return false;
    }
  }
  return Date.now() >= new Date(releaseTime).getTime();
};

export const getActiveTickets = (): TicketTier[] => {
  return isPresale1Active() ? presale1Tickets : earlyBirdTickets;
};

export const initialTickets: TicketTier[] = getActiveTickets();

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
// ---------------------------------------------------------------------------
// DUAL-TIER LINEUP (DAY 1 & DAY 2)
// Official lineup posters for confirmed artists + Secret Guest TBA for Day 1
// ---------------------------------------------------------------------------
export const day1Artists: Artist[] = [
  {
    id: 'art-bobby-suryadi',
    day: 1,
    eventId: 'evt-clamor-2026',
    name: 'Bobby Suryadi',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/lineup_day1_bobby_suryadi.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day1_bobby_suryadi.jpg',
    audioPreviewUrl: null,
    sortOrder: 1,
    isRevealed: true
  },
  {
    id: 'art-pks',
    day: 1,
    eventId: 'evt-clamor-2026',
    name: 'Pemandu Karaoke Sedih',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/lineup_day1_pemandu_karaoke_sedih.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day1_pemandu_karaoke_sedih.jpg',
    audioPreviewUrl: null,
    sortOrder: 2,
    isRevealed: true
  },
  {
    id: 'art-wancoy',
    day: 1,
    eventId: 'evt-clamor-2026',
    name: 'Wancoy',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Tetra Solo · Stage 1',
    performanceTime: '',
    imageUrl: '/assets/lineup_day1_wancoy.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day1_wancoy.jpg',
    audioPreviewUrl: null,
    sortOrder: 3,
    isRevealed: true
  },
  {
    id: 'art-gedexpoll',
    day: 1,
    eventId: 'evt-clamor-2026',
    name: 'Gedexpoll',
    dayLabel: 'Day 1 · 30 Okt',
    stageName: 'Tetra Solo · Stage 2',
    performanceTime: '',
    imageUrl: '/assets/lineup_day1_gedexpoll.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day1_gedexpoll.jpg',
    audioPreviewUrl: null,
    sortOrder: 4,
    isRevealed: true
  }
];

export const day2Artists: Artist[] = [
  {
    id: 'art-raka-basboi-quest',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: 'Raka x Basboi x Quest*',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Tetra Solo · Stage 1',
    performanceTime: '',
    imageUrl: '/assets/lineup_day2_raka_basboi_quest.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day2_raka_basboi_quest.jpg',
    audioPreviewUrl: null,
    sortOrder: 1,
    isRevealed: true
  },
  {
    id: 'art-seto',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: 'Seto',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Tetra Solo · Stage 2',
    performanceTime: '',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 2,
    isRevealed: false
  },
  {
    id: 'art-safa',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: '$AFA',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 3,
    isRevealed: false
  },
  {
    id: 'art-egnever-mamiq',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: 'Egnever x Mamiq',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/lineup_day2_egnever_mamiq.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day2_egnever_mamiq.jpg',
    audioPreviewUrl: null,
    sortOrder: 4,
    isRevealed: true
  },
  {
    id: 'art-muria',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: 'Muria',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    videoUrl: null,
    posterUrl: '/assets/state_of_clamor_gothic_poster.jpg',
    audioPreviewUrl: null,
    sortOrder: 5,
    isRevealed: false
  },
  {
    id: 'art-brena',
    day: 2,
    eventId: 'evt-clamor-2026',
    name: 'Brena',
    dayLabel: 'Day 2 · 31 Okt',
    stageName: 'Mizu Commonroom',
    performanceTime: '',
    imageUrl: '/assets/lineup_day2_brena.jpg',
    videoUrl: null,
    posterUrl: '/assets/lineup_day2_brena.jpg',
    audioPreviewUrl: null,
    sortOrder: 6,
    isRevealed: true
  }
];

export const teaserFlyerArtists: Artist[] = day1Artists;
export const teaserFlyerArtist: Artist = day1Artists[0];

export const initialArtists: Artist[] = [...day1Artists, ...day2Artists];

/**
 * Returns the public display name of an artist.
 * If the artist is not yet revealed or photo is not yet ready, returns '?'
 */
export const getArtistDisplayName = (artist: Artist): string => {
  if (artist.isRevealed === false) return '?';
  return artist.name;
};

/**
 * Checks whether an artist has been revealed officially with photo
 */
export const isArtistRevealed = (artist: Artist): boolean => {
  return artist.isRevealed !== false;
};
