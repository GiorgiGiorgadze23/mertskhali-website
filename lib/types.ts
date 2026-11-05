export type News = {
  id: string;
  slug: string;
  title: string;
  title_en?: string | null;
  category: string;
  excerpt: string | null;
  excerpt_en?: string | null;
  body: string | null;
  body_en?: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  source?: string | null;
  fb_url?: string | null;
};

export type Player = {
  id: string;
  name: string;
  name_en?: string | null;
  position: "GK" | "DF" | "MF" | "FW";
  number: string | null;
  birth_year: number | null;
  photo_url: string | null;
  sort: number;
};

export type Standing = {
  pos: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  logo_url: string | null;
  updated_at?: string;
};

export type Match = {
  id: string;
  round: string;
  date_label: string;
  home: string;
  away: string;
  home_score: number | null;
  away_score: number | null;
  kickoff: string | null;
  venue: string | null;
  played: boolean;
  sort: number;
  gff_path?: string | null;
  details?: MatchDetails | null;
};

export type MatchEvent = { minute: number; extra: number | null; side: "home" | "away"; type: string; ka: string; en: string };
export type LineupPlayer = { num: string; name: string; captain: boolean };
export type Lineup = { starters: LineupPlayer[]; subs: LineupPlayer[]; coach: string | null };
export type MatchDetails = { events: MatchEvent[]; home: Lineup; away: Lineup; referees: { role: string; name: string }[]; kickoffAt: string | null };

export type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export const CLUB = "მერცხალი";

export const CATEGORIES = ["მატჩი", "კლუბი", "ტრანსფერი", "აკადემია"] as const;
