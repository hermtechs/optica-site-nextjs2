// components/PromoBar.js
"use client";
import useSiteContent from "@/lib/useSiteContent";

export default function PromoBar({ onClose }) {
  const { getStrict } = useSiteContent();
  const text = getStrict("promo_text"); // "" if not in Firestore

  if (!text) return null; // hide if no content yet

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-brand text-white text-sm">
      <div className="container-tight h-10 flex items-center justify-between">
        <span className="truncate">{text}</span>
        <button onClick={onClose} className="hover:opacity-80 px-2">
          ×
        </button>
      </div>
    </div>
  );
}
