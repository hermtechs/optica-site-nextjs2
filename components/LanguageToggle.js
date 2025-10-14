"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Fancy segmented language switcher (ES 🇨🇴 / EN 🇺🇸)
 * - Animated slider, high contrast
 * - Keyboard accessible
 * - Syncs ?lang=es|en and localStorage
 */
export default function LanguageToggle({ size = "md", className = "" }) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const rootRef = useRef(null);

  const isEN = locale === "en";

  const dims = useMemo(() => {
    if (size === "lg")
      return {
        h: "h-12",
        p: "p-1.5",
        text: "text-sm",
        chip: "px-5",
        flag: 18,
        gap: "gap-2",
      };
    if (size === "sm")
      return {
        h: "h-9",
        p: "p-1",
        text: "text-xs",
        chip: "px-3",
        flag: 14,
        gap: "gap-1.5",
      };
    return {
      h: "h-10",
      p: "p-1.5",
      text: "text-sm",
      chip: "px-4",
      flag: 16,
      gap: "gap-2",
    };
  }, [size]);

  const applyLang = useCallback(
    (lang) => {
      setLocale(lang);
      const p = new URLSearchParams(params?.toString() || "");
      p.set("lang", lang);
      router.replace(`?${p.toString()}`);
    },
    [params, router, setLocale]
  );

  // Keyboard support (Left/Right arrows)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        applyLang(isEN ? "es" : "en");
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [applyLang, isEN]);

  const sliderStyle = {
    transform: isEN ? "translateX(100%)" : "translateX(0%)",
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Language toggle"
      tabIndex={0}
      className={[
        "relative inline-flex items-center rounded-full border border-brand/40 bg-white/90 shadow-card backdrop-blur",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        dims.h,
        dims.p,
        className,
      ].join(" ")}
    >
      {/* Animated slider */}
      <div
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 left-[4px] w-[calc(50%-6px)] ${
          dims.h === "h-12" ? "h-9" : dims.h === "h-9" ? "h-7" : "h-8"
        } rounded-full bg-brand text-white shadow-[0_6px_20px_rgba(0,88,255,0.25)] transition-transform duration-300`}
        style={sliderStyle}
      />

      {/* ES (Colombia flag) */}
      <button
        type="button"
        title="Español"
        aria-pressed={!isEN}
        onClick={() => applyLang("es")}
        className={[
          "relative z-10 inline-flex items-center justify-center",
          dims.chip,
          dims.h === "h-12" ? "h-9" : dims.h === "h-9" ? "h-7" : "h-8",
          "rounded-full",
          dims.text,
          "font-semibold transition-colors",
          !isEN ? "text-white" : "text-brand",
          dims.gap,
        ].join(" ")}
      >
        <span className="select-none" style={{ fontSize: dims.flag }}>
          🇨🇴
        </span>
        <span className="tracking-wide">ES</span>
      </button>

      {/* EN (US flag) */}
      <button
        type="button"
        title="English"
        aria-pressed={isEN}
        onClick={() => applyLang("en")}
        className={[
          "relative z-10 inline-flex items-center justify-center",
          dims.chip,
          dims.h === "h-12" ? "h-9" : dims.h === "h-9" ? "h-7" : "h-8",
          "rounded-full",
          dims.text,
          "font-semibold transition-colors",
          isEN ? "text-white" : "text-brand",
          dims.gap,
        ].join(" ")}
      >
        <span className="select-none" style={{ fontSize: dims.flag }}>
          🇺🇸
        </span>
        <span className="tracking-wide">EN</span>
      </button>
    </div>
  );
}
