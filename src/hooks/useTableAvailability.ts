// Custom hook for managing multi-floor table availability and real-time state
import { useState, useEffect, useCallback, useMemo } from 'react';
import { FloorLevel, TableLiveState, FloorStats } from '../types/tableTypes';
import { getFloorSpots, findSpotById } from '../data/floorPlanData';
import { fetchTableStates, subscribeTableChanges, isTableAvailable } from '../services/tableService';

export function useTableAvailability(
  initialDay: 'day-1' | 'day-2' = 'day-1',
  initialFloor: FloorLevel = 1
) {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2'>(initialDay);
  const [currentFloor, setCurrentFloor] = useState<FloorLevel>(initialFloor);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [states, setStates] = useState<Record<string, TableLiveState>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load states on day change
  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const fresh = await fetchTableStates(selectedDay);
      setStates(fresh);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    reload();
    const unsub = subscribeTableChanges(selectedDay, updated => {
      setStates(updated);
    });
    return () => unsub();
  }, [selectedDay, reload]);

  // Spots for current floor
  const floorSpots = useMemo(() => {
    return getFloorSpots(currentFloor);
  }, [currentFloor]);

  // Selected Spot metadata
  const selectedSpot = useMemo(() => {
    if (!selectedSpotId) return null;
    return findSpotById(selectedSpotId) || null;
  }, [selectedSpotId]);

  // Selected Spot Status
  const selectedSpotStatus = useMemo(() => {
    if (!selectedSpotId) return 'available';
    return states[selectedSpotId]?.status || 'available';
  }, [selectedSpotId, states]);

  // Statistics for current floor
  const floorStats: FloorStats = useMemo(() => {
    let available = 0;
    let reserved = 0;

    floorSpots.forEach(s => {
      if (isTableAvailable(s.id, states)) {
        available++;
      } else {
        reserved++;
      }
    });

    return {
      totalSpots: floorSpots.length,
      availableCount: available,
      reservedCount: reserved
    };
  }, [floorSpots, states]);

  const selectSpot = useCallback((id: string | null) => {
    setSelectedSpotId(id);
  }, []);

  return {
    selectedDay,
    setSelectedDay,
    currentFloor,
    setCurrentFloor,
    selectedSpotId,
    selectedSpot,
    selectedSpotStatus,
    selectSpot,
    states,
    isLoading,
    reload,
    floorSpots,
    floorStats
  };
}
