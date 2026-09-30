import { Announcement, Artist, EventData, TicketTier } from '../types';

export const initialEvent: EventData = {
  id: 'evt-clamour-2026',
  slug: 'the-state-of-clamour-2026',
  title: 'THE STATE OF CLAMOUR',
  tagline: 'SWEAR IN CONTINENTAL',
  description: 'Two nights of nocturnal sound and monumental assembly.',
  startDate: '2026-10-30T21:00:00+07:00',
  endDate: '2026-10-31T04:00:00+07:00',
  venueName: 'SECRET MONUMENT',
  venueCity: 'CENTRAL MONUMENT',
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

export const initialTickets: TicketTier[] = [
  {
    id: 'tkt-blind',
    eventId: 'evt-clamour-2026',
    name: 'Blind Ticket',
    category: '1 Night Pass',
    price: 75000,
    perks: ['Single night admission', 'General assembly access'],
    status: 'sold_out',
    ticketUrl: 'https://artatix.co.id',
    badgeLabel: null,
    sortOrder: 1
  },
  {
    id: 'tkt-early',
    eventId: 'evt-clamour-2026',
    name: 'Early Bird',
    category: '2 Nights Pass',
    price: 99000,
    perks: ['Full 2-night admission', 'Priority entry before 22:00'],
    status: 'sold_out',
    ticketUrl: 'https://artatix.co.id',
    badgeLabel: null,
    sortOrder: 2
  },
  {
    id: 'tkt-presale1',
    eventId: 'evt-clamour-2026',
    name: 'Presale 01',
    category: '2 Nights Pass',
    price: 129000,
    perks: ['Full 2-night admission', 'General access to all stages'],
    status: 'active',
    ticketUrl: 'https://artatix.co.id',
    badgeLabel: 'Active Tier',
    sortOrder: 3
  },
  {
    id: 'tkt-vip',
    eventId: 'evt-clamour-2026',
    name: 'VIP Assembly Table',
    category: 'VIP Experience',
    price: 2500000,
    perks: ['Admission for 6 guests', 'Dedicated table reservation', 'Elevated sound mezzanine view'],
    status: 'active',
    ticketUrl: 'https://artatix.co.id',
    badgeLabel: 'Limited Tables',
    sortOrder: 4
  }
];

export const initialArtists: Artist[] = [
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
