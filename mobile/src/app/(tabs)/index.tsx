import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { api, useRemote } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { dateLabel, placeName, roundName, teamName } from "@/lib/i18n";
import { isUs, outcome } from "@/lib/football";
import { C } from "@/lib/theme";
import { Card, ErrorNote, H2, Loading, NewsCard, Screen, TableCard, Tag } from "@/components/ui";

export default function Home() {
  const { lang, d } = useLang();
  const router = useRouter();
  const foot = useRemote("football", api.football);
  const news = useRemote("homeNews", api.homeNews);
  const refreshing = foot.refreshing || news.refreshing;
  const refresh = () => {
    foot.refresh();
    news.refresh();
  };

  const next = foot.data?.upcoming[0];
  const last = foot.data?.results[0];
  const rows = foot.data?.standings ?? [];
  const i = rows.findIndex((r) => isUs(r.team));
  const start = Math.max(0, Math.min(i - 2, rows.length - 5));
  const o = last ? outcome(last) : null;

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={{ backgroundColor: C.ink, borderRadius: 16, padding: 20, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image source={require("../../../assets/icon.png")} style={{ width: 52, height: 52, borderRadius: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.sky, fontWeight: "700", fontSize: 12, letterSpacing: 1 }}>
              {d.league} · {d.season}
            </Text>
            <Text style={{ color: C.white, fontWeight: "800", fontSize: 22 }}>{d.heroTitle}</Text>
          </View>
        </View>
        {next ? (
          <View style={{ backgroundColor: C.ink2, borderRadius: 12, borderWidth: 1, borderColor: C.inkLine, padding: 16, gap: 10 }}>
            <Text style={{ color: C.onDark2, fontWeight: "700", fontSize: 12, letterSpacing: 1 }}>{d.nextMatch.toUpperCase()}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={{ flex: 1, color: C.white, fontWeight: "800", fontSize: 17, textAlign: "center" }}>{teamName(lang, next.home)}</Text>
              <Text style={{ color: C.onDark2, fontWeight: "800", fontSize: 18 }}>VS</Text>
              <Text style={{ flex: 1, color: C.white, fontWeight: "800", fontSize: 17, textAlign: "center" }}>{teamName(lang, next.away)}</Text>
            </View>
            <Text style={{ color: C.onDark, fontSize: 14, textAlign: "center" }}>
              {dateLabel(lang, next.date_label)} · {next.kickoff} · {roundName(lang, next.round)}
            </Text>
            {next.venue ? <Text style={{ color: C.onDark2, fontSize: 13, textAlign: "center" }}>{placeName(lang, next.venue)}</Text> : null}
          </View>
        ) : null}
      </View>

      {foot.error && !foot.data ? <ErrorNote onRetry={refresh} /> : null}

      {last ? (
        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: C.ink }}>{d.lastResult}</Text>
            {o ? <Tag kind={o} label={d.outcome[o]} /> : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ flex: 1, fontWeight: "700", fontSize: 15, color: C.ink }}>{teamName(lang, last.home)}</Text>
            <Text style={{ fontSize: 30, fontWeight: "800", color: C.ink }}>
              {last.home_score} : {last.away_score}
            </Text>
            <Text style={{ flex: 1, fontWeight: "700", fontSize: 15, color: C.ink, textAlign: "right" }}>{teamName(lang, last.away)}</Text>
          </View>
          <Text style={{ color: C.muted, fontSize: 13 }}>
            {roundName(lang, last.round)} · {dateLabel(lang, last.date_label)} · {isUs(last.home) ? d.home : d.away}
          </Text>
        </Card>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <H2>{d.latestNews}</H2>
        <Pressable onPress={() => router.navigate("/news")} hitSlop={12} accessibilityRole="link">
          <Text style={{ color: C.blue, fontWeight: "700" }}>{d.allNews} →</Text>
        </Pressable>
      </View>
      {!news.data && !news.error ? <Loading /> : null}
      {news.data?.items.length === 0 ? <Text style={{ color: C.muted }}>{d.newsSoon}</Text> : null}
      {news.data?.items.slice(0, 3).map((n, k) => <NewsCard key={n.id} n={n} lang={lang} big={k === 0} />)}

      {rows.length ? (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <H2>
              {d.league} — {d.table}
            </H2>
            <Pressable onPress={() => router.navigate("/matches")} hitSlop={12} accessibilityRole="link">
              <Text style={{ color: C.blue, fontWeight: "700" }}>{d.fullTable}</Text>
            </Pressable>
          </View>
          <TableCard rows={rows.slice(start, start + 5)} compact total={rows.length} />
        </>
      ) : null}
    </Screen>
  );
}
