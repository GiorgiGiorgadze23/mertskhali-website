import { Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { api, useRemote } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { translit } from "@/lib/i18n";
import type { Player } from "@/lib/types";
import { C, R } from "@/lib/theme";
import { ErrorNote, H2, Loading, Screen } from "@/components/ui";

const POSITIONS: Player["position"][] = ["GK", "DF", "MF", "FW"];

export default function SquadScreen() {
  const { lang, d } = useLang();
  const { width } = useWindowDimensions();
  const { data, error, refreshing, refresh } = useRemote("football", api.football);
  const cols = width >= 700 ? 4 : 2;
  const cardW = (Math.min(width, 900) - 32 - (cols - 1) * 12) / cols;
  const name = (p: Player) => (lang === "en" ? p.name_en || translit(p.name) : p.name);

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={{ backgroundColor: C.ink, borderRadius: R.card, padding: 18, gap: 4 }}>
        <Text style={{ color: C.sky, fontWeight: "700", fontSize: 12, letterSpacing: 1 }}>{d.headCoach.toUpperCase()}</Text>
        <Text style={{ color: C.white, fontWeight: "800", fontSize: 22 }}>{d.coachName}</Text>
      </View>
      {!data && !error ? <Loading /> : null}
      {error && !data ? <ErrorNote onRetry={refresh} /> : null}
      {POSITIONS.map((pos) => {
        const list = (data?.players ?? []).filter((p) => p.position === pos);
        if (!list.length) return null;
        const [title, role] = d.groups[pos];
        return (
          <View key={pos} style={{ gap: 12 }}>
            <H2>{title}</H2>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {list.map((p) => (
                <View key={p.id} style={{ width: cardW, backgroundColor: C.white, borderRadius: R.card, borderWidth: 1, borderColor: C.line, overflow: "hidden" }}>
                  <View style={{ height: cardW * 0.9, backgroundColor: C.ph }}>
                    {p.photo_url ? <Image source={p.photo_url} style={{ width: "100%", height: "100%" }} contentFit="cover" /> : null}
                    {p.number ? <Text style={{ position: "absolute", top: 8, left: 12, fontSize: 30, fontWeight: "800", color: C.ink }}>{p.number}</Text> : null}
                  </View>
                  <View style={{ padding: 12, gap: 2 }}>
                    <Text style={{ fontWeight: "700", fontSize: 15, color: C.ink }}>{name(p)}</Text>
                    <Text style={{ color: C.muted, fontSize: 12 }}>
                      {role}
                      {p.birth_year ? ` · ${p.birth_year}` : ""}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}
