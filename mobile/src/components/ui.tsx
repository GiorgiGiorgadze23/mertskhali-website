import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { C, R } from "@/lib/theme";
import { useLang } from "@/lib/lang";
import { categoryName, dateLabel, formatDate, roundName, teamName, type Lang } from "@/lib/i18n";
import { isUs, outcome } from "@/lib/football";
import type { Match, News, Standing } from "@/lib/types";

export function Screen({ children, refreshing, onRefresh }: { children: React.ReactNode; refreshing?: boolean; onRefresh?: () => void }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.paper }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={C.blue} /> : undefined}
    >
      {children}
    </ScrollView>
  );
}

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => <View style={[s.card, style]}>{children}</View>;

export const H2 = ({ children }: { children: React.ReactNode }) => <Text style={s.h2}>{children}</Text>;

export function Loading() {
  return (
    <View style={{ paddingVertical: 48, alignItems: "center" }}>
      <ActivityIndicator color={C.blue} />
    </View>
  );
}

export function ErrorNote({ onRetry }: { onRetry: () => void }) {
  const { lang } = useLang();
  return (
    <Card style={{ alignItems: "flex-start", gap: 10 }}>
      <Text style={{ color: C.text2 }}>{lang === "ka" ? "ინტერნეტთან კავშირი ვერ მოხერხდა." : "Couldn't connect to the internet."}</Text>
      <Pressable onPress={onRetry} style={s.btnLight} accessibilityRole="button">
        <Text style={{ fontWeight: "700", color: C.ink }}>{lang === "ka" ? "თავიდან ცდა" : "Try again"}</Text>
      </Pressable>
    </Card>
  );
}

