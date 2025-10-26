// lib/useSiteContent.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db, firebaseEnabled } from "@/lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * STRICT: reads Firestore doc `site/content` only.
 * - `getStrict(base)` -> returns localized value (base_es or base_en) if present, else "".
 * - No locale or string fallbacks here.
 */
export default function useSiteContent() {
  const { locale } = useLocale();
  const [content, setContent] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!firebaseEnabled) {
      console.warn("[useSiteContent] Firebase not configured. Returning {}.");
      setContent({});
      setReady(true);
      return;
    }
    const unsub = onSnapshot(doc(db, "site", "content"), (snap) => {
      setContent(snap.exists() ? snap.data() : {});
      setReady(true);
    });
    return () => unsub();
  }, []);

  const getStrict = useMemo(() => {
    return (base) => {
      const lang = (locale || "es").startsWith("en") ? "en" : "es";
      const key = `${base}_${lang}`;
      if (Object.prototype.hasOwnProperty.call(content, key)) {
        return content[key] ?? "";
      }
      if (Object.prototype.hasOwnProperty.call(content, base)) {
        // for keys without _es/_en (e.g., about_image)
        return content[base] ?? "";
      }
      return "";
    };
  }, [content, locale]);

  return { content, getStrict, ready };
}
