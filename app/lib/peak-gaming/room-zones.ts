export type ZoneKey = "pc" | "ps5" | "volan" | "bar";

export interface ZoneInfo {
  tag: string;
  title: string;
  text: string;
  capacity: string;
  hours: string;
}

export const ZONE_ORDER: ZoneKey[] = ["pc", "ps5", "volan", "bar"];

export const ZONE_LABEL: Record<ZoneKey, string> = {
  pc: "PC-uri",
  ps5: "PlayStation 5",
  volan: "Curse",
  bar: "Bar",
};

export const ZONE_INFO: Record<ZoneKey, ZoneInfo> = {
  pc: {
    tag: "ZONA PC",
    title: "Nouă calculatoare de gaming",
    text: "Un singur rând de-a lungul peretelui din dreapta, cu periferice de gaming la fiecare post. CS2, Valorant, League of Legends, Fortnite și orice altceva instalezi. Te loghezi pe conturile tale și continui de unde ai rămas.",
    capacity: "9 posturi",
    hours: "de la 12 lei/h",
  },
  ps5: {
    tag: "ZONA PLAYSTATION",
    title: "Cinci pod-uri PS5",
    text: "Pe partea stângă, cinci pod-uri cu ecran mare, canapea și două controllere. Prețul e pe stație, nu pe persoană — vii singur sau în doi, costă la fel. FC 26, NBA 2K25, UFC 5, Mortal Kombat, It Takes Two.",
    capacity: "5 stații",
    hours: "de la 25 lei/h",
  },
  volan: {
    tag: "POSTUL DE CURSE",
    title: "Volan cu pedale",
    text: "În fundul sălii, la mijloc, chiar sub siglă. Volan cu pedale și ecran propriu. Forza Horizon 5, Assetto Corsa Competizione, Dirt 5, WRC și Need for Speed Heat.",
    capacity: "1 post",
    hours: "tarif PS5",
  },
  bar: {
    tag: "BAR",
    title: "Gustări și băuturi",
    text: "Chiar la intrare, în mijlocul sălii. Frigidere cu băuturi reci, gustări și trei scaune înalte. Nu trebuie să ieși din sală în mijlocul unei partide.",
    capacity: "La intrare",
    hours: "12–24",
  },
};

export const ZONE_DEFAULT: ZoneInfo = {
  tag: "TRECI PESTE MACHETĂ",
  title: "14 stații, o singură sală",
  text: "PC-urile pe dreapta, pod-urile PlayStation pe stânga, volanul în fundul sălii sub siglă și barul la intrare. Rotește macheta sau alege o zonă.",
  capacity: "14",
  hours: "12–24",
};
