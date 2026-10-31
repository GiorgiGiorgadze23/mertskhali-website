import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { api, useRemote } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { C } from "@/lib/theme";
import { ErrorNote, H2, Loading, MatchCard, Screen, TableCard } from "@/components/ui";

export default function MatchesScreen() {
  const { d } = useLang();
  const { data, error, refreshing, refresh } = useRemote("football", api.football);
  const [tab, setTab] = useState<"up" | "res">("up");
  const list = tab === "up" ? data?.upcoming ?? [] : data?.results ?? [];

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={{ flexDirection: "row", backgroundColor: C.ph, padding: 4, borderRadius: 10, alignSelf: "flex-start" }}>
        {(["up", "res"] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === k }}
            style={{ minHeight: 40, paddingHorizontal: 18, justifyContent: "center", borderRadius: 8, backgroundColor: tab === k ? C.white : "transparent" }}
          >
            <Text style={{ fontWeight: "700", color: C.ink }}>{k === "up" ? d.upcoming : d.results}</Text>
          </Pressable>
        ))}
      </View>

      {!data && !error ? <Loading /> : null}
      {error && !data ? <ErrorNote onRetry={refresh} /> : null}
      {data && list.length === 0 ? <Text style={{ color: C.muted }}>{d.noMatches}</Text> : null}
      {list.map((m) => (
        <MatchCard key={m.id} m={m} />
      ))}

      {data?.standings.length ? (
        <>
          <H2>
            {d.league} — {d.leagueTable}
          </H2>
          <TableCard rows={data.standings} />
          <Text style={{ color: C.muted, fontSize: 12 }}>{d.tableLegend}</Text>
          <Pressable onPress={() => Linking.openURL("https://liga.gff.ge/?season=44&league=4")} accessibilityRole="link" hitSlop={8}>
            <Text style={{ color: C.muted, fontSize: 12 }}>
              {d.source}: <Text style={{ color: C.blue }}>liga.gff.ge</Text> · {d.autoUpdated}
            </Text>
          </Pressable>
        </>
      ) : null}
    </Screen>
  );
}
