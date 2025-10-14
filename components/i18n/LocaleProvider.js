"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import es from "@/locales/es";
import en from "@/locales/en";

const LocaleCtx = createContext({
  locale: "es",
  t: (k) => k,
  setLocale: () => {},
});

export default function LocaleProvider({ children, initialLocale = "es" }) {
  const [locale, setLocale] = useState(initialLocale);

  // URL override (?lang=en|es) > localStorage > initial
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("lang");
      const ls = window.localStorage.getItem("locale");
      if (q === "en" || q === "es") {
        setLocale(q);
        window.localStorage.setItem("locale", q);
        return;
      }
      if (ls === "en" || ls === "es") {
        setLocale(ls);
      }
    } catch {}
  }, []);

  const dict = locale === "en" ? en : es;

  const value = useMemo(
    () => ({
      locale,
      setLocale: (l) => {
        if (l === "en" || l === "es") {
          try {
            window.localStorage.setItem("locale", l);
          } catch {}
          setLocale(l);
        }
      },
      t: (key) => dict[key] ?? es[key] ?? key, // fallback to ES then key
    }),
    [locale, dict]
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  return useContext(LocaleCtx);
}
