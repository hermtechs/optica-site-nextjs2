"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import productsData from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PromoBar from "@/components/PromoBar";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

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

/**
 * Reusable All Products + Search page
 * Props:
 * - basePath: "/search" | "/products"  (used in the URL while you filter/sort)
 * - title?: string
 * - subtitle?: string
 * - autofocusParam?: string  (query param name that triggers focus-on-arrival, default "autofocus")
 */
export default function ProductsSearchPage({
  basePath = "/search",
  title,
  subtitle,
  autofocusParam = "autofocus",
}) {
  const { t } = useLocale();
  const params = useSearchParams();

  // URL → state (defaults make page show ALL products when q is empty)
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

  const inputRef = useRef(null);
  const headerRef = useRef(null);

  // derive categories
  const categories = useMemo(() => {
    const set = new Set(productsData.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // index for Fuse
  const indexItems = useMemo(
    () =>
      productsData.map((p) => ({
        ...p,
        iName: normalize(p.name),
        iShort: normalize(p.shortDesc || ""),
        iLong: normalize(p.longDesc || ""),
        iCat: normalize(p.category || ""),
      })),
    []
  );

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

  // focus the input on first paint; if asked (…?autofocus=1), also scroll it into view
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

  // keep URL in sync under the current base path
  useEffect(() => {
    const url = buildUrl(basePath, {
      q,
      sort,
      cats: Array.from(selectedCats),
      minPrice,
      maxPrice,
    });
    window.history.replaceState(null, "", url);
  }, [q, sort, selectedCats, minPrice, maxPrice, basePath]);

  // search → filter → sort
  const searched = useMemo(() => {
    const query = normalize(q);
    if (!query) return indexItems.map((p) => ({ item: p, score: 0.9 })); // show ALL by default
    return fuse
      .search(query)
      .map((r) => ({ item: r.item, score: r.score ?? 1 }));
  }, [q, fuse, indexItems]);

  const filtered = useMemo(() => {
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    return searched
      .map((r) => r.item)
      .filter((p) => {
        if (selectedCats.size && !selectedCats.has(p.category)) return false;
        if (typeof p.price === "number" && (p.price < min || p.price > max))
          return false;
        return true;
      });
  }, [searched, selectedCats, minPrice, maxPrice]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "priceAsc":
        arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "nameAsc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // featured: original order
    }
    return arr;
  }, [filtered, sort]);

  const suggestion = useMemo(() => {
    if (!q.trim() || searched.length === 0) return null;
    const best = searched[0];
    return best.score > 0.5 ? best.item.name : null;
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
                DamiOptica — Todos los productos / All products
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
                      placeholder="Min"
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
                      placeholder="Max"
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
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
