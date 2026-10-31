import { Pressable, Share, Text, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { api, API, useRemote } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { categoryName, formatDate } from "@/lib/i18n";
import { C } from "@/lib/theme";
import { ErrorNote, Loading, Screen } from "@/components/ui";

export default function Article() {
  const { slug = "" } = useLocalSearchParams<{ slug?: string }>();
  const { lang } = useLang();
  const { data, error, refreshing, refresh } = useRemote("article:" + slug, () => api.article(slug));
  const n = data?.item;
  const english = lang === "en" && !!n?.title_en;
  const title = n ? (english ? n.title_en! : n.title) : "";
  const body = n ? (english ? n.body_en : n.body) ?? "" : "";
  const url = `${API}${lang === "en" ? "/en" : ""}/news/${slug}`;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => Share.share({ message: `${title}\n${url}`, url })} hitSlop={12} accessibilityRole="button" accessibilityLabel={lang === "ka" ? "გაზიარება" : "Share"}>
              <Ionicons name="share-outline" size={22} color={C.white} />
            </Pressable>
          ),
        }}
      />
      <Screen refreshing={refreshing} onRefresh={refresh}>
        {!data && !error ? <Loading /> : null}
        {error && !data ? <ErrorNote onRetry={refresh} /> : null}
        {data && !n ? <Text style={{ color: C.muted }}>{lang === "ka" ? "სიახლე ვერ მოიძებნა." : "Article not found."}</Text> : null}
        {n ? (
          <View style={{ gap: 14 }}>
            <Text style={{ fontSize: 13, color: C.muted }}>
              <Text style={{ color: C.blue, fontWeight: "700" }}>{categoryName(lang, n.category)}</Text>
              {"  "}
              {formatDate(lang, n.published_at)}
            </Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: C.ink, lineHeight: 34 }}>{title}</Text>
            {n.image_url ? <Image source={n.image_url} style={{ width: "100%", aspectRatio: 16 / 10, borderRadius: 12, backgroundColor: C.ph }} contentFit="cover" /> : null}
            {body
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((p, i) => (
                <Text key={i} selectable style={{ fontSize: 17, lineHeight: 27, color: C.ink }}>
                  {p}
                </Text>
              ))}
          </View>
        ) : null}
      </Screen>
    </>
  );
}
