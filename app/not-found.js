"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Home } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function NotFound() {
  const { locale, t } = useLocale();
  const isEN = locale === "en";
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const dest = q.trim()
      ? `/search?q=${encodeURIComponent(q)}&autofocus=1`
      : `/search?autofocus=1`;
    router.push(dest);
  };

  return (
    <>
      {/* No promo bar here to keep it clean; navbar still matches the site */}
      <SiteNavbar overHero={false} offsetByPromo={false} />

      <main className="relative bg-white">
        {/* subtle backdrop */}
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
                placeholder={
                  isEN ? t("search_placeholder") : t("search_placeholder")
                }
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

            {/* Helpful links (optional quick categories) */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-muted mb-2">
                {isEN ? "Popular quick links" : "Enlaces rápidos populares"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/search?cats=Sunglasses"
                  className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                >
                  {isEN ? "Sunglasses" : "Gafas de sol"}
                </Link>
                <Link
                  href="/search?cats=Blue-Light%20Glasses"
                  className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                >
                  {isEN ? "Blue-Light" : "Luz azul"}
                </Link>
                <Link
                  href="/search?q=reading"
                  className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                >
                  {isEN ? "Reading" : "Lectura"}
                </Link>
                <Link
                  href="/search?q=kids"
                  className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                >
                  {isEN ? "Kids" : "Niños"}
                </Link>
                <Link
                  href="/search?cats=Contact%20Lenses"
                  className="px-3 py-1.5 rounded-md border border-brand/25 text-sm text-brand hover:bg-mist"
                >
                  {isEN ? "Contact lenses" : "Lentes de contacto"}
                </Link>
              </div>
            </div>
          </div>

          {/* Big 404 marker on the side for flair */}
          <div className="pointer-events-none absolute right-0 top-16 hidden lg:block pr-2">
            <div className="text-[140px] leading-none font-black text-brand/5 select-none">
              404
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
