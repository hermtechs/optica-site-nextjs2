// components/admin/ContentManager.js
"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const inputCls =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

export default function ContentManager() {
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState("es"); // "es" | "en"

  const [content, setContent] = useState({
    promo_text_es: "¡La mejor oferta de hoy! ¡COMPRA AHORA!",
    promo_text_en: "Today’s best deal! SHOP NOW!",
    about_title_es: "Sobre DamiOptica",
    about_title_en: "About DamiOptica",
    about_body_es:
      "Somos especialistas en salud visual y monturas modernas. Pruebas de la vista, lentes personalizados y atención cercana.",
    about_body_en:
      "We specialize in eye health and modern frames. Eye exams, custom lenses, and friendly care.",
    about_image: "/images/about.jpg",
    home_about_title_es: "Cuidado visual con estilo",
    home_about_title_en: "Eye care, styled",
    home_about_body_es:
      "Desde monturas clásicas hasta piezas audaces: calidad, comodidad y asesoría profesional.",
    home_about_body_en:
      "From classic frames to bold pieces—quality, comfort, and professional guidance.",
    home_about_image: "/images/home-about.jpg",
    eye_title_es: "Exámenes de la vista",
    eye_title_en: "Eye Tests",
    eye_body_es:
      "Realizamos pruebas completas con equipos modernos. Haz tu chequeo anual con nosotros.",
    eye_body_en:
      "We perform comprehensive eye tests with modern equipment. Book your yearly check-up.",
    eye_image: "/images/eye-exam.jpg",
    contact_phone: "+57 300 000 0000",
    contact_email: "hola@damioptica.com",
    contact_address_es: "Calle 123 #45–67, Bogotá, Colombia",
    contact_address_en: "123 Main St, Bogotá, Colombia",
    contact_hours_es: "Lun–Sáb 9:00–18:00",
    contact_hours_en: "Mon–Sat 9:00–18:00",
    footer_tagline_es: "Visión clara, estilo auténtico.",
    footer_tagline_en: "Clear vision, authentic style.",
  });

  useEffect(() => {
    (async () => {
      const refDoc = doc(db, "site", "content");
      const snap = await getDoc(refDoc);
      if (snap.exists()) setContent((c) => ({ ...c, ...snap.data() }));
    })();
  }, []);

  async function upload(file, pathPrefix) {
    const key = `${pathPrefix}/${Date.now()}-${file.name}`;
    const r = ref(storage, key);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  }

  async function save() {
    setSaving(true);
    try {
      await setDoc(doc(db, "site", "content"), content, { merge: true });
      alert("Saved.");
    } finally {
      setSaving(false);
    }
  }

  const L = (base) => `${base}_${lang}`;
  const setL = (base, val) => setContent((c) => ({ ...c, [L(base)]: val }));

  return (
    <div className="grid gap-6">
      {/* Toolbar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Site content</h3>
          <p className="text-sm text-muted">
            Edit localized copy for key sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Language:</span>
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setLang("es")}
              className={`px-3 py-1.5 text-sm ${
                lang === "es"
                  ? "bg-ink text-white"
                  : "bg-white text-ink hover:bg-mist"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-sm ${
                lang === "en"
                  ? "bg-ink text-white"
                  : "bg-white text-ink hover:bg-mist"
              }`}
            >
              EN
            </button>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-400"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Promo (white) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Promo bar</h4>
        <input
          className={inputCls}
          value={content[L("promo_text")]}
          onChange={(e) => setL("promo_text", e.target.value)}
        />
      </section>

      {/* About page (soft green) */}
      <section className="rounded-2xl border border-emerald-200 bg-[#F4FBF7] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">About page</h4>

        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("about_title")]}
          onChange={(e) => setL("about_title", e.target.value)}
        />

        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("about_body")]}
          onChange={(e) => setL("about_body", e.target.value)}
        />

        <label className="text-sm text-ink/80">Image</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={content.about_image || ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, about_image: e.target.value }))
            }
            placeholder="/images/about.jpg or https://…"
          />
          <label className="btn-outline cursor-pointer">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await upload(f, "site");
                setContent((c) => ({ ...c, about_image: url }));
              }}
            />
          </label>
        </div>
      </section>

      {/* Home: About (soft blue) */}
      <section className="rounded-2xl border border-sky-200 bg-[#F7FBFF] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Home — About block</h4>

        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("home_about_title")]}
          onChange={(e) => setL("home_about_title", e.target.value)}
        />

        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("home_about_body")]}
          onChange={(e) => setL("home_about_body", e.target.value)}
        />

        <label className="text-sm text-ink/80">Image</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={content.home_about_image || ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, home_about_image: e.target.value }))
            }
            placeholder="/images/home-about.jpg or https://…"
          />
          <label className="btn-outline cursor-pointer">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await upload(f, "site");
                setContent((c) => ({ ...c, home_about_image: url }));
              }}
            />
          </label>
        </div>
      </section>

      {/* Eye Test (soft violet) */}
      <section className="rounded-2xl border border-violet-200 bg-[#F7F4FF] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Home — Eye test</h4>

        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("eye_title")]}
          onChange={(e) => setL("eye_title", e.target.value)}
        />

        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("eye_body")]}
          onChange={(e) => setL("eye_body", e.target.value)}
        />

        <label className="text-sm text-ink/80">Image</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={content.eye_image || ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, eye_image: e.target.value }))
            }
            placeholder="/images/eye-exam.jpg or https://…"
          />
        </div>
      </section>

      {/* Contact & Footer (white) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Contact & Footer</h4>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-ink/80">Phone</label>
            <input
              className={inputCls}
              value={content.contact_phone}
              onChange={(e) =>
                setContent((c) => ({ ...c, contact_phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm text-ink/80">Email</label>
            <input
              type="email"
              className={inputCls}
              value={content.contact_email}
              onChange={(e) =>
                setContent((c) => ({ ...c, contact_email: e.target.value }))
              }
            />
          </div>
        </div>

        <label className="text-sm text-ink/80">Address</label>
        <input
          className={inputCls}
          value={content[L("contact_address")]}
          onChange={(e) => setL("contact_address", e.target.value)}
        />

        <label className="text-sm text-ink/80">Hours</label>
        <input
          className={inputCls}
          value={content[L("contact_hours")]}
          onChange={(e) => setL("contact_hours", e.target.value)}
        />

        <label className="text-sm text-ink/80">Footer tagline</label>
        <input
          className={inputCls}
          value={content[L("footer_tagline")]}
          onChange={(e) => setL("footer_tagline", e.target.value)}
        />
      </section>

      <div className="flex justify-end">
        <button
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-400"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
    </div>
  );
}
