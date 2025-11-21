"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import useSiteContent from "@/lib/useSiteContent";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function PromoBar({ onClose }) {
  const { content } = useSiteContent();
  const { locale } = useLocale();
  const isEN = locale === "en";

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // If admin disabled, hide immediately
    if (content?.promo_enabled === false) {
      setVisible(false);
    }
  }, [content?.promo_enabled]);

  if (!visible || content?.promo_enabled === false) return null;

  const msg =
    (isEN ? content?.promo_text_en : content?.promo_text_es) ||
    // fallback if text missing
    (isEN ? "Welcome to DamiOptica" : "Bienvenido a DamiOptica");

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-10 bg-brand text-white">
      <div className="container-tight h-full flex items-center justify-between">
        <div className="text-sm">{msg}</div>
        <button
          aria-label="Close"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="inline-flex items-center justify-center rounded-full w-7 h-7 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
