// app/categories/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";

function stripDiacritics(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function toDash(s = "") {
  return stripDiacritics(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CategoriesPage() {
  const { locale } = useLocale();
  const isEN = locale === "en";

  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Build a categories list with EN/ES labels + counts + sample image
  const cats = useMemo(() => {
    const map = new Map();
    for (const p of items) {
      const label_en = p.category_en || "";
      const label_es = p.category_es || "";
      const fallback = p.category || "";
      const key = p.categoryKey || toDash(label_en || label_es || fallback);

      if (!map.has(key)) {
        map.set(key, {
          key,
          label_en: label_en || fallback || "General",
          label_es: label_es || fallback || "General",
          count: 0,
          sample: p.image || "",
        });
      }
      const obj = map.get(key);
      obj.count += 1;
      if (!obj.sample && p.image) obj.sample = p.image;
    }

    // Sort by current-language label
    return Array.from(map.values()).sort((a, b) => {
      const la = isEN ? a.label_en : a.label_es;
      const lb = isEN ? b.label_en : b.label_es;
      return la.localeCompare(lb);
    });
  }, [items, isEN]);

  const pageTitle = isEN ? "Categories" : "Categorías";

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-10">
        <h1 className="mb-6 text-2xl font-semibold text-ink">{pageTitle}</h1>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cats.map((c) => {
            // Language-specific label & slug
            const label = isEN ? c.label_en : c.label_es;
            const slug = toDash(label); // <- language-based slug
            const href = `/categories/${encodeURIComponent(slug)}`;

            return (
              <Link
                key={`${c.key}-${slug}`}
                href={href}
                className="group overflow-hidden rounded-xl bg-white shadow ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {c.sample ? (
                    <img
                      src={c.sample}
                      alt={label}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-mist text-muted">
                      {label}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold text-ink">{label}</div>
                  <div className="text-sm text-muted">
                    {c.count}{" "}
                    {isEN
                      ? c.count === 1
                        ? "product"
                        : "products"
                      : c.count === 1
                      ? "producto"
                      : "productos"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
