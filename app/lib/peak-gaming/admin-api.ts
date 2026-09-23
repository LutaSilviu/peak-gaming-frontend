import { SLOTS_ENDPOINT } from "./booking-config";
import type { DayStats } from "./admin-stats";
import type { Reservation } from "./booking-types";

// Same X-Admin-Key default the backend ships with (app.admin.api-key); override
// via NEXT_PUBLIC_ADMIN_API_KEY for a real deployment.
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? "peak2026";

/** True when the wizard/admin panel should talk to the real backend instead of localStorage. */
export const ADMIN_API_ENABLED = !!SLOTS_ENDPOINT;

function adminHeaders(): HeadersInit {
  return { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY };
}

export async function fetchDay(date: string): Promise<Reservation[]> {
  const r = await fetch(`${SLOTS_ENDPOINT}?data=${encodeURIComponent(date)}`);
  if (!r.ok) throw new Error(`Failed to load reservations for ${date}: ${r.status}`);
  const j = await r.json();
  return j.rezervari ?? [];
}

export async function fetchDayStats(date: string): Promise<DayStats> {
  const r = await fetch(`${SLOTS_ENDPOINT}/stats?data=${encodeURIComponent(date)}`, {
    headers: adminHeaders(),
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

export async function updateReservationStatus(id: number, stare: Reservation["stare"]): Promise<void> {
  const r = await fetch(`${SLOTS_ENDPOINT}/${id}/stare`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify({ stare }),
  });
  if (!r.ok) throw new Error(`Failed to update reservation ${id}: ${r.status}`);
}
