export type CasinoOutcome = "jackpot" | "pair" | "nothing";

export interface CasinoRecord {
  id: string;
  spun_at: string;
  reels: string[];
  outcome: CasinoOutcome;
  message: string | null;
}

export const CASINO_SYMBOL_LABELS: Record<string, string> = {
  "front-desk": "Front Desk",
  martini: "Martini",
  "golden-boy": "Golden Boy",
  "star-treatment": "Star Treatment",
  "lunar-surface": "Lunar Surface",
  "economic-review": "Economic Review",
  "media-feed": "Media Feed",
  terminal: "Terminal",
  observatory: "Observatory",
  cinema: "Cinema",
  library: "Library",
  coordinates: "Coordinates",
};
