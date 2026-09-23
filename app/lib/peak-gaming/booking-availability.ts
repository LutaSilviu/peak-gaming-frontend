import { STATION_CAPACITY, STATION_CATALOG } from "./booking-pricing";
import type { Reservation, StationType } from "./booking-types";

function occupiedStations(day: Reservation[], type: StationType, hour: number, duration: number): Set<string> {
  const occupied = new Set<string>();
  for (const r of day) {
    if (r.stare === "anulata") continue;
    const overlaps = Math.max(r.ora, hour) < Math.min(r.ora + r.durata, hour + duration);
    if (overlaps) {
      (r.statii || []).forEach((id) => {
        if (STATION_CATALOG[type].includes(id)) occupied.add(id);
      });
    }
  }
  return occupied;
}

export function freeStationCount(day: Reservation[], type: StationType, hour: number, duration: number): number {
  return STATION_CAPACITY[type] - occupiedStations(day, type, hour, duration).size;
}

export function assignStations(
  day: Reservation[],
  type: StationType,
  hour: number,
  duration: number,
  count: number,
): string[] {
  const occupied = occupiedStations(day, type, hour, duration);
  return STATION_CATALOG[type].filter((id) => !occupied.has(id)).slice(0, count);
}
