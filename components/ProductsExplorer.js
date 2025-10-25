// components/ProductsExplorer.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  Filter,
  X,
  Search as SearchIcon,
  SlidersHorizontal,
} from "lucide-react";

// ---- small helpers (safe + fast) ----
const norm = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents

function fuzzyIncludes(needle, hay) {
  const q = norm(needle).trim();
  const h = norm(hay);
  if (!q) return true;
  if (h.includes(q)) return true;
  // token overlap fallback
  const tokens = q.split(/\s+/).filter(Boolean);
  const hit = tokens.filter((t) => h.includes(t)).length;
  return hit >= Math.max(1, Math.ceil(tokens.length * 0.6));
}

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

// -------- component --------
export default function ProductsExplorer({ products = [] }) {
  const { t } = useLocale();

  // derive categories & price bounds
  const categories = useMemo(() => {
    const set = new Set();
    for (const p of products) if (p?.category) set.add(p.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const [priceMinBound, priceMaxBound] = useMemo(() => {
    const prices = products
      .map((p) => Number(p?.price ?? 0))
      .filter((n) => isFinite(n));
    if (!prices.length) return [0, 0];
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // state
  const [search, setSearch] = useState("");
  const [cats, setCats] = useState(() => new Set());
  const [priceMin, setPriceMin] = useState(priceMinBound);
  const [priceMax, setPriceMax] = useState(priceMaxBound);
  const [sort, setSort] = useState("featured");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);

  // keep price bounds in sync if products change
  useEffect(() => {
    setPriceMin(priceMinBound);
    setPriceMax(priceMaxBound);
  }, [priceMinBound, priceMaxBound]);

  // Allow /search?autofocus=1 pattern to focus input when navigated
  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);
    if (usp.get("autofocus") === "1") {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, []);

  // filter + sort
  const filtered = useMemo(() => {
    let list = products.slice();

    // category filter
    if (cats.size) list = list.filter((p) => cats.has(p?.category));

    // price filter
    list = list.filter((p) => {
      const n = Number(p?.price ?? 0);
      if (!isFinite(n)) return false;
      return n >= priceMin && n <= priceMax;
    });

    // search (name, category, shortDesc, longDesc)
    if (search.trim()) {
      list = list.filter((p) => {
        const hay =
          (p?.name || "") +
          " " +
          (p?.category || "") +
          " " +
          (p?.shortDesc || "") +
          " " +
          (p?.longDesc || "");
        return fuzzyIncludes(search, hay);
      });
    }

    // sort
    list.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return Number(a.price) - Number(b.price);
        case "price_desc":
          return Number(b.price) - Number(a.price);
        case "name_asc":
          return String(a.name).localeCompare(String(b.name));
        case "newest": {
          const ad = new Date(a?.createdAt || 0).getTime() || 0;
          const bd = new Date(b?.createdAt || 0).getTime() || 0;
          return bd - ad;
        }
        default: {
          // featured -> featured first, then newest
          const af = a?.featured ? 1 : 0;
          const bf = b?.featured ? 1 : 0;
          if (bf !== af) return bf - af;
          const ad = new Date(a?.createdAt || 0).getTime() || 0;
          const bd = new Date(b?.createdAt || 0).getTime() || 0;
          return bd - ad;
        }
      }
    });

    return list;
  }, [products, cats, priceMin, priceMax, search, sort]);

  // ui helpers
  const toggleCat = (c) => {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const clearAll = () => {
    setCats(new Set());
    setSearch("");
    setPriceMin(priceMinBound);
    setPriceMax(priceMaxBound);
    setSort("featured");
  };

  // ----- UI -----
  return (
    <section className="bg-white">
      <div className="container-tight py-8 md:py-10">
        {/* Controls Row */}
        <div className="rounded-2xl border border-white/60 p-3 md:p-4 bg-white overflow-x-hidden">
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Search + Sort (wrap on small) */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
              <div className="relative flex-1 min-w-0">
                <SearchIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-brand/25 bg-mist text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 min-w-0"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-white"
                    aria-label="Clear"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-brand/25 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <option value="featured">{t("sort_featured")}</option>
                  <option value="price_asc">{t("sort_price_asc")}</option>
                  <option value="price_desc">{t("sort_price_desc")}</option>
                  <option value="name_asc">{t("sort_name_asc")}</option>
                  <option value="newest">Newest</option>
                </select>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden inline-flex items-center gap-2 rounded-lg border border-brand/25 bg-white px-3 py-2 text-sm text-ink"
                >
                  <SlidersHorizontal size={16} />
                  {t("categories_label")}
                </button>
              </div>
            </div>

            {/* Category chips (scrollable row, no page overflow) */}
            {!!categories.length && (
              <div className="relative -mx-1 md:mx-0">
                <div className="overflow-x-auto overscroll-x-contain no-scrollbar px-1">
                  <div className="inline-flex gap-2 py-1 min-w-0">
                    {categories.map((c) => {
                      const active = cats.has(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleCat(c)}
                          className={
                            "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition " +
                            (active
                              ? "border-brand bg-mist text-brand"
                              : "border-white/60 bg-white text-ink hover:bg-mist")
                          }
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Price range (simple inputs; no overflow) */}
            {isFinite(priceMinBound) &&
              isFinite(priceMaxBound) &&
              priceMaxBound > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted">{t("price_label")}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceMin}
                      min={priceMinBound}
                      max={priceMax}
                      onChange={(e) =>
                        setPriceMin(
                          clamp(
                            Number(e.target.value || 0),
                            priceMinBound,
                            priceMax
                          )
                        )
                      }
                      className="w-24 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                    />
                    <span className="text-muted">—</span>
                    <input
                      type="number"
                      value={priceMax}
                      min={priceMin}
                      max={priceMaxBound}
                      onChange={(e) =>
                        setPriceMax(
                          clamp(
                            Number(e.target.value || 0),
                            priceMin,
                            priceMaxBound
                          )
                        )
                      }
                      className="w-24 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                    />
                  </div>

                  <button
                    onClick={clearAll}
                    className="ml-auto md:ml-0 inline-flex items-center gap-1 rounded-lg border border-brand/25 bg-white px-3 py-2 text-sm text-ink hover:bg-mist"
                  >
                    <X size={14} />
                    {t("clear")}
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Layout: sidebar on desktop, cards on right */}
        <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr] min-w-0">
          {/* Desktop filters sidebar (no overflow) */}
          <aside className="hidden md:block rounded-2xl border border-white/60 p-4 h-fit sticky top-24">
            <h3 className="text-sm font-semibold text-ink mb-3">
              {t("categories_label")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = cats.has(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition " +
                      (active
                        ? "border-brand bg-mist text-brand"
                        : "border-white/60 bg-white text-ink hover:bg-mist")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-semibold text-ink mb-2">
                {t("price_label")}
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin}
                  min={priceMinBound}
                  max={priceMax}
                  onChange={(e) =>
                    setPriceMin(
                      clamp(
                        Number(e.target.value || 0),
                        priceMinBound,
                        priceMax
                      )
                    )
                  }
                  className="w-24 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                />
                <span className="text-muted">—</span>
                <input
                  type="number"
                  value={priceMax}
                  min={priceMin}
                  max={priceMaxBound}
                  onChange={(e) =>
                    setPriceMax(
                      clamp(
                        Number(e.target.value || 0),
                        priceMin,
                        priceMaxBound
                      )
                    )
                  }
                  className="w-24 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                />
              </div>

              <button
                onClick={clearAll}
                className="mt-4 inline-flex items-center gap-1 rounded-lg border border-brand/25 bg-white px-3 py-2 text-sm text-ink hover:bg-mist"
              >
                <X size={14} />
                {t("clear")}
              </button>
            </div>
          </aside>

          {/* Cards grid */}
          <div className="min-w-0">
            <div className="mb-2 text-sm text-muted">
              {filtered.length} {t("results_for")}{" "}
              <span className="font-medium text-ink">
                {search ? `"${search}"` : t("shop_all")}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-w-0">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER (no side scroll, no w-screen) */}
      {mobileOpen && (
        <>
          <button
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[70] bg-black/30 md:hidden"
          />
          <div
            className="
              fixed inset-x-0 bottom-0 top-0 z-[75] md:hidden
              bg-white border-t border-white/60
              overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y
              max-w-full
            "
          >
            <div className="sticky top-0 bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur border-b">
              <div className="container-tight flex items-center justify-between py-3">
                <span className="text-base font-semibold text-ink">
                  {t("categories_label")}
                </span>
                <button
                  className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-mist"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="container-tight py-4 space-y-6">
              {/* Categories */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const active = cats.has(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCat(c)}
                        className={
                          "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition " +
                          (active
                            ? "border-brand bg-mist text-brand"
                            : "border-white/60 bg-white text-ink hover:bg-mist")
                        }
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-semibold text-ink mb-2">
                  {t("price_label")}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    min={priceMinBound}
                    max={priceMax}
                    onChange={(e) =>
                      setPriceMin(
                        clamp(
                          Number(e.target.value || 0),
                          priceMinBound,
                          priceMax
                        )
                      )
                    }
                    className="w-28 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                  />
                  <span className="text-muted">—</span>
                  <input
                    type="number"
                    value={priceMax}
                    min={priceMin}
                    max={priceMaxBound}
                    onChange={(e) =>
                      setPriceMax(
                        clamp(
                          Number(e.target.value || 0),
                          priceMin,
                          priceMaxBound
                        )
                      )
                    }
                    className="w-28 rounded-lg border border-brand/25 bg-white px-2 py-1.5 text-sm"
                  />
                </div>
                <button
                  onClick={clearAll}
                  className="mt-4 inline-flex items-center gap-1 rounded-lg border border-brand/25 bg-white px-3 py-2 text-sm text-ink hover:bg-mist"
                >
                  <X size={14} />
                  {t("clear")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
