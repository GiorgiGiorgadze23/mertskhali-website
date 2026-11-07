import { after } from "next/server";
import { serviceClient } from "@/lib/supabase/clients";
import { importAgentInbox } from "@/lib/agentInbox";
import { SITE } from "@/lib/site";
import type { Standing } from "@/lib/types";

// Vercel's free plan runs the GFF cron only once a day. To get results onto the site soon after a match,
// a page visit checks how old the saved table is and, if it is stale, asks /api/sync-gff to refresh it
// in the background (after the page has been sent, so the visitor never waits). The endpoint itself
// refuses to run more often than every 10 minutes.
const STALE_MS = 30 * 60 * 1000;
let lastKick = 0;

export function refreshIfStale(standings: Standing[]) {
  const ts = standings[0]?.updated_at ? Date.parse(standings[0].updated_at) : 0;
  const now = Date.now();
  if (now - ts < STALE_MS || now - lastKick < 5 * 60 * 1000) return;
  lastKick = now;
  after(async () => {
    try {
      const secret = process.env.CRON_SECRET;
      await fetch(`${SITE}/api/sync-gff`, { headers: secret ? { authorization: `Bearer ${secret}` } : {}, cache: "no-store" });
    } catch {}
  });
}

/** Brings new files from content/agent-inbox into the database soon after a deploy (no admin visit needed). */
let lastInbox = 0;
export function importInboxInBackground() {
  const now = Date.now();
  if (now - lastInbox < 2 * 60 * 1000) return;
  lastInbox = now;
  after(async () => {
    try {
      const db = serviceClient();
      if (db) await importAgentInbox(db);
    } catch {}
  });
}
