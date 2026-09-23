import type { Reservation } from "./booking-types";

const memoryFallback = new Map<string, Reservation[]>();

const keyFor = (date: string) => `rezv3:${date}`;

// Reservations live in the browser's localStorage while BOOKING_ENDPOINT is
// unset (see booking-wizard.tsx). This is intentionally the same storage
// format as the original static site, so existing demo data keeps working.
export function readDay(date: string): Reservation[] {
  const key = keyFor(date);
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as Reservation[];
  } catch {
    // localStorage unavailable (private mode, disabled) — fall through.
  }
  return memoryFallback.get(key) ?? [];
}

export function writeDay(date: string, list: Reservation[]): void {
  const key = keyFor(date);
  memoryFallback.set(key, list);
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage unavailable — the in-memory fallback still holds the write.
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();

/** Lets the admin panel react when the wizard writes a new reservation, and vice versa. */
export function subscribeToReservations(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyReservationsChanged(): void {
  listeners.forEach((l) => l());
}
