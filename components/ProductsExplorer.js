// components/ProductsExplorer.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "./ProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Search as SearchIcon } from "lucide-react";

const pillBase =
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors";
const pillIdle =
  "bg-white text-ink ring-1 ring-brand/20 hover:ring-brand/40 shadow";
const pillActive = "bg-brand text-white shadow";

export default function ProductsExplorer() {
  const { t } = useLocale();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured"); // featured | priceAsc | priceDesc | nameAsc
  const [cat, setCat] = useState("all");

  // Live products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  // Build unique categories (localized if available)
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((p) =>
      set.add(p.category_es || p.category_en || p.category || "General")
    );
    return ["Todos", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let arr = items;

    if (cat !== "all" && cat !== "Todos") {
      arr = arr.filter((p) =>
        (p.category_es || p.category_en || p.category || "")
          .toLowerCase()
          .includes(cat.toLowerCase())
      );
    }

    if (term) {
      arr = arr.filter((p) => {
        const hay =
          (p.name_es || p.name_en || p.name || "") +
          " " +
          (p.shortDesc_es || p.shortDesc_en || p.shortDesc || "") +
          " " +
          (p.category_es || p.category_en || p.category || "");
        return hay.toLowerCase().includes(term);
      });
    }

    switch (sort) {
      case "priceAsc":
        arr = [...arr].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceDesc":
        arr = [...arr].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "nameAsc":
        arr = [...arr].sort((a, b) =>
          (a.name_es || a.name_en || a.name || "").localeCompare(
            b.name_es || b.name_en || b.name || ""
          )
        );
        break;
      default:
        // featured first
        arr = [...arr].sort(
          (a, b) => (b.featured === true) - (a.featured === true)
        );
    }
    return arr;
  }, [items, q, sort, cat]);

  const resultsLabel = `${filtered.length} ${
    filtered.length === 1 ? "producto" : "productos"
  }`;

  return (
    <section className="container-tight py-10">
      {/* Tools bar (sticky) */}
      <div className="sticky top-14 z-20 -mx-4 mb-4 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur-md shadow ring-1 ring-black/5">
        {/* Row 1: Search + Selects */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
          {/* Search */}
          <div className="md:col-span-6">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                <SearchIcon size={18} />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search_placeholder") || "Buscar productos…"}
                className="h-11 w-full rounded-xl border border-brand/20 bg-white pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>

          {/* Category dropdown */}
          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              {t("categories_label") || "Categorías"}
            </label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="h-11 w-full rounded-xl border border-brand/20 bg-white px-3 text-sm text-ink focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="all">{t("shop_all") || "Ver Todo"}</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              {t("sort_featured") || "Ordenar"}
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 w-full rounded-xl border border-brand/20 bg-white px-3 text-sm text-ink focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="featured">
                {t("sort_featured") || "Destacados"}
              </option>
              <option value="priceAsc">
                {t("sort_price_asc") || "Precio: menor a mayor"}
              </option>
              <option value="priceDesc">
                {t("sort_price_desc") || "Precio: mayor a menor"}
              </option>
              <option value="nameAsc">
                {t("sort_name_asc") || "Nombre: A–Z"}
              </option>
            </select>
          </div>
        </div>

        {/* Row 2: Suggested category pills + meta */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
            <button
              className={`${pillBase} ${cat === "all" ? pillActive : pillIdle}`}
              onClick={() => setCat("all")}
            >
              {t("shop_all") || "Ver Todo"}
            </button>
            {categories.slice(1).map((c) => (
              <button
                key={c}
                className={`${pillBase} ${cat === c ? pillActive : pillIdle}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right side: results + clear */}
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="text-sm text-muted">{resultsLabel}</span>
            {(q || (cat !== "all" && cat !== "Todos")) && (
              <button
                className="rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm text-ink hover:border-brand/40 hover:bg-mist"
                onClick={() => {
                  setQ("");
                  setCat("all");
                  setSort("featured");
                }}
              >
                {t("clear") || "Limpiar"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Results count (mobile) */}
      <div className="mb-3 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">{resultsLabel}</span>
          {(q || (cat !== "all" && cat !== "Todos")) && (
            <button
              className="rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm text-ink hover:border-brand/40 hover:bg-mist"
              onClick={() => {
                setQ("");
                setCat("all");
                setSort("featured");
              }}
            >
              {t("clear") || "Limpiar"}
            </button>
          )}
        </div>
      </div>
      {/* Grid (no outlines) */}
      //smaller cards 4 items per row
      {/* <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}{" "}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id || p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
