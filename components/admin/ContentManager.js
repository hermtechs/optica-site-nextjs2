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
    // Promo
    promo_text_es: "",
    promo_text_en: "",

    // Global WhatsApp CTA (e.g., product cards / generic CTA)
    whatsapp_cta_text_es: "Más información y pedidos por WhatsApp",
    whatsapp_cta_text_en: "More information and orders on WhatsApp",

    // Home > Eye test WhatsApp button
    eye_whatsapp_text_es: "Más información y agendar por WhatsApp",
    eye_whatsapp_text_en: "More info and booking on WhatsApp",

    // Eye Tests page WhatsApp button
    eye_page_whatsapp_text_es: "Agendar examen por WhatsApp",
    eye_page_whatsapp_text_en: "Book eye exam on WhatsApp",

    // About page
    about_title_es: "",
    about_title_en: "",
    about_body_es: "",
    about_body_en: "",
    about_image: "/images/about.jpg",

    // Home > About block
    home_about_title_es: "",
    home_about_title_en: "",
    home_about_body_es: "",
    home_about_body_en: "",
    home_about_image: "/images/home-about.jpg",

    // Home > Eye test block
    eye_title_es: "",
    eye_title_en: "",
    eye_body_es: "",
    eye_body_en: "",
    eye_image: "/images/eye-exam.jpg",

    // Contact / Footer
    contact_phone: "",
    contact_email: "",
    contact_address_es: "",
    contact_address_en: "",
    contact_hours_es: "",
    contact_hours_en: "",
    footer_tagline_es: "",
    footer_tagline_en: "",

    // Our Story page
    story_title_es: "",
    story_title_en: "",
    story_body_es: "",
    story_body_en: "",
    story_image: "/images/story-hero.jpg",
    story_gallery: [], // array of URLs

    // Eye Tests FULL page
    eye_page_title_es: "",
    eye_page_title_en: "",
    eye_page_body_es: "",
    eye_page_body_en: "",
    eye_page_image: "/images/eye-tests-hero.jpg",
    eye_services_es: "", // multiline (split by \n on the page)
    eye_services_en: "",
    eye_price_text_es: "",
    eye_price_text_en: "",
  });

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "site", "content"));
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
            {saving ? "Saving…" : "Save all"}
          </button>
        </div>
      </div>

      {/* Promo */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Promo bar</h4>
        <input
          className={inputCls}
          value={content[L("promo_text")] ?? ""}
          onChange={(e) => setL("promo_text", e.target.value)}
        />
      </section>

      {/* Global Buttons / WhatsApp CTA */}
      <section className="rounded-2xl border border-amber-200 bg-[#FFFAF2] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">
          Global buttons & WhatsApp text
        </h4>

        <label className="text-sm text-ink/80">
          Global WhatsApp CTA (e.g. product cards)
        </label>
        <input
          className={inputCls}
          value={content[L("whatsapp_cta_text")] ?? ""}
          onChange={(e) => setL("whatsapp_cta_text", e.target.value)}
          placeholder={
            lang === "es"
              ? "Más información y pedidos por WhatsApp"
              : "More information and orders on WhatsApp"
          }
        />

        <label className="text-sm text-ink/80">
          Home — Eye test WhatsApp button text
        </label>
        <input
          className={inputCls}
          value={content[L("eye_whatsapp_text")] ?? ""}
          onChange={(e) => setL("eye_whatsapp_text", e.target.value)}
          placeholder={
            lang === "es"
              ? "Más información y agendar por WhatsApp"
              : "More info and booking on WhatsApp"
          }
        />

        <label className="text-sm text-ink/80">
          Eye Tests page WhatsApp button text
        </label>
        <input
          className={inputCls}
          value={content[L("eye_page_whatsapp_text")] ?? ""}
          onChange={(e) => setL("eye_page_whatsapp_text", e.target.value)}
          placeholder={
            lang === "es"
              ? "Agendar examen por WhatsApp"
              : "Book eye exam on WhatsApp"
          }
        />
      </section>

      {/* About page */}
      <section className="rounded-2xl border border-emerald-200 bg-[#F4FBF7] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">About page</h4>
        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("about_title")] ?? ""}
          onChange={(e) => setL("about_title", e.target.value)}
        />
        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("about_body")] ?? ""}
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

      {/* Home — About block */}
      <section className="rounded-2xl border border-sky-200 bg-[#F7FBFF] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Home — About block</h4>
        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("home_about_title")] ?? ""}
          onChange={(e) => setL("home_about_title", e.target.value)}
        />
        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("home_about_body")] ?? ""}
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

      {/* Home — Eye test block */}
      <section className="rounded-2xl border border-violet-200 bg-[#F7F4FF] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Home — Eye test</h4>
        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("eye_title")] ?? ""}
          onChange={(e) => setL("eye_title", e.target.value)}
        />
        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("eye_body")] ?? ""}
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
                setContent((c) => ({ ...c, eye_image: url }));
              }}
            />
          </label>
        </div>
      </section>

      {/* Contact & Footer */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Contact & Footer</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-ink/80">Phone</label>
            <input
              className={inputCls}
              value={content.contact_phone || ""}
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
              value={content.contact_email || ""}
              onChange={(e) =>
                setContent((c) => ({ ...c, contact_email: e.target.value }))
              }
            />
          </div>
        </div>
        <label className="text-sm text-ink/80">Address</label>
        <input
          className={inputCls}
          value={content[L("contact_address")] ?? ""}
          onChange={(e) => setL("contact_address", e.target.value)}
        />
        <label className="text-sm text-ink/80">Hours</label>
        <input
          className={inputCls}
          value={content[L("contact_hours")] ?? ""}
          onChange={(e) => setL("contact_hours", e.target.value)}
        />
        <label className="text-sm text-ink/80">Footer tagline</label>
        <input
          className={inputCls}
          value={content[L("footer_tagline")] ?? ""}
          onChange={(e) => setL("footer_tagline", e.target.value)}
        />
      </section>

      {/* Our Story page */}
      {/* <section className="rounded-2xl border border-rose-200 bg-[#FFF7F8] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Our Story page</h4>

        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("story_title")] ?? ""}
          onChange={(e) => setL("story_title", e.target.value)}
          placeholder={lang === "es" ? "Nuestra historia" : "Our Story"}
        />

        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={5}
          className={inputCls}
          value={content[L("story_body")] ?? ""}
          onChange={(e) => setL("story_body", e.target.value)}
          placeholder={
            lang === "es"
              ? "Cuenta tu misión, valores y trayectoria…"
              : "Tell your mission, values, and journey…"
          }
        />

        <label className="text-sm text-ink/80">Hero image</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={content.story_image || ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, story_image: e.target.value }))
            }
            placeholder="/images/story-hero.jpg or https://…"
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
                setContent((c) => ({ ...c, story_image: url }));
              }}
            />
          </label>
        </div>

        <label className="text-sm text-ink/80">
          Gallery (comma separated or upload)
        </label>
        <textarea
          rows={3}
          className={inputCls}
          value={(content.story_gallery || []).join(", ")}
          onChange={(e) =>
            setContent((c) => ({
              ...c,
              story_gallery: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
        />
        <label className="btn-outline cursor-pointer w-fit">
          Upload images
          <input
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              const urls = [];
              for (const f of files) urls.push(await upload(f, "site"));
              setContent((c) => ({
                ...c,
                story_gallery: [...(c.story_gallery || []), ...urls],
              }));
            }}
          />
        </label>
      </section> */}

      {/* Eye Tests FULL page */}
      <section className="rounded-2xl border border-indigo-200 bg-[#F6F7FF] p-4 shadow-sm grid gap-3">
        <h4 className="text-base font-semibold text-ink">Eye Tests page</h4>

        <label className="text-sm text-ink/80">Title</label>
        <input
          className={inputCls}
          value={content[L("eye_page_title")] ?? ""}
          onChange={(e) => setL("eye_page_title", e.target.value)}
          placeholder={lang === "es" ? "Exámenes de la vista" : "Eye Tests"}
        />

        <label className="text-sm text-ink/80">Body</label>
        <textarea
          rows={5}
          className={inputCls}
          value={content[L("eye_page_body")] ?? ""}
          onChange={(e) => setL("eye_page_body", e.target.value)}
        />

        <label className="text-sm text-ink/80">Hero image</label>
        <div className="flex items-center gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={content.eye_page_image || ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, eye_page_image: e.target.value }))
            }
            placeholder="/images/eye-tests-hero.jpg or https://…"
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
                setContent((c) => ({ ...c, eye_page_image: url }));
              }}
            />
          </label>
        </div>

        <label className="text-sm text-ink/80">
          Services (one per line) — shown as bullet list
        </label>
        <textarea
          rows={4}
          className={inputCls}
          value={content[L("eye_services")] ?? ""}
          onChange={(e) => setL("eye_services", e.target.value)}
          placeholder={
            lang === "es"
              ? "Agudeza visual\nRetinoscopía\n…"
              : "Visual acuity\nRetinoscopy\n…"
          }
        />

        <label className="text-sm text-ink/80">Price text (optional)</label>
        <input
          className={inputCls}
          value={content[L("eye_price_text")] ?? ""}
          onChange={(e) => setL("eye_price_text", e.target.value)}
          placeholder={lang === "es" ? "Desde $XX.XXX" : "From $XX.XX"}
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
