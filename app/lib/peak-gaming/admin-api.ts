import { SLOTS_ENDPOINT } from "./booking-config";
import type { DayStats } from "./admin-stats";
import type { Reservation } from "./booking-types";

/** True when the wizard/admin panel should talk to the real backend instead of localStorage. */
export const ADMIN_API_ENABLED = !!SLOTS_ENDPOINT;

function adminHeaders(adminKey: string): HeadersInit {
  return { "Content-Type": "application/json", "X-Admin-Key": adminKey };
}

export async function fetchDay(date: string): Promise<Reservation[]> {
  const r = await fetch(`${SLOTS_ENDPOINT}?data=${encodeURIComponent(date)}`);
  if (!r.ok) throw new Error(`Failed to load reservations for ${date}: ${r.status}`);
  const j = await r.json();
  return j.rezervari ?? [];
}

/**
 * Also doubles as the admin-key check: the backend rejects this call with
 * 401 unless X-Admin-Key is correct, so there's no separate client-side
 * password to keep in sync (or leak) — the real key is the only key.
 */
export async function fetchDayStats(date: string, adminKey: string): Promise<DayStats> {
  const r = await fetch(`${SLOTS_ENDPOINT}/stats?data=${encodeURIComponent(date)}`, {
    headers: adminHeaders(adminKey),
  });
  if (!r.ok) throw new Error(`Failed to load stats for ${date}: ${r.status}`);
  const j = await r.json();
  return {
    total: j.total,
    peopleExpected: j.peopleExpected,
    stationHours: j.stationHours,
    estimatedRevenue: j.estimatedRevenue,
    cancelled: j.cancelled,
  };
}

export async function updateReservationStatus(id: number, stare: Reservation["stare"], adminKey: string): Promise<void> {
  const r = await fetch(`${SLOTS_ENDPOINT}/${id}/stare`, {
    method: "PATCH",
    headers: adminHeaders(adminKey),
    body: JSON.stringify({ stare }),
  });
  if (!r.ok) throw new Error(`Failed to update reservation ${id}: ${r.status}`);
}
