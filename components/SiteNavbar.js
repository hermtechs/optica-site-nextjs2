// components/SiteNavbar.js
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

/**
 * Props:
 * - overHero: boolean  (transparent style over hero)
 * - offsetByPromo: boolean (if true, navbar sits below promo bar at top-10)
 */
export default function SiteNavbar({ overHero = true, offsetByPromo = true }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // avoid SSR/CSR aria-label mismatch
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => setMounted(true), []);

  // Close on Escape
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const wrap = overHero
    ? `absolute inset-x-0 ${offsetByPromo ? "top-10" : "top-0"} z-50 ${
        open ? "text-ink" : "text-white"
      }`
    : "relative border-b bg-white text-ink";

  const barClasses =
    "container-tight h-20 flex items-center justify-between relative " +
    (overHero
      ? open
        ? "bg-white"
        : "bg-gradient-to-b from-black/20 to-transparent"
      : "bg-white");

  const link =
    overHero && !open
      ? "text-white/90 hover:text-white"
      : "text-muted hover:text-ink";

  const iconBtn =
    "inline-flex items-center justify-center rounded-full w-10 h-10 " +
    (overHero && !open
      ? "hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 text-white"
      : "hover:bg-surf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 text-ink");

  // Localized aria labels only after mount to prevent hydration mismatch
  const ariaSearch = mounted ? t("search_aria") : undefined;
  const ariaMenu = mounted ? t("menu") : undefined;
  const ariaClose = mounted ? t("close_menu") : undefined;

  return (
    <header className={wrap} role="navigation" aria-label="Main">
      {/* Top bar */}
      <div className={barClasses}>
        {/* LEFT: Search opens /search */}
        <div className="flex items-center gap-3">
          <button
            suppressHydrationWarning
            aria-label={ariaSearch}
            className={iconBtn}
            onClick={() => router.push("/search?autofocus=1")}
          >
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* CENTER (desktop): nav • brand • nav */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm">
          <nav className="flex items-center gap-6">
            <Link href="/" className={link}>
              {t("home")}
            </Link>
            <Link href="/search" className={link}>
              {t("shops")}
            </Link>
            <Link href="/products" className={link}>
              {t("products")}
            </Link>
          </nav>

          <Link
            href="/"
            className={
              (overHero && !open ? "text-white" : "text-ink") +
              " text-2xl font-semibold tracking-wide"
            }
          >
            {t("brand")}
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/about" className={link}>
              {t("about_link")}
            </Link>
            <Link href="/search?q=blog" className={link}>
              {t("blog")}
            </Link>
            <Link href="/search" className={link}>
              {t("pages")}
            </Link>
            <Link href="/search?q=faq" className={link}>
              {t("faqs")}
            </Link>
          </nav>
        </div>

        {/* CENTER (mobile): brand */}
        <Link
          href="/"
          className={
            "md:hidden text-2xl font-semibold tracking-wide " +
            (overHero && !open ? "text-white" : "text-ink")
          }
        >
          {t("brand")}
        </Link>

        {/* RIGHT: Desktop language toggle + Mobile hamburger */}
        <div className="flex items-center gap-2">
          {/* Desktop language toggle (wrapped in Suspense) */}
          <div className="hidden md:block">
            <Suspense fallback={null}>
              <LanguageToggle size="sm" />
            </Suspense>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              suppressHydrationWarning
              aria-label={open ? ariaClose : ariaMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={iconBtn}
            >
              {open ? (
                <X size={22} strokeWidth={2.25} />
              ) : (
                <Menu size={22} strokeWidth={2.25} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: backdrop + panel */}
      {open && (
        <>
          {/* Backdrop (tap to close) */}
          <button
            suppressHydrationWarning
            aria-label={ariaClose}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
          />

          {/* Drawer panel */}
          <div
            className="
              fixed inset-x-0 top-0 bottom-0 z-50 md:hidden
              bg-white text-ink
              overflow-y-auto overflow-x-hidden     /* prevent side scroll */
              overscroll-contain touch-pan-y         /* better mobile scroll */
              w-screen                               /* lock width to viewport */
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spacer for navbar/promo */}
            <div className={offsetByPromo ? "h-[5rem]" : "h-20"} />

            {/* Sticky header with single close button */}
            <div className="sticky top-0 z-50 bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur border-b">
              <div className="container-tight flex items-center justify-between py-2">
                <span className="text-lg font-semibold text-ink">
                  {t("menu")}
                </span>
                <button
                  suppressHydrationWarning
                  aria-label={ariaClose}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Links */}
            <nav className="container-tight py-4 text-lg">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("shops")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("products")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("about_link")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?q=blog"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("pages")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?q=faq"
                    className="block px-1 py-2 rounded hover:bg-mist"
                    onClick={() => setOpen(false)}
                  >
                    {t("faqs")}
                  </Link>
                </li>
              </ul>

              {/* Language toggle inside panel */}
              <div className="mt-6">
                <Suspense fallback={null}>
                  <LanguageToggle fullWidth size="md" />
                </Suspense>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
