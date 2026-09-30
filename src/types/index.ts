// Strictly aligned with PRD Data Contracts (PRD 1 & PRD 3)

export type TicketStatus = 'active' | 'sold_out' | 'hidden';

export interface EventData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueCity: string;
  heroVideoUrl?: string | null;
  heroPosterUrl: string;
  isActive: boolean;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  category: string;
  price: number;
  perks: string[];
  status: TicketStatus;
  ticketUrl: string;
  badgeLabel?: string | null;
  sortOrder: number;
}

export interface Artist {
  id: string;
  eventId: string;
  name: string;
  dayLabel: string; // e.g. "Day 1", "Day 2"
  stageName: string; // e.g. "The Main Void", "The Sub-Bunker"
  performanceTime: string; // e.g. "22:30 WIB", "00:00 WIB"
  imageUrl: string;
  videoUrl?: string | null;
  posterUrl?: string | null;
  audioPreviewUrl?: string | null; // Real audio URL (MP3/stream) per PRD
  sortOrder: number;
}

export interface Announcement {
  id: string;
  eventId: string;
  message: string;
  isEnabled: boolean;
  badgeText: string;
}