export function Tag({ kind, label }: { kind: "win" | "loss" | "draw" | "plain"; label: string }) {
  const map = { win: [C.winBg, C.winFg], loss: [C.lossBg, C.lossFg], draw: [C.drawBg, C.drawFg], plain: ["#F1F0EA", C.muted] } as const;
  const [bg, fg] = map[kind];
  return (
    <View style={{ backgroundColor: bg, borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" }}>
      <Text style={{ color: fg, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function NewsCard({ n, lang, big }: { n: News; lang: Lang; big?: boolean }) {
  const router = useRouter();
  const title = lang === "en" && n.title_en ? n.title_en : n.title;
  const excerpt = lang === "en" && n.title_en ? n.excerpt_en : n.excerpt;
  return (
    <Pressable onPress={() => router.push({ pathname: "/news/[slug]", params: { slug: n.slug } })} accessibilityRole="link" style={({ pressed }) => [s.card, { padding: 0, overflow: "hidden", opacity: pressed ? 0.85 : 1 }]}>
      {n.image_url ? (
        <Image source={n.image_url} style={{ width: "100%", height: big ? 200 : 150, backgroundColor: C.ph }} contentFit="cover" transition={150} />
      ) : null}
      <View style={{ padding: 16, gap: 6 }}>
        <Text style={{ fontSize: 12, color: C.muted }}>
          <Text style={{ color: C.blue, fontWeight: "700" }}>{categoryName(lang, n.category)}</Text>
          {"  "}
          {formatDate(lang, n.published_at)}
        </Text>
        <Text style={{ fontSize: big ? 20 : 17, fontWeight: "700", color: C.ink, lineHeight: big ? 27 : 23 }}>{title}</Text>
        {excerpt ? (
          <Text style={{ color: C.muted, fontSize: 14, lineHeight: 20 }} numberOfLines={3}>
            {excerpt}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function MatchCard({ m }: { m: Match }) {
  const { lang, d } = useLang();
  const o = outcome(m);
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: C.muted, fontSize: 13 }}>
          <Text style={{ color: C.ink, fontWeight: "700" }}>{dateLabel(lang, m.date_label)}</Text> · {roundName(lang, m.round)}
        </Text>
        {o ? <Tag kind={o} label={d.outcome[o]} /> : <Tag kind="plain" label={isUs(m.home) ? d.home : d.away} />}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={[s.team, { textAlign: "right" }, isUs(m.home) && s.us]}>{teamName(lang, m.home)}</Text>
        <View style={[s.score, !m.played && { backgroundColor: "#F1F0EA" }]}>
          <Text style={{ color: m.played ? C.white : C.ink, fontWeight: "800", fontSize: 16 }}>{m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–"}</Text>
        </View>
        <Text style={[s.team, isUs(m.away) && s.us]}>{teamName(lang, m.away)}</Text>
      </View>
    </Card>
  );
}

export function TableCard({ rows, compact, total }: { rows: Standing[]; compact?: boolean; total?: number }) {
  const { lang, d } = useLang();
  const h = d.tableHead;
  const cols = compact ? (["p", "g", "pts"] as const) : (["p", "w", "d", "l", "g", "pts"] as const);
  const n = total ?? rows.length;
  const zone = (pos: number) => (pos <= 3 ? "up" : n && pos > n - 4 ? "down" : null);
  const ZC = { up: { bar: "#2E9E5B", bg: "#F1F8F3", fg: "#1D5B34" }, down: { bar: "#D0342C", bg: "#FCF1F0", fg: "#8A1C14" } } as const;
  const val = (r: Standing, c: (typeof cols)[number]) =>
    c === "p" ? r.played : c === "w" ? r.won : c === "d" ? r.drawn : c === "l" ? r.lost : c === "g" ? `${r.goals_for}-${r.goals_against}` : r.points;
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <View style={[s.row, { backgroundColor: "#F7F8FA" }]}>
        <Text style={[s.cellPos, s.th]}>{h.pos}</Text>
        <Text style={[s.cellTeam, s.th]}>{h.team}</Text>
        {cols.map((c) => (
          <Text key={c} style={[c === "g" ? s.cellWide : s.cell, s.th]}>{h[c]}</Text>
        ))}
      </View>
      {rows.map((r) => {
        const us = isUs(r.team);
        const z = zone(r.pos);
        return (
          <View key={r.pos} style={[s.row, z && { backgroundColor: ZC[z].bg, borderLeftWidth: 4, borderLeftColor: ZC[z].bar, paddingLeft: 8 }, us && { backgroundColor: C.highlight }]}>
            <Text style={[s.cellPos, z && { color: ZC[z].fg, fontWeight: "700" }, us && s.us]}>{r.pos}</Text>
            <View style={[s.cellTeamWrap]}>
              {r.logo_url ? <Image source={r.logo_url} style={{ width: 18, height: 18 }} contentFit="contain" /> : null}
              <Text style={[{ color: C.ink, fontSize: 14, flexShrink: 1 }, us && s.us]} numberOfLines={1}>
                {teamName(lang, r.team)}
              </Text>
            </View>
            {cols.map((c) => (
              <Text key={c} style={[c === "g" ? s.cellWide : s.cell, c === "pts" && { fontWeight: "800" }, us && s.us]}>{val(r, c)}</Text>
            ))}
          </View>
        );
      })}
      {!compact ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, padding: 12 }}>
          {(["up", "down"] as const).map((k) => (
            <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: ZC[k].bar }} />
              <Text style={{ fontSize: 12, color: C.muted }}>{k === "up" ? d.zoneUp : d.zoneDown}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

export const s = StyleSheet.create({
  card: { backgroundColor: C.white, borderRadius: R.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, padding: 16 },
  h2: { fontSize: 22, fontWeight: "800", color: C.ink, marginTop: 8 },
  btnLight: { minHeight: 44, paddingHorizontal: 16, justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#C9CDD8", backgroundColor: C.white },
  team: { flex: 1, fontSize: 15, fontWeight: "600", color: C.ink },
  us: { fontWeight: "800", color: C.ink },
  score: { minWidth: 72, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: C.ink, alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#ECEBE5" },
  th: { color: C.muted, fontSize: 12, fontWeight: "700" },
  cellPos: { width: 26, color: C.ink, fontSize: 14 },
  cellTeam: { flex: 1 },
  cellTeamWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, paddingRight: 6 },
  cell: { width: 30, textAlign: "right", color: C.ink, fontSize: 14 },
  cellWide: { width: 52, textAlign: "right", color: C.ink, fontSize: 14 },
});
