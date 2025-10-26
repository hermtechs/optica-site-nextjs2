// components/ProductsExplorer.js
"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ProductCard from "./ProductCard";

function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ProductsExplorer({ products = [] }) {
  const { t, locale } = useLocale();
  const lang = (locale || "es").startsWith("en") ? "en" : "es";

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured"); // 'featured' | 'price_asc' | 'price_desc' | 'name_asc'
  const [cat, setCat] = useState("all");

  // categories (localized)
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const c = p[`category_${lang}`];
      if (c) set.add(c);
    });
    return ["all", ...Array.from(set)];
  }, [products, lang]);

  const filtered = useMemo(() => {
    const nq = norm(q);
    return products.filter((p) => {
      const fields = [
        `name_${lang}`,
        `shortDesc_${lang}`,
        `longDesc_${lang}`,
        `category_${lang}`,
        // also search the “other” language a bit
        `name_${lang === "es" ? "en" : "es"}`,
        `shortDesc_${lang === "es" ? "en" : "es"}`,
      ];
      const matchesQ =
        nq.length === 0 || fields.some((k) => norm(p[k]).includes(nq));

      const matchesCat =
        cat === "all" || norm(p[`category_${lang}`]) === norm(cat);
      return matchesQ && matchesCat;
    });
  }, [products, q, cat, lang]);

  const sorted = useMemo(() => {
    const list = filtered.slice();
    switch (sort) {
      case "price_asc":
        list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "name_asc":
        list.sort((a, b) =>
          (a[`name_${lang}`] || "").localeCompare(b[`name_${lang}`] || "")
        );
        break;
      default:
        // featured first, then newest
        list.sort((a, b) => {
          const fa = a.featured ? 1 : 0;
          const fb = b.featured ? 1 : 0;
          if (fb - fa !== 0) return fb - fa;
          const ta =
            (
              a.createdAt?.toDate?.() ||
              (a.createdAt ? new Date(a.createdAt) : 0)
            )?.getTime?.() || 0;
          const tb =
            (
              b.createdAt?.toDate?.() ||
              (b.createdAt ? new Date(b.createdAt) : 0)
            )?.getTime?.() || 0;
          return tb - ta;
        });
    }
    return list;
  }, [filtered, sort, lang]);

  return (
    <section className="container-tight py-10">
      {/* Controls */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm flex flex-wrap items-center gap-3">
        <input
          className="block w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
          placeholder={t("search_placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? t("shop_all") : c}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="featured">{t("sort_featured")}</option>
          <option value="price_asc">{t("sort_price_asc")}</option>
          <option value="price_desc">{t("sort_price_desc")}</option>
          <option value="name_asc">{t("sort_name_asc")}</option>
        </select>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center text-ink/70 py-12">{t("no_results")}</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((p) => (
            <ProductCard key={p.id || p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
