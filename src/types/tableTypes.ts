// TypeScript definitions for Dual-Floor Seating & Reservation System
// The State of Clamor: Swear in Continental (Lantai 1 & Lantai 2)

export type FloorLevel = 1 | 2;

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'locked';

export type SpotCategory =
  | 'vvip'
  | 'vip'
  | 'sofa'
  | 'booth'
  | 'cocktail'
  | 'mezzanine'
  | 'high_stool'
  | 'landmark';

export interface TableSpot {
  id: string; // Unique identifier: e.g. "f1-sofa-1", "f2-vvip-1"
  code: string; // Display code: e.g. "SOFA 1", "VVIP 1", "T-1", "M1"
  floor: FloorLevel;
  name: string;
  category: SpotCategory;
  capacityText: string;
  minSpendDay1: number;
  minSpendDay2: number;
  formattedMinSpendDay1: string;
  formattedMinSpendDay2: string;
  bookingFee?: number;
  formattedBookingFee?: string;
  complementTickets?: number;
  venue?: 'tetra' | 'mizu';
  // Normalized percentage coordinates (0 - 100) on the original floor plan image
  x: number;
  y: number;
  description: string;
  inclusions: string[];
  isBookable: boolean;
  packageIdRef?: string;
  zoneTag: string;
}

export interface TableLiveState {
  spotId: string;
  status: TableStatus;
  day: 'day-1' | 'day-2' | 'both';
  reservedBy?: string;
  updatedAt?: string;
}

export interface FloorStats {
  totalSpots: number;
  availableCount: number;
  reservedCount: number;
}
