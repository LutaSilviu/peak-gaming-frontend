export type Platform = "ps5" | "pc";

export type ArtKey =
  | "fotbal"
  | "baschet"
  | "lupte"
  | "ring"
  | "curse"
  | "tras"
  | "coop"
  | "sandbox"
  | "br"
  | "moba";

export interface GameEntry {
  name: string;
  genre: string;
  art: ArtKey;
  tileClass: string;
  colorA: string;
  colorB: string;
  glow: string;
  image: string;
}

// Icon paths, drawn on a 100x100 viewBox. Used as a fallback when a game has
// no photo, or while the photo is loading.
export const GAME_ART: Record<ArtKey, string> = {
  fotbal: '<rect x="6" y="16" width="88" height="68"/><path d="M50 16v68"/><circle cx="50" cy="50" r="14"/><path d="M6 34h14v32H6M94 34H80v32h14"/>',
  baschet: '<rect x="6" y="16" width="88" height="68"/><path d="M6 32h24v36H6"/><circle cx="30" cy="50" r="11"/><path d="M94 24a40 40 0 0 0 0 52"/><path d="M50 16v68"/>',
  lupte: '<path d="M8 50 38 28v44z"/><path d="M92 50 62 28v44z"/><path d="M50 16v14M50 70v14M40 40l-8-8M60 40l8-8M40 60l-8 8M60 60l8 8"/>',
  ring: '<rect x="10" y="24" width="80" height="56"/><path d="M10 38h80M10 52h80M10 66h80"/><path d="M10 24v-8M90 24v-8M10 80v8M90 80v8"/>',
  curse: '<path d="M26 78c-16 0-18-24 0-26s54 4 54-16-30-16-42-2"/><path d="M74 24l8 6-8 6"/><rect x="14" y="10" width="8" height="8"/><rect x="22" y="18" width="8" height="8"/><rect x="22" y="10" width="8" height="8" fill="var(--gl)" stroke="none" opacity=".55"/><rect x="14" y="18" width="8" height="8" fill="var(--gl)" stroke="none" opacity=".55"/>',
  tras: '<circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="4"/><path d="M50 6v26M50 68v26M6 50h26M68 50h26"/>',
  coop: '<circle cx="36" cy="50" r="22"/><circle cx="64" cy="50" r="22"/><path d="M50 34v32"/>',
  sandbox: '<path d="M50 12 84 30 50 48 16 30z"/><path d="M16 30v34l34 18V48"/><path d="M84 30v34L50 82"/>',
  br: '<circle cx="50" cy="50" r="38" stroke-dasharray="7 7"/><circle cx="50" cy="50" r="24"/><circle cx="50" cy="50" r="9"/><path d="M50 12v10"/>',
  moba: '<path d="M14 86 86 14"/><path d="M14 50h72" stroke-dasharray="6 8"/><path d="M14 14v72h72"/><circle cx="18" cy="82" r="5"/><circle cx="82" cy="18" r="5"/>',
};

// The site's own image-optimization endpoint. Falls back to the drawn icon
// (GAME_ART) when a game has no photo, or the photo fails to load.
export const GAME_IMAGE_BASE = "https://peak-gaming.site/_next/image?url=%2F";
export const GAME_IMAGE_QUERY = "&w=640&q=70";

export const GAMES: Record<Platform, GameEntry[]> = {
  ps5: [
    { name: "FC 26", genre: "Fotbal", art: "fotbal", tileClass: "big", colorA: "#0F5C33", colorB: "#07203F", glow: "#38F58F", image: "fc.avif" },
    { name: "NBA 2K25", genre: "Baschet", art: "baschet", tileClass: "", colorA: "#6B2A08", colorB: "#1E0A33", glow: "#FF9A3C", image: "2k25.jpg" },
    { name: "UFC 5", genre: "Lupte", art: "lupte", tileClass: "", colorA: "#7A0F1C", colorB: "#230716", glow: "#FF4A5C", image: "ufc.avif" },
    { name: "Mortal Kombat 11", genre: "Lupte", art: "lupte", tileClass: "", colorA: "#521206", colorB: "#12051A", glow: "#FF7A2E", image: "mortal-kombat2.jpg" },
    { name: "WWE 2K24", genre: "Wrestling", art: "ring", tileClass: "", colorA: "#5E1029", colorB: "#100826", glow: "#FF3E6E", image: "wwe.jpg" },
    { name: "Forza Horizon 5", genre: "Curse", art: "curse", tileClass: "w2 h2", colorA: "#7A4206", colorB: "#0A2440", glow: "#FFC24A", image: "forza.jpg" },
    { name: "It Takes Two", genre: "Co-op", art: "coop", tileClass: "", colorA: "#1E4F6B", colorB: "#4A1A44", glow: "#57D9F0", image: "it_takes_two.jpg" },
    { name: "A Way Out", genre: "Co-op", art: "coop", tileClass: "", colorA: "#332C0C", colorB: "#0C1628", glow: "#D9C25A", image: "a_way_out.jpg" },
    { name: "Assetto Corsa", genre: "Curse", art: "curse", tileClass: "", colorA: "#14243F", colorB: "#3F0D1B", glow: "#7FB5FF", image: "assetto_corsa_competizione.jpg" },
    { name: "Need for Speed Heat", genre: "Curse", art: "curse", tileClass: "", colorA: "#6B0E46", colorB: "#0C1230", glow: "#FF4FB0", image: "need_for_speed_heat.jpg" },
    { name: "Dirt 5", genre: "Rally", art: "curse", tileClass: "", colorA: "#6B4506", colorB: "#200E28", glow: "#FFB03A", image: "dirt5.jpg" },
    { name: "WRC", genre: "Rally", art: "curse", tileClass: "", colorA: "#14401F", colorB: "#0C1630", glow: "#4FE08A", image: "w2c.jpg" },
    { name: "Fortnite", genre: "Battle royale", art: "br", tileClass: "", colorA: "#3E2478", colorB: "#0A3350", glow: "#9B7BFF", image: "fortnite.jpg" },
    { name: "Roblox", genre: "Sandbox", art: "sandbox", tileClass: "", colorA: "#4E1215", colorB: "#141428", glow: "#FF6B6B", image: "roblox.png" },
  ],
  pc: [
    { name: "CS2", genre: "Tactic 5v5", art: "tras", tileClass: "big", colorA: "#6B3E06", colorB: "#0C1628", glow: "#FFB84A", image: "2cs2.jpg" },
    { name: "Valorant", genre: "Tactic 5v5", art: "tras", tileClass: "w2 h2", colorA: "#7A1122", colorB: "#0C142F", glow: "#FF4E62", image: "valorant.png" },
    { name: "League of Legends", genre: "MOBA", art: "moba", tileClass: "w2 h2", colorA: "#0A3E4A", colorB: "#241452", glow: "#3FD9C6", image: "" },
    { name: "Fortnite", genre: "Battle royale", art: "br", tileClass: "", colorA: "#3E2478", colorB: "#0A3350", glow: "#9B7BFF", image: "2fortnite.jpg" },
    { name: "CS2 · Deathmatch", genre: "Antrenament", art: "tras", tileClass: "", colorA: "#33230A", colorB: "#101024", glow: "#E0B44A", image: "" },
    { name: "Roblox", genre: "Sandbox", art: "sandbox", tileClass: "", colorA: "#4E1215", colorB: "#141428", glow: "#FF6B6B", image: "roblox-pictures.jpg" },
  ],
};
