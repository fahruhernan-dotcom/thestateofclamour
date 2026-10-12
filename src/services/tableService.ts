// Service to fetch and subscribe to table reservations from Supabase with resilient offline fallback
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { TableLiveState } from '../types/tableTypes';
import { INITIAL_OCCUPIED_SPOTS, getAllSpots } from '../data/floorPlanData';

const TABLE_NAME = import.meta.env.VITE_SUPABASE_TABLE_NAME || 'table_reservations';

// In-memory cache for fast lookup
let cachedStates: Record<string, TableLiveState> = {};

/**
 * Builds initial local fallback states based on seeded spots.
 */
function getInitialLocalStates(day: 'day-1' | 'day-2'): Record<string, TableLiveState> {
  const all = getAllSpots();
  const map: Record<string, TableLiveState> = {};

  all.forEach(spot => {
    const isOccupied = Boolean(INITIAL_OCCUPIED_SPOTS[spot.id]);
    map[spot.id] = {
      spotId: spot.id,
      status: isOccupied ? 'reserved' : 'available',
      day: isOccupied ? day : 'both',
      updatedAt: new Date().toISOString()
    };
  });

  return map;
}

/**
 * Fetches current table statuses from Supabase.
 * If Supabase is not configured or an error occurs, falls back gracefully to local seed states.
 */
export async function fetchTableStates(
  day: 'day-1' | 'day-2' = 'day-1'
): Promise<Record<string, TableLiveState>> {
  if (!isSupabaseConfigured || !supabase) {
    // Return local state if Supabase environment variables are not yet provided
    cachedStates = getInitialLocalStates(day);
    return cachedStates;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .or(`day.eq.${day},day.eq.both`);

    if (error) {
      console.warn('[TableService] Supabase fetch error, using fallback:', error.message);
      cachedStates = getInitialLocalStates(day);
      return cachedStates;
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const map: Record<string, TableLiveState> = getInitialLocalStates(day);

      data.forEach(row => {
        const spotId = row.spot_id || row.spotId || row.id;
        if (spotId) {
          const isReserved = row.is_reserved === true || row.status === 'reserved' || row.status === 'occupied';
          map[spotId] = {
            spotId,
            status: isReserved ? 'reserved' : 'available',
            day: row.day || day,
            reservedBy: row.reserved_by || row.reservedBy,
            updatedAt: row.updated_at || row.updatedAt
          };
        }
      });

      cachedStates = map;
      return map;
    }

    // Table exists in Supabase but is empty: return default availability
    cachedStates = getInitialLocalStates(day);
    return cachedStates;
  } catch (err) {
    console.error('[TableService] Unexpected error querying Supabase:', err);
    cachedStates = getInitialLocalStates(day);
    return cachedStates;
  }
}

/**
 * Subscribes to real-time changes in Supabase if configured.
 * Returns an unsubscribe function.
 */
export function subscribeTableChanges(
  day: 'day-1' | 'day-2',
  onChange: (updated: Record<string, TableLiveState>) => void
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    // Offline polling mock interval fallback
    const interval = setInterval(async () => {
      const states = await fetchTableStates(day);
      onChange(states);
    }, 30000);
    return () => clearInterval(interval);
  }

  const channel = supabase
    .channel('realtime:tables')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      async () => {
        const freshStates = await fetchTableStates(day);
        onChange(freshStates);
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Checks if a specific spot is available given current states map.
 */
export function isTableAvailable(
  spotId: string,
  states: Record<string, TableLiveState>
): boolean {
  const item = states[spotId];
  if (!item) return true; // Default available
  return item.status === 'available';
}
