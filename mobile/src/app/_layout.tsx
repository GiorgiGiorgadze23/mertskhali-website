import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { LangProvider, useLang } from "@/lib/lang";
import { registerForNews } from "@/lib/push";
import { C } from "@/lib/theme";

function NotificationBridge() {
  const router = useRouter();
  const { lang } = useLang();

  useEffect(() => {
    registerForNews(lang);
  }, [lang]);

  // Tapping a "new article" notification opens that article.
  useEffect(() => {
    const open = (data: unknown) => {
      const slug = (data as { slug?: string } | undefined)?.slug;
      if (slug) router.push({ pathname: "/news/[slug]", params: { slug } });
    };
    const last = Notifications.getLastNotificationResponse();
    if (last) open(last.notification.request.content.data);
    const sub = Notifications.addNotificationResponseReceivedListener((r) => open(r.notification.request.content.data));
    return () => sub.remove();
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <LangProvider>
      <StatusBar style="light" />
      <NotificationBridge />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.ink },
          headerTintColor: C.white,
          headerTitleStyle: { fontWeight: "800" },
          headerTransparent: false,
          contentStyle: { backgroundColor: C.paper },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="news/[slug]" options={{ title: "", headerBackButtonDisplayMode: "minimal" }} />
      </Stack>
    </LangProvider>
  );
}
