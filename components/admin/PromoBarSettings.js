"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const input =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

export default function PromoBarSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enabled, setEnabled] = useState(true);
  const [textEN, setTextEN] = useState("");
  const [textES, setTextES] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkLabelEN, setLinkLabelEN] = useState("");
  const [linkLabelES, setLinkLabelES] = useState("");

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      const data = snap.data() || {};

      setEnabled(data.promo_enabled !== false);
      setTextEN(data.promo_text_en || "");
      setTextES(data.promo_text_es || "");
      setLinkHref(data.promo_link_href || "");
      setLinkLabelEN(data.promo_link_label_en || "");
      setLinkLabelES(data.promo_link_label_es || "");

      setLoading(false);
    };
    run();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "site", "content");
      const payload = {
        promo_enabled: !!enabled,
        promo_text_en: textEN,
        promo_text_es: textES,
        promo_link_href: linkHref,
        promo_link_label_en: linkLabelEN,
        promo_link_label_es: linkLabelES,
        updatedAt: serverTimestamp(),
      };

      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
      alert("Promo bar settings saved");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-muted">Loading promo bar settings…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-4">
      <h4 className="text-base font-semibold text-ink">Promo bar</h4>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="text-ink/90">Enabled</span>
      </label>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/80 mb-1">Text (EN)</label>
          <input
            value={textEN}
            onChange={(e) => setTextEN(e.target.value)}
            placeholder="Summer sale — up to 30% off"
            className={input}
          />
        </div>
        <div>
          <label className="block text-sm text-ink/80 mb-1">Texto (ES)</label>
          <input
            value={textES}
            onChange={(e) => setTextES(e.target.value)}
            placeholder="Rebajas de verano — hasta 30% menos"
            className={input}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/80 mb-1">Link (href)</label>
          <input
            value={linkHref}
            onChange={(e) => setLinkHref(e.target.value)}
            placeholder="/products"
            className={input}
          />
          <p className="mt-1 text-xs text-muted">
            Internal path (e.g. <code>/products</code>) or a full URL.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Link label (EN)
            </label>
            <input
              value={linkLabelEN}
              onChange={(e) => setLinkLabelEN(e.target.value)}
              placeholder="Shop now"
              className={input}
            />
          </div>
          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Etiqueta (ES)
            </label>
            <input
              value={linkLabelES}
              onChange={(e) => setLinkLabelES(e.target.value)}
              placeholder="Comprar ahora"
              className={input}
            />
          </div>
        </div>
      </div>

      <div>
        <button onClick={save} className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save promo bar"}
        </button>
      </div>
    </div>
  );
}
