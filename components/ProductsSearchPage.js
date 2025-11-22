// components/ProductsSearchPage.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import ProductCard from "@/components/ProductCard";
import PromoBar from "@/components/PromoBar";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Firestore (live products)
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";

/* normalize for typo/diacritic-insensitive search */
function normalize(str = "") {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* keep URL shareable with state */
function buildUrl(base, state) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.sort && state.sort !== "featured") p.set("sort", state.sort);
  if (state.cats && state.cats.length) p.set("cats", state.cats.join(","));
  if (state.minPrice !== "") p.set("min", state.minPrice);
  if (state.maxPrice !== "") p.set("max", state.maxPrice);
  return p.toString() ? `${base}?${p.toString()}` : base;
}

export default function ProductsSearchPage({
  basePath = "/search",
  title,
  subtitle,
  autofocusParam = "autofocus",
}) {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  const params = useSearchParams();

  // URL → state
  const qParam = params.get("q") || "";
  const sortParam = params.get("sort") || "featured";
  const catsParam = params.get("cats") || "";
  const minParam = params.get("min") ?? "";
  const maxParam = params.get("max") ?? "";
  const wantsAutofocus = params.get(autofocusParam) === "1";

  const [promoVisible, setPromoVisible] = useState(true);
  const [q, setQ] = useState(qParam);
  const [sort, setSort] = useState(sortParam);
  const [selectedCats, setSelectedCats] = useState(
    new Set(catsParam ? catsParam.split(",").filter(Boolean) : [])
  );
  const [minPrice, setMinPrice] = useState(minParam);
  const [maxPrice, setMaxPrice] = useState(maxParam);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // live products
  const [items, setItems] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  const inputRef = useRef(null);
  const headerRef = useRef(null);

  // categories (localized label for the chips)
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((p) =>
      set.add(
        (isEN ? p.category_en : p.category_es) ||
          p.category ||
          (isEN ? "General" : "General")
      )
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items, isEN]);

  // bilingual index for Fuse (combine both languages so either query matches)
  const indexItems = useMemo(() => {
    return items.map((p) => {
      const nameEN = p.name_en || "";
      const nameES = p.name_es || "";
      const nameRaw = p.name || "";

      const shortEN = p.shortDesc_en || "";
      const shortES = p.shortDesc_es || "";
      const shortRaw = p.shortDesc || "";

      const longEN = p.longDesc_en || "";
      const longES = p.longDesc_es || "";
      const longRaw = p.longDesc || "";

      const catEN = p.category_en || "";
      const catES = p.category_es || "";
      const catRaw = p.category || "";

      // Combined text per field so Fuse can match either language
      const bothNames = [nameEN, nameES, nameRaw].filter(Boolean).join(" | ");
      const bothShort = [shortEN, shortES, shortRaw]
        .filter(Boolean)
        .join(" | ");
      const bothLong = [longEN, longES, longRaw].filter(Boolean).join(" | ");
      const bothCats = [catEN, catES, catRaw].filter(Boolean).join(" | ");

      // A locale-preferred display name/category for UI (not used by Fuse)
      const displayName =
        (isEN ? nameEN : nameES) || nameEN || nameES || nameRaw || "";
      const displayCategory =
        (isEN ? catEN : catES) || catEN || catES || catRaw || "";

      return {
        ...p,
        _displayName: displayName,
        _displayCategory: displayCategory,
        // Fuse fields (normalized, contain both EN and ES)
        iName: normalize(bothNames),
        iShort: normalize(bothShort),
        iLong: normalize(bothLong),
        iCat: normalize(bothCats),
      };
    });
  }, [items, isEN]);

  const fuse = useMemo(
    () =>
      new Fuse(indexItems, {
        includeScore: true,
        shouldSort: true,
        threshold: 0.38,
        distance: 80,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: "iName", weight: 0.55 },
          { name: "iShort", weight: 0.25 },
          { name: "iCat", weight: 0.12 },
          { name: "iLong", weight: 0.08 },
        ],
      }),
    [indexItems]
  );

  // focus the input on first paint; optionally scroll to it
  useEffect(() => {
    inputRef.current?.focus();
    if (wantsAutofocus) {
      setTimeout(() => {
        headerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        inputRef.current?.focus();
      }, 80);
    }
  }, [wantsAutofocus]);

  // keep URL in sync
  useEffect(() => {
    const url = buildUrl(basePath, {
      q,
      sort,
      cats: Array.from(selectedCats),
      minPrice,
      maxPrice,
    });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", url);
    }
  }, [q, sort, selectedCats, minPrice, maxPrice, basePath]);

  // search → filter → sort
  const searched = useMemo(() => {
    const query = normalize(q);
    if (!query) {
      // show ALL by default
      return indexItems.map((p) => ({ item: p, score: 0.9 }));
    }
    return fuse
      .search(query)
      .map((r) => ({ item: r.item, score: r.score ?? 1 }));
  }, [q, fuse, indexItems]);

  const filtered = useMemo(() => {
    // robust price parsing
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    const [low, high] =
      Number.isFinite(min) && Number.isFinite(max) && min > max
        ? [max, min] // swap if user inverted
        : [min, max];

    return searched
      .map((r) => r.item)
      .filter((p) => {
        // category filter uses localized display category
        if (selectedCats.size && !selectedCats.has(p._displayCategory)) {
          return false;
        }

        // price filter (coerce to number if it's a string in Firestore)
        const priceNum = Number(p.price);
        if (Number.isFinite(priceNum)) {
          if (priceNum < low || priceNum > high) return false;
        }
        // if price is not a number, ignore price filter for that product
        return true;
      });
  }, [searched, selectedCats, minPrice, maxPrice]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "priceAsc":
        arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "priceDesc":
        arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "nameAsc":
        arr.sort((a, b) => a._displayName.localeCompare(b._displayName));
        break;
      default:
        // featured: keep incoming order
        break;
    }
    return arr;
  }, [filtered, sort]);

  const suggestion = useMemo(() => {
    if (!q.trim() || searched.length === 0) return null;
    const best = searched[0];
    const bestName = best.item._displayName;
    return best.score > 0.5 ? bestName : null;
  }, [q, searched]);

  const toggleCat = (c) =>
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const clearFilters = () => {
    setSelectedCats(new Set());
    setMinPrice("");
    setMaxPrice("");
  };

  const chipBase =
    "px-3 py-1.5 rounded-md text-sm border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";
  const chipOn = "bg-brand text-white border-brand";
  const chipOff = "bg-white text-brand border-brand/30 hover:bg-mist";

  return (
    <>
      {promoVisible && <PromoBar onClose={() => setPromoVisible(false)} />}
      <SiteNavbar overHero={false} offsetByPromo={promoVisible} />

      <main className="bg-white">
        <div className="container-tight pt-8 md:pt-10 pb-14">
          {/* Header / toolbar */}
          <div
            ref={headerRef}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-ink">
                {title || "DamiOptica — Todos los productos / All products"}
              </h1>
              <p className="text-sm text-muted mt-1">
                {subtitle || t("search_sub")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Search */}
              <form
                className="relative w-full sm:w-[min(80vw,28rem)]"
                onSubmit={(e) => e.preventDefault()}
              >
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="w-full pl-9 pr-9 py-2 rounded-md border border-brand/25 bg-mist text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                {q && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setQ("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded hover:bg-white"
                  >
                    <X size={16} className="text-muted" />
                  </button>
                )}
              </form>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-brand/25 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="featured">{t("sort_featured")}</option>
                <option value="priceAsc">{t("sort_price_asc")}</option>
                <option value="priceDesc">{t("sort_price_desc")}</option>
                <option value="nameAsc">{t("sort_name_asc")}</option>
              </select>

              {/* Mobile filters toggle */}
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="sm:hidden inline-flex items-center gap-2 rounded-md border border-brand/25 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal size={16} /> {t("categories_label")}
              </button>
            </div>
          </div>

          {/* Did you mean */}
          {suggestion && (
            <div className="mb-4 text-sm">
              <span className="text-muted">{t("did_you_mean")}</span>{" "}
              <button
                type="button"
                className="font-medium text-brand hover:underline"
                onClick={() => setQ(suggestion)}
              >
                {suggestion}
              </button>
              <span className="text-muted">?</span>
            </div>
          )}

          {/* Filters bar */}
          <div className={(filtersOpen ? "block" : "hidden") + " sm:block"}>
            <div className="rounded-xl2 border border-white/60 bg-mist/50 p-4 md:p-5 mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                {/* Categories */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink mb-2">
                    {t("categories_label")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const active = selectedCats.has(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCat(c)}
                          className={`${chipBase} ${active ? chipOn : chipOff}`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price */}
                <div className="w-full md:w-auto md:min-w-[300px]">
                  <p className="text-sm font-semibold text-ink mb-2">
                    {t("price_label")}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(e.target.value.replace(/[^\d]/g, ""))
                      }
                      placeholder={isEN ? "Min" : "Mín"}
                      className="w-24 rounded-md border border-brand/25 bg-white px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <span className="text-muted">—</span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(e.target.value.replace(/[^\d]/g, ""))
                      }
                      placeholder={isEN ? "Max" : "Máx"}
                      className="w-24 rounded-md border border-brand/25 bg-white px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-2 btn-outline px-3 py-2"
                    >
                      {t("clear")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results header */}
          <p className="text-sm text-muted mb-4">
            {sorted.length} {t("results_for")}
            {q ? (
              <>
                {" "}
                “<span className="text-ink">{q}</span>”
              </>
            ) : null}
          </p>

          {/* Results grid */}
          {sorted.length === 0 ? (
            <div className="text-center text-muted py-16">
              {t("no_results")}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((p) => (
                <ProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
