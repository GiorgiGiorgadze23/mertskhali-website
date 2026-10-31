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
};

export type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export const CLUB = "მერცხალი";

export const CATEGORIES = ["მატჩი", "კლუბი", "ტრანსფერი", "აკადემია"] as const;
