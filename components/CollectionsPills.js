// components/CollectionsPills.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ArrowRight } from "lucide-react";

export default function CollectionsPills() {
  const { t } = useLocale();
  const [items, setItems] = useState([]);

  // Live products (to build categories dynamically)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  // Build categories map: { name, count, cover }
  const categories = useMemo(() => {
    const map = new Map();
    for (const p of items) {
      const name = p.category_es || p.category_en || p.category || "General";
      if (!map.has(name)) {
        map.set(name, {
          name,
          count: 0,
          cover: p.image || (Array.isArray(p.gallery) ? p.gallery[0] : ""),
        });
      }
      const entry = map.get(name);
      entry.count += 1;
      // prefer first available image as cover
      if (
        !entry.cover &&
        (p.image || (Array.isArray(p.gallery) && p.gallery[0]))
      ) {
        entry.cover = p.image || p.gallery[0];
      }
    }
    // Sort by popularity; keep all for pills, but cap grid to 12
    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return {
      pills: arr,
      grid: arr.slice(0, 12),
    };
  }, [items]);

  const pillBase =
    "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors";
  const pillIdle =
    "bg-white text-ink ring-1 ring-brand/20 hover:ring-brand/40 shadow";
  const sectionTitle = t("shop_by_category") || "Comprar por categoría";

  return (
    <section className="relative py-10">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surf/70 to-white" />

      <div className="container-tight">
        {/* Heading */}
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{sectionTitle}</h2>
            <p className="text-muted">
              {t("feature_subtitle") ||
                "Selección curada: líneas limpias y comodidad diaria."}
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-3 py-2 text-sm text-ink hover:border-brand/40 hover:bg-mist"
          >
            {t("shop_all") || "Ver Todo"}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Pills row (always visible, scrollable on mobile) */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-1">
          <div className="flex w-max gap-2">
            <Link
              href="/products"
              className={`${pillBase} bg-brand text-white shadow`}
            >
              {t("shop_all") || "Ver Todo"}
            </Link>
            {categories.pills.map((c) => (
              <Link
                key={c.name}
                href={`/categories?cat=${encodeURIComponent(c.name)}`}
                className={`${pillBase} ${pillIdle}`}
                title={`${c.name} (${c.count})`}
              >
                <span className="truncate">{c.name}</span>
                <span className="ml-2 rounded-full bg-surf px-1.5 py-0.5 text-xs text-muted">
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid cards (md+ only) */}
        <div className="hidden md:grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.grid.map((c) => (
            <Link
              key={c.name}
              href={`/categories?cat=${encodeURIComponent(c.name)}`}
              className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-brand/10 transition hover:shadow-md hover:ring-brand/20"
            >
              {/* gentle corner waves */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/5 blur-0 transition group-hover:bg-brand/10" />
              <div className="pointer-events-none absolute -left-8 -bottom-12 h-28 w-28 rounded-full bg-brand/5 transition group-hover:bg-brand/10" />

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-brand/10">
                  {c.cover ? (
                    <img
                      src={c.cover}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surf text-sm text-muted">
                      {c.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-ink">
                    {c.name}
                  </div>
                  <div className="text-sm text-muted">{c.count} items</div>
                </div>
                <ArrowRight
                  size={18}
                  className="ml-auto text-muted transition group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile “View all” button */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/categories"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-sm text-ink hover:border-brand/40 hover:bg-mist"
          >
            {t("shop_all") || "Ver Todo"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
