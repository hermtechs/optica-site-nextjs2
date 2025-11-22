"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

// helpers
function stripDiacritics(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function normalize(s = "") {
  return stripDiacritics(s).toLowerCase().trim();
}
function toDash(s = "") {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CategoryProductsClient({ slug }) {
  const { locale } = useLocale();
  const isEN = locale === "en";

  const [items, setItems] = useState([]);

  // Slug from URL in both forms
  const slugKey = useMemo(() => normalize(slug || ""), [slug]);
  const slugDash = useMemo(() => toDash(slug || ""), [slug]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const filtered = list.filter((p) => {
        // gather all possible category identifiers/translations
        const key = p.categoryKey || "";
        const en = p.category_en || "";
        const es = p.category_es || "";
        const fb = p.category || "";

        // normalized (space) and dashed versions
        const candidates = [
          normalize(key),
          normalize(en),
          normalize(es),
          normalize(fb),
        ].filter(Boolean);

        const candidatesDash = [
          toDash(key),
          toDash(en),
          toDash(es),
          toDash(fb),
        ].filter(Boolean);

        // match if any candidate equals or includes the URL slug (both forms)
        const hitPlain = candidates.some(
          (c) => c === slugKey || c.includes(slugKey)
        );
        const hitDash = candidatesDash.some(
          (c) => c === slugDash || c.includes(slugDash)
        );

        return hitPlain || hitDash;
      });

      setItems(filtered);
    });
    return () => unsub();
  }, [slugKey, slugDash]);

  // Localized header + count
  const titleText = useMemo(() => {
    // Try to display a nice label based on the first product in the list,
    // falling back to the slug.
    if (items[0]) {
      const p = items[0];
      const label =
        (isEN ? p.category_en : p.category_es) || p.category || slug;
      return label;
    }
    return slug?.replace(/-/g, " ") || (isEN ? "Category" : "Categoría");
  }, [items, slug, isEN]);

  const countText = useMemo(() => {
    const n = items.length;
    if (isEN) return `${n} ${n === 1 ? "product" : "products"}`;
    return `${n} ${n === 1 ? "producto" : "productos"}`;
  }, [items.length, isEN]);

  const emptyText = isEN
    ? "There are no products in this category yet."
    : "No hay productos en esta categoría todavía.";

  return (
    <section className="container-tight py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink capitalize">
          {titleText}
        </h1>
        <p className="text-muted">{countText}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-brand/10 bg-white p-6 text-muted">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id || p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
