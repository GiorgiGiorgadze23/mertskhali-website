import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useLang } from "@/lib/lang";
import { C } from "@/lib/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
const icon = (name: IconName) => ({ color, size }: { color: ColorValue | null; size: number }) => <Ionicons name={name} size={size} color={typeof color === "number" ? undefined : color ?? undefined} />;

export default function TabsLayout() {
  const { d, lang } = useLang();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: C.ink },
        headerTintColor: C.white,
        headerTitleStyle: { fontWeight: "800" },
        tabBarActiveTintColor: C.blue,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.white, borderTopColor: C.line },
        sceneStyle: { backgroundColor: C.paper },
      }}
    >
      <Tabs.Screen name="index" options={{ title: d.nav.home, headerTitle: d.clubFull, tabBarIcon: icon("home") }} />
      <Tabs.Screen name="news" options={{ title: d.nav.news, tabBarIcon: icon("newspaper") }} />
      <Tabs.Screen name="matches" options={{ title: d.nav.matches, tabBarIcon: icon("football") }} />
      <Tabs.Screen name="squad" options={{ title: d.nav.squad, tabBarIcon: icon("people") }} />
      <Tabs.Screen name="more" options={{ title: lang === "ka" ? "მეტი" : "More", tabBarIcon: icon("ellipsis-horizontal-circle") }} />
    </Tabs>
  );
}
