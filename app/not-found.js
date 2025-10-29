// app/not-found.js
"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Home } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";

// 🔴 Firestore client (safe on client components)
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";

function toDateAny(ts) {
  // Supports Firestore Timestamp, ISO strings, ms numbers
  if (!ts) return null;
  if (ts?.toDate) return ts.toDate();
  const d = new Date(ts);
  return isNaN(d) ? null : d;
}

export default function NotFound() {
  const { locale, t } = useLocale();
  const isEN = locale === "en";
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  // 🔄 Live products for dynamic links
  const [items, setItems] = useState([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  // Build category tally: {name, count}
  const topCategories = useMemo(() => {
    const map = new Map();
    for (const p of items) {
      const name = p.category_es || p.category_en || p.category || "General";
      map.set(name, (map.get(name) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [items]);

  // Featured picks → or latest by createdAt
  const featuredOrLatest = useMemo(() => {
    const withDate = (p) => toDateAny(p.createdAt)?.getTime() || 0;
    let arr = items.filter((p) => p.featured === true);
    if (arr.length === 0)
      arr = [...items].sort((a, b) => withDate(b) - withDate(a));
    else arr = arr.sort((a, b) => withDate(b) - withDate(a));
    return arr.slice(0, 6);
  }, [items]);

  const onSearch = (e) => {
    e.preventDefault();
    const dest = q.trim()
      ? `/search?q=${encodeURIComponent(q)}&autofocus=1`
      : `/search?autofocus=1`;
    router.push(dest);
  };

  return (
    <>
      {/* Wrap components that might use useSearchParams under Suspense */}
      <Suspense fallback={null}>
        <SiteNavbar overHero={false} offsetByPromo={false} />
      </Suspense>

      <main className="relative bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist/60 to-transparent"
          aria-hidden="true"
        />
        <div className="container-tight relative py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand/80">
              {isEN ? "Error 404" : "Error 404"}
            </span>

            <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-ink">
              {isEN ? "Page not found" : "Página no encontrada"}
            </h1>

            <p className="mt-3 text-sm md:text-base text-muted">
              {isEN
                ? "We couldn’t find what you’re looking for. Try searching the catalog or browse all products."
                : "No pudimos encontrar lo que buscas. Prueba buscando en el catálogo o explora todos los productos."}
            </p>

            {/* Search box */}
            <form
              onSubmit={onSearch}
              className="mt-6 relative w-full md:w-[34rem]"
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
                className="w-full pl-9 pr-24 py-3 rounded-lg border border-brand/25 bg-mist text-sm md:text-base text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 btn px-4 py-2"
              >
                {isEN ? "Search" : "Buscar"}
              </button>
            </form>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="btn-outline inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                {isEN ? "Go home" : "Volver al inicio"}
              </Link>
              <Link
                href="/search?autofocus=1"
                className="btn inline-flex items-center gap-2"
              >
                <Home size={16} />
                {isEN ? "Browse all products" : "Ver todos los productos"}
              </Link>
            </div>

            {/* Dynamic quick links */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-muted mb-2">
                {isEN ? "Popular categories" : "Categorías populares"}
              </p>
              <div className="flex flex-wrap gap-2">
                {topCategories.length === 0 ? (
                  <>
                    {/* graceful fallback when no data yet */}
                    <span className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-muted">
                      {isEN ? "Loading…" : "Cargando…"}
                    </span>
                  </>
                ) : (
                  topCategories.map((c) => (
                    <Link
                      key={c.name}
                      href={`/search?cats=${encodeURIComponent(c.name)}`}
                      className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                      title={`${c.name} (${c.count})`}
                    >
                      {c.name}
                      <span className="ml-2 rounded bg-surf px-1.5 py-0.5 text-[11px] text-muted">
                        {c.count}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Featured / Latest picks */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-muted mb-2">
                {isEN ? "You may be looking for" : "Quizás buscas"}
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredOrLatest.length === 0 ? (
                  <span className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-muted">
                    {isEN ? "Loading…" : "Cargando…"}
                  </span>
                ) : (
                  featuredOrLatest.map((p) => {
                    const displayName =
                      p.name_es || p.name_en || p.name || "Producto";
                    const href = p.slug
                      ? `/product/${encodeURIComponent(p.slug)}`
                      : `/search?q=${encodeURIComponent(
                          displayName
                        )}&autofocus=1`;
                    return (
                      <Link
                        key={p.id || p.slug || displayName}
                        href={href}
                        className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-ink hover:bg-mist"
                        title={displayName}
                      >
                        {displayName}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Big 404 mark */}
          <div className="pointer-events-none absolute right-0 top-16 hidden lg:block pr-2">
            <div className="text-[140px] leading-none font-black text-brand/5 select-none">
              404
            </div>
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
