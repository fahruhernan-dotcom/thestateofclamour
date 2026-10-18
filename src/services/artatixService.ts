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
 * Official Artatix Ticket IDs mapped to local tier IDs
 */
export const ARTATIX_ID_MAP: Record<string, number> = {
  'tkt-early-day1': 22389,
  'tkt-early-day2': 22390,
  'tkt-early-2days': 22391,
  'tkt-blind-day1': 22394,
  'tkt-blind-day2': 22395,
};

/**
 * Resilient matcher between an Artatix ticket item and a local TicketTier.
 */
export function matchArtatixItemToTier(
  artatixItem: ArtatixTicketItem,
  localTier: TicketTier
): boolean {
  // 1. Direct ID match from known map
  if (ARTATIX_ID_MAP[localTier.id] === artatixItem.id) {
    return true;
  }
  if (localTier.id.includes(String(artatixItem.id))) {
    return true;
  }

  const aText = cleanStr(`${artatixItem.name} ${artatixItem.category}`);
  const lText = cleanStr(`${localTier.name} ${localTier.category} ${localTier.id}`);
  const aPrice = Math.round(parseFloat(artatixItem.price) || 0);

  // Strict Tier Isolation Guards: Never cross-match between Presale, Early Bird, and Blind
  const isLocalPresale = lText.includes('presale');
  const isArtatixPresale = aText.includes('presale');
  if (isLocalPresale !== isArtatixPresale) {
    return false;
  }

  const isLocalEarly = lText.includes('early') || lText.includes('bird');
  const isArtatixEarly = aText.includes('early') || aText.includes('bird');
  if (isLocalEarly !== isArtatixEarly) {
    return false;
  }

  const isLocalBlind = lText.includes('blind');
  const isArtatixBlind = aText.includes('blind');
  if (isLocalBlind !== isArtatixBlind) {
    return false;
  }

  // 2. Blind Ticket Matching
  if (isLocalBlind && isArtatixBlind) {
    if ((lText.includes('day 1') || lText.includes('day1')) && (aText.includes('day 1') || aText.includes('day1'))) {
      return true;
    }
    if ((lText.includes('day 2') || lText.includes('day2')) && (aText.includes('day 2') || aText.includes('day2'))) {
      return true;
    }
  }

  // 3. Presale 1 Matching
  if (isLocalPresale && isArtatixPresale) {
    // 2 Days Pass
    if ((lText.includes('2 day') || lText.includes('2days')) && (aText.includes('2 day') || aText.includes('2days') || aText.includes('terusan'))) {
      return true;
    }
    // Couple Pass
    if (lText.includes('couple') && aText.includes('couple')) {
      return true;
    }
    // Group Pass
    if (lText.includes('group') && aText.includes('group')) {
      return true;
    }
    // Single 1 Day Pass
    if (
      !lText.includes('couple') && !lText.includes('group') && !lText.includes('2 day') &&
      !aText.includes('couple') && !aText.includes('group') && !aText.includes('2 day')
    ) {
      if ((lText.includes('day 1') || lText.includes('single') || lText.includes('1 day')) && (aText.includes('day 1') || aText.includes('single') || aText.includes('1 day'))) {
        return true;
      }
    }
    // Price match fallback within Presale
    if (aPrice > 0 && aPrice === localTier.price) {
      return true;
    }
    return false;
  }

  // 4. Early Bird 2 Days Pass Matching
  const isLocal2Day = lText.includes('2 day') || lText.includes('2days') || lText.includes('pass') || localTier.id === 'tkt-early-2days';
  const isArtatix2Day = aText.includes('2 day') || aText.includes('2days') || aText.includes('terusan') || aText.includes('pass');

  if (isLocal2Day) {
    return isArtatix2Day;
  }

  // If local tier is single day, it must NEVER match a 2-day pass
  if (isArtatix2Day) {
    return false;
  }

  // 5. Early Bird Single Day Matching
  if (isLocalEarly && isArtatixEarly) {
    if ((lText.includes('day 1') || lText.includes('day1')) && (aText.includes('day 1') || aText.includes('day1'))) {
      return true;
    }
    if ((lText.includes('day 2') || lText.includes('day2')) && (aText.includes('day 2') || aText.includes('day2'))) {
      return true;
    }
  }

  // 6. Price-level match fallback if single day
  if (aPrice > 0 && aPrice === localTier.price) {
    if (lText.includes('day 1') && aText.includes('day 1')) return true;
    if (lText.includes('day 2') && aText.includes('day 2')) return true;
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
  const isDevLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // In local dev use Vite proxy; in production cPanel use api-artatix.php
  const candidateEndpoints = isDevLocal
    ? ['/api-artatix/customer/ticket/swear_in_continental?isTicketExclusive=0&isMerch=0']
    : ['./api-artatix.php', '/api-artatix.php'];

  for (const endpoint of candidateEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      // Guard against .htaccess SPA fallback returning index.html
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
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
