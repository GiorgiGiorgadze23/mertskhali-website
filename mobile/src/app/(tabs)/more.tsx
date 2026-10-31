import { Linking, Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLang } from "@/lib/lang";
import { API } from "@/lib/api";
import { C, R } from "@/lib/theme";
import { Card, H2, Screen } from "@/components/ui";

const EMAIL = "giorgadze@gmail.com";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61584229075980";

function Row({ icon, label, value, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 52, opacity: pressed ? 0.7 : 1 })}>
      <Ionicons name={icon} size={22} color={C.blue} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.muted, fontSize: 12, fontWeight: "700" }}>{label}</Text>
        <Text style={{ color: C.ink, fontSize: 15 }}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </Pressable>
  );
}

export default function MoreScreen() {
  const { lang, d, setLang } = useLang();
  return (
    <Screen>
      <Card style={{ gap: 10 }}>
        <Text style={{ fontWeight: "800", fontSize: 15, color: C.ink }}>{lang === "ka" ? "ენა" : "Language"}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["ka", "en"] as const).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLang(l)}
              accessibilityRole="button"
              accessibilityState={{ selected: lang === l }}
              style={{ flex: 1, minHeight: 44, borderRadius: R.pill, alignItems: "center", justifyContent: "center", backgroundColor: lang === l ? C.ink : C.white, borderWidth: 1, borderColor: lang === l ? C.ink : C.line }}
            >
              <Text style={{ color: lang === l ? C.white : C.ink, fontWeight: "700" }}>{l === "ka" ? "ქართული" : "English"}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <H2>{d.historyHeading}</H2>
      <Card style={{ gap: 14 }}>
        <Text style={{ color: C.text2, lineHeight: 21 }}>{d.historyIntro}</Text>
        {d.events.map(([y, title, text]) => (
          <View key={y} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ width: 4, borderRadius: 2, backgroundColor: C.blue }} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: C.blue, fontWeight: "800", fontSize: 18 }}>{y}</Text>
              <Text style={{ color: C.ink, fontWeight: "700" }}>{title}</Text>
              <Text style={{ color: C.text2, lineHeight: 20 }}>{text}</Text>
            </View>
          </View>
        ))}
      </Card>

      <H2>{d.contactTitle}</H2>
      <Card style={{ paddingVertical: 6 }}>
        <Row icon="location" label={d.addressLabel} value={d.address} onPress={() => Linking.openURL("https://www.openstreetmap.org/search?query=Ozurgeti%20stadium")} />
        <Row icon="mail" label={d.emailLabel} value={EMAIL} onPress={() => Linking.openURL(`mailto:${EMAIL}`)} />
        <Row icon="logo-facebook" label={d.socialLabel} value={`Facebook — ${d.clubFull}`} onPress={() => Linking.openURL(FACEBOOK)} />
        <Row icon="images" label={d.galleryTitle} value={lang === "ka" ? "ფოტოები საიტზე" : "Photos on the website"} onPress={() => WebBrowser.openBrowserAsync(API + (lang === "en" ? "/en/gallery" : "/gallery"))} />
        <Row icon="globe" label={lang === "ka" ? "ვებსაიტი" : "Website"} value={API.replace("https://", "")} onPress={() => WebBrowser.openBrowserAsync(API + (lang === "en" ? "/en" : ""))} />
      </Card>
      <Text style={{ color: C.muted, fontSize: 12, textAlign: "center" }}>{d.clubFull} · v1.0</Text>
    </Screen>
  );
}
