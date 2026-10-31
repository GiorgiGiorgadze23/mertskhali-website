import type { Match } from "./types";

export const CLUB = "მერცხალი";
export const isUs = (team: string) => team.startsWith(CLUB);

export function outcome(m: Match): "win" | "loss" | "draw" | null {
  if (m.home_score == null || m.away_score == null) return null;
  const diff = isUs(m.home) ? m.home_score - m.away_score : m.away_score - m.home_score;
  return diff > 0 ? "win" : diff < 0 ? "loss" : "draw";
}
