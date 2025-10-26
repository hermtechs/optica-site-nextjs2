// components/admin/ContentManager.js
//simple content manager for stuff like promo text
// components/admin/ContentManager.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

const inputCls =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

export default function ContentManager() {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    promo_text_en: "Today’s best deal! SHOP NOW!",
    promo_text_es: "¡La mejor oferta de hoy! ¡COMPRA AHORA!",
  });

  useEffect(() => {
    (async () => {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      if (snap.exists()) setContent((c) => ({ ...c, ...snap.data() }));
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      await setDoc(doc(db, "site", "content"), content, { merge: true });
      alert("Saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm grid gap-3 max-w-2xl">
      <h3 className="text-lg font-semibold text-ink">Site content</h3>

      <label className="text-sm text-ink/80">Promo (EN)</label>
      <input
        className={inputCls}
        value={content.promo_text_en}
        onChange={(e) =>
          setContent({ ...content, promo_text_en: e.target.value })
        }
      />

      <label className="text-sm text-ink/80">Promo (ES)</label>
      <input
        className={inputCls}
        value={content.promo_text_es}
        onChange={(e) =>
          setContent({ ...content, promo_text_es: e.target.value })
        }
      />

      <button className="btn w-fit mt-2" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </button>

      <p className="text-sm text-muted">
        Tip: Read <code>site/content</code> inside <code>PromoBar</code> to
        override the localized promo text.
      </p>
    </div>
  );
}
