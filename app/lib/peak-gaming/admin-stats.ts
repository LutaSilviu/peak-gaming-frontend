import type { Reservation } from "./booking-types";

export interface DayStats {
  total: number;
  peopleExpected: number;
  stationHours: number;
  estimatedRevenue: number;
  cancelled: number;
}

export function computeDayStats(list: Reservation[]): DayStats {
  const active = list.filter((r) => r.stare !== "anulata");
  return {
    total: active.length,
    peopleExpected: active.reduce((sum, r) => sum + (r.persoane || 0), 0),
    stationHours: active.reduce((sum, r) => sum + r.durata * (r.statii ? r.statii.length : 0), 0),
    estimatedRevenue: active.reduce((sum, r) => sum + (r.total || 0), 0),
    cancelled: list.length - active.length,
  };
}
