import type { StationType, WizardStep } from "./booking-types";

export const STEP_TITLE: Record<WizardStep, string> = {
  tip: "Ce vrei să joci",
  pers: "Câți sunteți",
  zi: "În ce zi vii",
  ora: "La ce oră și cât stai",
  date: "Ultimul pas",
};

export function stepsFor(type: StationType | null): WizardStep[] {
  return type === "volan" ? ["tip", "zi", "ora", "date"] : ["tip", "pers", "zi", "ora", "date"];
}

export const STATION_ICON: Record<StationType, string> = {
  pc: '<path d="M6 8h28v18H6z"/><path d="M14 32h12M18 26v6M22 26v6"/><path d="M4 36h32"/>',
  ps5: '<rect x="5" y="9" width="30" height="19" rx="2"/><path d="M13 34h14M20 28v6"/><path d="M11 15h5M13.5 12.5v5M26 15h.01M29 18h.01"/>',
  volan: '<circle cx="20" cy="21" r="12"/><circle cx="20" cy="21" r="3"/><path d="M20 9v6M9.6 27l5.2-3M30.4 27l-5.2-3"/>',
};

export const STATION_PICK_DESCRIPTION: Record<StationType, string> = {
  ps5: "Ecran mare, două controllere, canapea. Prețul e pe stație — veniți în doi, costă la fel.",
  pc: "Periferice de gaming, conturile tale. CS2, Valorant, League of Legends, Fortnite.",
  volan: "Volan cu pedale și ecran propriu. Forza, Assetto Corsa, Dirt 5, WRC.",
};
