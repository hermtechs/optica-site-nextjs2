"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { SlidersHorizontal } from "lucide-react";

/**
 * Props:
 * - products: Array<{ slug, name, price, image, category, shortDesc?, longDesc? }>
 * - title?: string
 */
export default function ProductsExplorer({
  products = [],
  title = "Shop All",
}) {
  // Toolbar state
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured"); // featured | priceAsc | priceDesc | nameAsc
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  // Derive categories from data
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Build filtered list
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);

    return products.filter((p) => {
      // search
      const hay = `${p.name} ${p.shortDesc || ""} ${
        p.longDesc || ""
      }`.toLowerCase();
      if (term && !hay.includes(term)) return false;

      // category filter
      if (selectedCats.size && !selectedCats.has(p.category)) return false;

      // price filter
      if (typeof p.price === "number" && (p.price < min || p.price > max))
        return false;

      return true;
    });
  }, [products, q, selectedCats, minPrice, maxPrice]);

  // Sort
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
        // featured: leave as-is
        break;
    }
    return arr;
  }, [filtered, sort]);

  // Quick helpers
  const toggleCat = (c) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };
  const clearFilters = () => {
    setSelectedCats(new Set());
    setMinPrice("");
    setMaxPrice("");
  };

  // Simple "eye-catching" header bar
  return (
    <section className="bg-white">
      <div className="container-tight py-12 md:py-16">
        {/* Title + result count + sort */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-ink">
              {title}
            </h2>
            <p className="text-sm text-muted mt-1">
              {sorted.length} result{sorted.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-[min(80vw,22rem)] rounded-md border border-brand/25 bg-mist px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
            />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-brand/25 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A–Z</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="md:hidden inline-flex items-center gap-2 rounded-md border border-brand/25 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Filters row (always visible on md+, collapsible on mobile) */}
        <div className={(filtersOpen ? "block" : "hidden") + " md:block"}>
          <div className="rounded-xl2 border border-white/60 bg-mist/50 p-4 md:p-5 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              {/* Categories */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink mb-2">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const active = selectedCats.has(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCat(c)}
                        className={
                          "px-3 py-1.5 rounded-md text-sm border transition " +
                          (active
                            ? "bg-brand text-white border-brand"
                            : "bg-white text-brand border-brand/30 hover:bg-mist")
                        }
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="w-full md:w-auto md:min-w-[280px]">
                <p className="text-sm font-semibold text-ink mb-2">Price</p>
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
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {sorted.length === 0 ? (
          <div className="text-center text-muted py-16">
            No products match your filters.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
