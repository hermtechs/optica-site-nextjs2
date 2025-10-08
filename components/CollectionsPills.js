"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULTS = [
  { label: "MEN'S GLASSES", href: "/category/mens-glasses" },
  { label: "WOMEN'S GLASSES", href: "/category/womens-glasses" },
  { label: "KIDS' GLASSES", href: "/category/kids-glasses" },
  { label: "SUNGLASSES", href: "/category/sunglasses" },
  {
    label: "PRESCRIPTION SUNGLASSES",
    href: "/category/prescription-sunglasses",
  },
  { label: "CONTACT LENSES", href: "/category/contact-lenses" },
  { label: "BLUE-LIGHT GLASSES", href: "/category/blue-light" },
  { label: "SPORTS & SAFETY", href: "/category/sports-safety" },
  { label: "NEW ARRIVALS", href: "/category/new" },
  { label: "BEST SELLERS", href: "/category/best-sellers" },
  { label: "ACCESSORIES", href: "/category/accessories" },
  { label: "BOOK EYE EXAM", href: "/book/exam" },
];

/**
 * Props:
 * - onSearch?: (query: string) => void
 * - productCount?: number
 * - categories?: {label, href}[]
 * - title?: string
 */
export default function CollectionsPills({
  title = "Shop by Category",
  categories = DEFAULTS,
  onSearch,
  productCount,
}) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [multiRow, setMultiRow] = useState(false);
  const [rowHeight, setRowHeight] = useState(0);
  const [isWide, setIsWide] = useState(false); // >=500px → show all

  const gridRef = useRef(null);

  // Tell parent whenever query changes
  useEffect(() => {
    onSearch?.(q);
  }, [q, onSearch]);

  // ≥ 500px → always show all (no toggle)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 500px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    mq.addListener?.(update);
    return () => {
      mq.removeEventListener?.("change", update);
      mq.removeListener?.(update);
    };
  }, []);

  // On small screens only: detect if pills wrap to more than one row
  useEffect(() => {
    if (isWide) {
      setMultiRow(false);
      setExpanded(true);
      return;
    }
    const el = gridRef.current;
    if (!el) return;

    const measure = () => {
      const pills = el.querySelectorAll('a[data-pill="true"]');
      if (!pills.length) {
        setMultiRow(false);
        setRowHeight(0);
        return;
      }
      const firstTop = pills[0].offsetTop;
      let firstRowBottom = 0,
        lastTop = firstTop;

      pills.forEach((p) => {
        const top = p.offsetTop,
          bottom = top + p.offsetHeight;
        if (top === firstTop && bottom > firstRowBottom)
          firstRowBottom = bottom;
        lastTop = top;
      });

      setRowHeight(firstRowBottom - firstTop);
      const wraps = lastTop > firstTop;
      setMultiRow(wraps);
      if (!wraps) setExpanded(false);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll('a[data-pill="true"]').forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, [categories, isWide]);

  const showCollapsed = !isWide && multiRow && !expanded;

  return (
    <section className="bg-white">
      <div className="container-tight py-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-ink">
              {title}
            </h2>
            {typeof productCount === "number" && (
              <span className="text-xs px-2 py-1 rounded bg-mist text-brand border border-brand/20">
                {productCount} results
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-md border border-brand/25 bg-mist px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </div>

        {/* Pills grid */}
        <div
          className={
            "relative transition-[height] duration-300 " +
            (showCollapsed ? "" : "h-auto")
          }
          style={
            showCollapsed
              ? {
                  height: rowHeight ? `${rowHeight}px` : undefined,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {showCollapsed && (
            <div className="pointer-events-none absolute inset-x-0 -bottom-0 h-8 bg-gradient-to-b from-transparent to-white" />
          )}

          <div
            ref={gridRef}
            className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]"
          >
            {categories.map((it) => (
              <a
                key={it.label}
                data-pill="true"
                href={it.href || "#"}
                title={it.label}
                className="group inline-flex items-center justify-center rounded-md border border-brand/30 bg-white px-4 py-3 text-[0.92rem] font-semibold text-brand shadow-card hover:bg-mist focus:outline-none focus:ring-2 focus:ring-brand/40 transition truncate"
              >
                <span className="truncate">{it.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile-only toggle when wrapping occurs */}
        {!isWide && multiRow && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn-outline px-5 py-2"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
