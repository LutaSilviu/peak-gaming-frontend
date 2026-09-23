import { pad2 } from "./booking-dates";
import { STATION_NAME } from "./booking-pricing";
import type { StationType } from "./booking-types";

const CODE_CHARS = "ACDEFHJKLMNPRTUVWXY379";

export function generateConfirmationCode(): string {
  let r = "";
  for (let i = 0; i < 3; i++) r += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return `PK-${r}${Math.floor(10 + Math.random() * 89)}`;
}

export function buildCalendarFileUrl(params: {
  code: string;
  type: StationType;
  date: string;
  hour: number;
  duration: number;
  total: number | null;
}): string {
  const { code, type, date, hour, duration, total } = params;
  const start = new Date(`${date}T${pad2(hour)}:00:00`);
  const end = new Date(start.getTime() + duration * 3600000);
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Peak Gaming//RO",
    "BEGIN:VEVENT",
    `UID:${code}@peak-gaming`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Peak Gaming — ${STATION_NAME[type]}`,
    "LOCATION:Strada Leca Morariu 2B, etaj 1, Suceava",
    `DESCRIPTION:Rezervare ${code}. ${total} lei.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  try {
    return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  } catch {
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
  }
}
