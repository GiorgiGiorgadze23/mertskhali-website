import { NextResponse } from "next/server";

/** JSON for the mobile app. Cached at the edge for a short while so the app stays fast. */
export function json(data: unknown, maxAge = 60) {
  return NextResponse.json(data, {
    headers: {
      "cache-control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 5}`,
      "access-control-allow-origin": "*",
    },
  });
}
