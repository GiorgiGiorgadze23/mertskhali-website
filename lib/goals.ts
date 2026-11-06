import type { Match } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

/** "Name 10', 79'; Name 54'" per team, from the GFF match events. */
export function goalLines(m: Match, lang: Lang): ["home" | "away", string][] {
  const out: ["home" | "away", string][] = [];
  for (const side of ["home", "away"] as const) {
    const by = new Map<string, string[]>();
    for (const e of m.details?.events ?? []) {
      if (e.side !== side || !/^(goal|goal_p|penalty|own_goal)$/.test(e.type)) continue;
      const name = lang === "en" ? e.en : e.ka;
      const min = `${e.minute}${e.extra ? `+${e.extra}` : ""}'${e.type === "own_goal" ? (lang === "en" ? " (OG)" : " (ავტ.)") : e.type !== "goal" ? (lang === "en" ? " (pen.)" : " (პენ.)") : ""}`;
      by.set(name, [...(by.get(name) ?? []), min]);
    }
    if (by.size) out.push([side, [...by].map(([n, mins]) => `${n} ${mins.join(", ")}`).join("; ")]);
  }
  return out;
}

