import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { t, type Dict, type Lang } from "./i18n";

type Ctx = { lang: Lang; d: Dict; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "ka", d: t("ka"), setLang: () => {} });

/** Georgian by default; English if the phone is set to a non-Georgian language. The choice is remembered. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const deviceLang: Lang = getLocales()[0]?.languageCode === "ka" ? "ka" : "en";
  const [lang, setLangState] = useState<Lang>(deviceLang);

  useEffect(() => {
    AsyncStorage.getItem("lang")
      .then((v) => {
        if (v === "ka" || v === "en") setLangState(v);
      })
      .catch(() => {});
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem("lang", l).catch(() => {});
  };

  return <LangContext.Provider value={{ lang, d: t(lang), setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
