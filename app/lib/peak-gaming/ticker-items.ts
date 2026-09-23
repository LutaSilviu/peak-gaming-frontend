export interface TickerItem {
  live?: boolean;
  label: string;
  detail: string;
}

export const TICKER_ITEMS: TickerItem[] = [
  { live: true, label: "Deschis acum", detail: "12:00 – 24:00" },
  { label: "5 stații", detail: "PlayStation 5" },
  { label: "9 PC-uri", detail: "de gaming" },
  { label: "Volan", detail: "Forza · WRC · Dirt 5" },
  { label: "12 lei", detail: "prima oră pe PC" },
  { label: "Elev sau student", detail: "–20% la PS5" },
  { label: "Leca Morariu 2B", detail: "etaj 1, Suceava" },
];
