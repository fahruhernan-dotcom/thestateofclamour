import { TicketTier } from '../types';

export interface ArtatixTicketItem {
  id: number;
  eventId: number;
  category: string;
  name: string;
  type: string;
  price: string;
  discount: string;
  stock: number;
  status: string; // e.g. "Sold Out", "Available", "Active"
  isTicketExclusive?: number;
}

export interface ArtatixApiResponse {
  message: string;
  data: ArtatixTicketItem[];
}

export interface ArtatixSyncResult {
  isLive: boolean;
  rawItems: ArtatixTicketItem[];
  statusMap: Record<string, 'active' | 'sold_out'>;
}

/**
 * Normalizes string for fuzzy keyword comparison
 */
function cleanStr(val: string): string {
  return (val || '').toLowerCase().replace(/[^a-z0-9]/g, ' ');
}

/**
 * Resilient matcher between an Artatix ticket item and a local TicketTier.
 */
export function matchArtatixItemToTier(
  artatixItem: ArtatixTicketItem,
  localTier: TicketTier
): boolean {
  const aText = cleanStr(`${artatixItem.name} ${artatixItem.category}`);
  const lText = cleanStr(`${localTier.name} ${localTier.category} ${localTier.id}`);
  const aPrice = Math.round(parseFloat(artatixItem.price) || 0);

  // Exact ID match if configured
  if (localTier.id.includes(String(artatixItem.id))) {
    return true;
  }

  // 1. Blind Ticket Matching
  if (lText.includes('blind') && aText.includes('blind')) {
    if ((lText.includes('day 1') || lText.includes('30')) && (aText.includes('day 1') || aText.includes('30'))) {
      return true;
    }
    if ((lText.includes('day 2') || lText.includes('31')) && (aText.includes('day 2') || aText.includes('31'))) {
      return true;
    }
  }

  // 2. Early Bird 2 Days Pass Matching (Price 180.000 or '2 days' / '2 day' / 'pass')
  if (
    (lText.includes('early') || lText.includes('bird')) &&
    (lText.includes('2 day') || lText.includes('2days') || lText.includes('pass'))
  ) {
    if (aPrice === 180000) return true;
    if (
      (aText.includes('early') || aText.includes('bird')) &&
      (aText.includes('2 day') || aText.includes('2days') || aText.includes('terusan') || aText.includes('pass'))
    ) {
      return true;
    }
  }

  // 3. Early Bird Single Day Matching (Price 100.000)
  if (
    (lText.includes('early') || lText.includes('bird')) &&
    (aText.includes('early') || aText.includes('bird'))
  ) {
    if ((lText.includes('day 1') || lText.includes('30')) && (aText.includes('day 1') || aText.includes('30'))) {
      return true;
    }
    if ((lText.includes('day 2') || lText.includes('31')) && (aText.includes('day 2') || aText.includes('31'))) {
      return true;
    }
  }

  // 4. Price-level match if tier is same category
  if (aPrice > 0 && aPrice === localTier.price) {
    if (lText.includes('day 1') && aText.includes('day 1')) return true;
    if (lText.includes('day 2') && aText.includes('day 2')) return true;
    if (localTier.id === 'tkt-early-2days' && aPrice === 180000) return true;
  }

  return false;
}

/**
 * Checks whether an Artatix ticket is sold out based on status string and stock count.
 */
export function isArtatixItemSoldOut(item: ArtatixTicketItem): boolean {
  const statusLower = (item.status || '').toLowerCase().trim();
  if (statusLower.includes('sold') || statusLower.includes('habis')) {
    return true;
  }
  if (typeof item.stock === 'number' && item.stock <= 0) {
    return true;
  }
  return false;
}

/**
 * Fetches live ticket data from Artatix via internal proxy (Vite / Vercel / cPanel).
 */
export async function fetchLiveArtatixTickets(
  localTickets: TicketTier[]
): Promise<ArtatixSyncResult> {
  // Candidate proxy URLs
  const candidateEndpoints = [
    '/api-artatix/customer/ticket/swear_in_continental?isTicketExclusive=0&isMerch=0',
    '/api-artatix.php'
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        continue;
      }

      const json: ArtatixApiResponse = await response.json();
      if (!json || !Array.isArray(json.data)) {
        continue;
      }

      const rawItems = json.data;
      const statusMap: Record<string, 'active' | 'sold_out'> = {};

      for (const localTier of localTickets) {
        const matchedItem = rawItems.find((aItem) => matchArtatixItemToTier(aItem, localTier));
        if (matchedItem) {
          const soldOut = isArtatixItemSoldOut(matchedItem);
          statusMap[localTier.id] = soldOut ? 'sold_out' : 'active';
        }
      }

      return {
        isLive: true,
        rawItems,
        statusMap
      };
    } catch {
      // Continue to next endpoint or fallback
    }
  }

  // Graceful offline fallback
  return {
    isLive: false,
    rawItems: [],
    statusMap: {}
  };
}
