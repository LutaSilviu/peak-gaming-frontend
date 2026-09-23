const WEEKDAY = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
const MONTH = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];

export const pad2 = (n: number): string => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function formatDayLabel(isoDate: string): string {
  if (!isoDate) return "—";
  const d = new Date(`${isoDate}T12:00:00`);
  return `${WEEKDAY[d.getDay()]}, ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

export function weekdayShort(d: Date): string {
  return WEEKDAY[d.getDay()].slice(0, 3);
}

export function monthShort(d: Date): string {
  return MONTH[d.getMonth()];
}

export function formatHourRange(hour: number | null, duration: number): string {
  if (hour === null) return "—";
  return `${pad2(hour)}:00 – ${pad2(hour + duration)}:00`;
}
