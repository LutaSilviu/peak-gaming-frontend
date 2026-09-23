import type { StationType } from "./booking-types";

// Tariffs live in two places and must stay identical: here, and in the
// server's booking route once BOOKING_ENDPOINT is wired up. The server must
// always recompute the price — the client's total is never trusted.
export const PC_PRICE: Record<number, number> = { 1: 12, 2: 22, 3: 30, 4: 38, 5: 45, 6: 50, 8: 60, 12: 90 };
export const PS5_PRICE: Record<number, number> = { 1: 30, 2: 55, 3: 75, 5: 115 };
export const PS5_STUDENT_PRICE: Record<number, number> = { 1: 25, 2: 45, 3: 60, 5: 90 };

export const DURATIONS: Record<StationType, number[]> = {
  pc: [1, 2, 3, 4, 5, 6, 8, 12],
  ps5: [1, 2, 3, 5],
  volan: [1, 2, 3, 5],
};

export const STATION_CAPACITY: Record<StationType, number> = { pc: 9, ps5: 5, volan: 1 };
export const PEOPLE_PER_STATION: Record<StationType, number> = { pc: 1, ps5: 2, volan: 1 };
export const MAX_PEOPLE: Record<StationType, number> = { pc: 9, ps5: 10, volan: 1 };
export const STATION_NAME: Record<StationType, string> = { pc: "Calculator de gaming", ps5: "PlayStation 5", volan: "Postul de curse" };
export const STATION_SHORT_NAME: Record<StationType, string> = { pc: "PC", ps5: "PlayStation", volan: "Volan" };
export const STATION_CATALOG: Record<StationType, string[]> = {
  ps5: ["PS1", "PS2", "PS3", "PS4", "PS5"],
  pc: ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6", "PC7", "PC8", "PC9"],
  volan: ["VOL"],
};

export const OPEN_HOUR = 12;
export const CLOSE_HOUR = 24;

export function unitsFor(type: StationType, people: number): number {
  return Math.ceil(people / PEOPLE_PER_STATION[type]);
}

/** The 12:00–16:00 day rate applies whenever the whole booked interval falls inside it. */
export function isDayOffer(hour: number | null, duration: number): boolean {
  return hour !== null && hour >= 12 && hour + duration <= 16;
}

export function pricePerUnit(
  type: StationType,
  duration: number,
  hour: number | null,
  student: boolean,
): number | null {
  if (type === "pc") {
    const p = PC_PRICE[duration];
    return p == null ? null : isDayOffer(hour, duration) ? Math.min(p, 12 * duration) : p;
  }
  const table = student ? PS5_STUDENT_PRICE : PS5_PRICE;
  const p = table[duration];
  return p == null ? null : isDayOffer(hour, duration) ? Math.min(p, 20 * duration) : p;
}

export function totalPrice(
  type: StationType | null,
  duration: number,
  hour: number | null,
  people: number,
  student: boolean,
): number | null {
  if (!type) return null;
  const p = pricePerUnit(type, duration, hour, student);
  return p == null ? null : p * unitsFor(type, people);
}
