"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import useSiteContent from "@/lib/useSiteContent";

function CTA({ href, children, variant = "primary" }) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2";
  return variant === "secondary" ? (
    <Link
      href={href || "#"}
      className={`${base} btn-outline bg-white/10 border-white/60 text-white hover:bg-white/20 focus-visible:ring-white/60`}
    >
      {children}
    </Link>
  ) : (
    <Link
      href={href || "#"}
      className={`${base} bg-brand text-white hover:opacity-90 focus-visible:ring-brand/40`}
    >
      {children}
    </Link>
  );
}

export default function HeroCarousel() {
  const { locale } = useLocale();
  const isEN = locale === "en";
  const { content } = useSiteContent();

  const rawSlides = Array.isArray(content?.hero_slides)
    ? content.hero_slides
    : [];

  const slides = useMemo(() => {
    const list = rawSlides
      .filter((s) => s && s.enabled !== false)
      .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0))
      .map((s) => {
        const eyebrow = (isEN ? s.eyebrow_en : s.eyebrow_es) ?? s.eyebrow ?? "";
        const title = (isEN ? s.title_en : s.title_es) ?? s.title ?? "";
        const subtitle =
          (isEN ? s.subtitle_en : s.subtitle_es) ?? s.subtitle ?? "";
        const ctas = Array.isArray(s.ctas)
          ? s.ctas.map((c, i) => ({
              href: c.href || "#",
              variant: c.variant === "secondary" ? "secondary" : "primary",
              label: (isEN ? c.label_en : c.label_es) ?? c.label ?? "",
              key: `cta-${i}`,
            }))
          : [];
        return {
          id: s.id || `${title}-${Math.random().toString(36).slice(2)}`,
          img: s.image || "/hero-banner.jpg",
          eyebrow,
          title,
          subtitle,
          ctas,
        };
      });
    return list;
  }, [rawSlides, isEN]);

  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!slides.length) return;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer.current);
  }, [slides.length, locale]);

  const go = (d) =>
    setIndex((i) => (i + d + (slides.length || 1)) % (slides.length || 1));

  if (!slides.length) return null;

  return (
    <section className="relative overflow-x-hidden">
      <div className="relative h-[72vh] min-h-[420px] w-full max-w-full overflow-hidden">
        {/* Slides (z-0) */}
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.img}
            alt={s.title}
            className={`absolute inset-0 z-0 block h-full w-full max-w-full object-cover transition-opacity duration-700 will-change-transform ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}

        {/* Soft top gradient (no pointer events, z-10) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent"
        />

        {/* Center content (put above everything else, z-20) */}
        <div className="relative z-20 flex h-full w-full max-w-full items-center justify-center">
          <div className="container-tight text-center text-white min-w-0">
            <p className="text-xs font-semibold tracking-wider uppercase drop-shadow">
              {slides[index].eyebrow}
            </p>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight drop-shadow">
              {slides[index].title}
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/90 drop-shadow">
              {slides[index].subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {slides[index].ctas.map((c) => (
                <CTA key={c.key} href={c.href} variant={c.variant}>
                  {c.label}
                </CTA>
              ))}
            </div>
          </div>
        </div>

        {/* Dots (z-20) */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Prev/Next — make the CONTAINER ignore clicks, only buttons clickable */}
        <div className="absolute inset-y-0 left-0 right-0 z-20 hidden md:flex items-center justify-between px-2 pointer-events-none">
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="pointer-events-auto inline-flex items-center justify-center rounded-full w-11 h-11 bg-black/35 text-white hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="pointer-events-auto inline-flex items-center justify-center rounded-full w-11 h-11 bg-black/35 text-white hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
