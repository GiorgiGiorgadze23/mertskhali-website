import { getMatches, getPlayers, getStandings, ourMatches } from "@/lib/data";
import { json } from "../_json";

export const dynamic = "force-dynamic";

// GET /api/v1/football → table, our fixtures/results and the squad in one call.
export async function GET() {
  const [standings, matches, players] = await Promise.all([getStandings(), getMatches(), getPlayers()]);
  const { upcoming, results } = ourMatches(matches);
  return json({ standings, upcoming, results, players, updatedAt: new Date().toISOString() }, 300);
}
