import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { Match, News, Player, Standing } from "./types";

export const API = (Constants.expoConfig?.extra?.apiUrl as string) || "https://mertskhali-website.vercel.app";

export type Football = { standings: Standing[]; upcoming: Match[]; results: Match[]; players: Player[]; updatedAt: string };
export type NewsList = { items: News[]; total: number };

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  football: () => getJSON<Football>("/api/v1/football"),
  news: (page = 1, cat?: string) => getJSON<NewsList>(`/api/v1/news?page=${page}&limit=10${cat ? `&cat=${encodeURIComponent(cat)}` : ""}`),
  homeNews: () => getJSON<NewsList>("/api/v1/news?limit=5&featured=1"),
  article: (slug: string) => getJSON<{ item?: News; error?: string }>(`/api/v1/news/${encodeURIComponent(slug)}`),
  registerPush: (token: string, lang: string) =>
    fetch(API + "/api/v1/push-token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, lang }) }),
};

/**
 * Loads data, shows the last saved copy immediately (works offline), refreshes from the site,
 * and supports pull-to-refresh.
 */
export function useRemote<T>(key: string, load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fresh = await load();
      setData(fresh);
      setError(null);
      AsyncStorage.setItem("cache:" + key, JSON.stringify(fresh)).catch(() => {});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("cache:" + key)
      .then((s) => {
        if (alive && s) setData((d) => d ?? (JSON.parse(s) as T));
      })
      .catch(() => {});
    refresh();
    return () => {
      alive = false;
    };
  }, [key, refresh]);

  return { data, error, refreshing, refresh };
}
