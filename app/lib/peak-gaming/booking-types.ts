export type StationType = "pc" | "ps5" | "volan";

export interface Reservation {
  /** Only present for reservations fetched from the backend API (not localStorage-only ones). */
  id?: number;
  tip: StationType;
  persoane: number;
  student: boolean;
  data: string;
  ora: number;
  durata: number;
  nume: string;
  telefon: string;
  sursa: string;
  cod: string;
  statii: string[];
  total: number | null;
  stare: "noua" | "confirmata" | "anulata";
  creat: number;
}

export interface BookingState {
  tip: StationType | null;
  pers: number;
  student: boolean;
  date: string;
  dur: number;
  hour: number | null;
  name: string;
  tel: string;
}

export type WizardStep = "tip" | "pers" | "zi" | "ora" | "date";
