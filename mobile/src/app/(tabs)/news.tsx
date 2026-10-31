import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { api } from "@/lib/api";
import { useLang } from "@/lib/lang";
import { categoryName } from "@/lib/i18n";
import { CATEGORIES, type News } from "@/lib/types";
import { C, R } from "@/lib/theme";
import { ErrorNote, Loading, NewsCard } from "@/components/ui";

export default function NewsScreen() {
  const { lang, d } = useLang();
  const [cat, setCat] = useState<string | undefined>();
  const [items, setItems] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const r = await api.news(p, cat);
        setItems((prev) => (p === 1 ? r.items : [...prev, ...r.items]));
        setTotal(r.total);
        setPage(p);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [cat],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const chips = [undefined, ...CATEGORIES];
  return (
    <FlatList
      style={{ backgroundColor: C.paper }}
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
      data={items}
      keyExtractor={(n) => n.id}
      renderItem={({ item }) => <NewsCard n={item} lang={lang} />}
      refreshControl={<RefreshControl refreshing={loading && page === 1 && items.length > 0} onRefresh={() => load(1)} tintColor={C.blue} />}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (!loading && items.length < total) load(page + 1);
      }}
      ListHeaderComponent={
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {chips.map((c) => {
            const on = c === cat;
            return (
              <Pressable
                key={c ?? "all"}
                onPress={() => setCat(c)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={{ minHeight: 40, paddingHorizontal: 16, justifyContent: "center", borderRadius: R.pill, backgroundColor: on ? C.ink : C.white, borderWidth: 1, borderColor: on ? C.ink : C.line }}
              >
                <Text style={{ color: on ? C.white : C.ink, fontWeight: "700" }}>{c ? categoryName(lang, c) : d.all}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      }
      ListEmptyComponent={loading ? <Loading /> : error ? <ErrorNote onRetry={() => load(1)} /> : <Text style={{ color: C.muted }}>{cat ? d.noNewsInCat : d.newsSoon}</Text>}
      ListFooterComponent={loading && items.length > 0 && page > 1 ? <Loading /> : <View />}
    />
  );
}
