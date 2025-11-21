"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebaseClient";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const input =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

const emptyCTA = { href: "", variant: "primary", label_en: "", label_es: "" };
const emptySlide = {
  enabled: true,
  position: 1,
  image: "",
  eyebrow_en: "",
  eyebrow_es: "",
  title_en: "",
  title_es: "",
  subtitle_en: "",
  subtitle_es: "",
  ctas: [emptyCTA],
};

export default function HeroManagerInSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, "site", "content");
      const snap = await getDoc(ref);
      const data = snap.data() || {};
      const arr = Array.isArray(data.hero_slides) ? data.hero_slides : [];
      setSlides(arr);
      setLoading(false);
    };
    run();
  }, []);

  async function uploadToStorage(file) {
    const key = `hero/${Date.now()}-${file.name}`;
    const r = ref(storage, key);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  }

  const setSlide = (idx, updater) =>
    setSlides((prev) => {
      const next = [...prev];
      next[idx] = typeof updater === "function" ? updater(next[idx]) : updater;
      return next;
    });

  const addSlide = () =>
    setSlides((prev) => [
      ...prev,
      { ...emptySlide, position: prev.length + 1 },
    ]);
  const removeSlide = (i) =>
    setSlides((prev) => prev.filter((_, idx) => idx !== i));

  async function save() {
    setSaving(true);
    try {
      const refDoc = doc(db, "site", "content");
      const payload = {
        hero_slides: slides.map((s, i) => ({
          ...s,
          position: Number(s.position) || i + 1,
          enabled: !!s.enabled,
          ctas: Array.isArray(s.ctas)
            ? s.ctas.map((c) => ({
                href: c.href || "",
                variant: c.variant === "secondary" ? "secondary" : "primary",
                label_en: c.label_en || "",
                label_es: c.label_es || "",
              }))
            : [],
        })),
        updatedAt: serverTimestamp(),
      };

      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        await updateDoc(refDoc, payload);
      } else {
        await setDoc(refDoc, { ...payload, createdAt: serverTimestamp() });
      }
      alert("Hero saved");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted">Loading hero…</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">Hero slides</h3>
        <button type="button" className="btn-outline" onClick={addSlide}>
          Add slide
        </button>
      </div>

      {slides.length === 0 && (
        <div className="text-sm text-muted">
          No slides yet. Click “Add slide”.
        </div>
      )}

      <div className="grid gap-4">
        {slides.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 p-3 grid gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Slide #{i + 1}</div>
              <button
                type="button"
                className="btn-outline"
                onClick={() => removeSlide(i)}
              >
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!s.enabled}
                  onChange={(e) =>
                    setSlide(i, { ...s, enabled: e.target.checked })
                  }
                />
                <span className="text-ink/90">Enabled</span>
              </label>

              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Position
                </label>
                <input
                  type="number"
                  className={input}
                  value={s.position ?? i + 1}
                  onChange={(e) =>
                    setSlide(i, { ...s, position: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-ink/80 mb-1">Image</label>
                <div className="flex gap-2">
                  <input
                    className={`${input} flex-1`}
                    placeholder="https://…"
                    value={s.image || ""}
                    onChange={(e) =>
                      setSlide(i, { ...s, image: e.target.value })
                    }
                  />
                  <label className="btn-outline cursor-pointer shrink-0">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadToStorage(file);
                        setSlide(i, { ...s, image: url });
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Eyebrow (EN)
                </label>
                <input
                  className={input}
                  value={s.eyebrow_en || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, eyebrow_en: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Eyebrow (ES)
                </label>
                <input
                  className={input}
                  value={s.eyebrow_es || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, eyebrow_es: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Title (EN)
                </label>
                <input
                  className={input}
                  value={s.title_en || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, title_en: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Title (ES)
                </label>
                <input
                  className={input}
                  value={s.title_es || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, title_es: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Subtitle (EN)
                </label>
                <textarea
                  rows={2}
                  className={input}
                  value={s.subtitle_en || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, subtitle_en: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-ink/80 mb-1">
                  Subtitle (ES)
                </label>
                <textarea
                  rows={2}
                  className={input}
                  value={s.subtitle_es || ""}
                  onChange={(e) =>
                    setSlide(i, { ...s, subtitle_es: e.target.value })
                  }
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="rounded-lg border border-gray-200 p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">
                  CTAs ({Array.isArray(s.ctas) ? s.ctas.length : 0})
                </div>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() =>
                    setSlide(i, {
                      ...s,
                      ctas: [...(s.ctas || []), { ...emptyCTA }],
                    })
                  }
                >
                  Add CTA
                </button>
              </div>

              <div className="grid gap-2">
                {(s.ctas || []).map((c, j) => (
                  <div key={j} className="grid md:grid-cols-5 gap-2">
                    <select
                      className={input}
                      value={c.variant || "primary"}
                      onChange={(e) => {
                        const next = [...(s.ctas || [])];
                        next[j] = { ...c, variant: e.target.value };
                        setSlide(i, { ...s, ctas: next });
                      }}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <input
                      className={input}
                      placeholder="Label (EN)"
                      value={c.label_en || ""}
                      onChange={(e) => {
                        const next = [...(s.ctas || [])];
                        next[j] = { ...c, label_en: e.target.value };
                        setSlide(i, { ...s, ctas: next });
                      }}
                    />
                    <input
                      className={input}
                      placeholder="Label (ES)"
                      value={c.label_es || ""}
                      onChange={(e) => {
                        const next = [...(s.ctas || [])];
                        next[j] = { ...c, label_es: e.target.value };
                        setSlide(i, { ...s, ctas: next });
                      }}
                    />
                    <input
                      className={`${input} md:col-span-2`}
                      placeholder="https://…"
                      value={c.href || ""}
                      onChange={(e) => {
                        const next = [...(s.ctas || [])];
                        next[j] = { ...c, href: e.target.value };
                        setSlide(i, { ...s, ctas: next });
                      }}
                    />
                    <div className="md:col-span-5 flex justify-end">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {
                          const next = (s.ctas || []).filter(
                            (_, idx) => idx !== j
                          );
                          setSlide(i, { ...s, ctas: next });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          className="btn bg-emerald-600 hover:brightness-95"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save hero"}
        </button>
      </div>
    </div>
  );
}
