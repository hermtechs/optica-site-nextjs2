// components/HeroCarousel.js
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const SLIDES = [
  {
    id: 1,
    img: "/hero-banner.jpg",
    eyebrow: "Nueva temporada",
    title: "Monturas ligeras, visión clara",
    subtitle: "Comodidad diaria con estilo minimalista.",
    ctas: [
      { href: "/products", label: "Comprar ahora", variant: "primary" },
      {
        href: "/search?cats=Sunglasses",
        label: "Ver gafas de sol",
        variant: "secondary",
      },
    ],
  },
  {
    id: 2,
    img: "/hero-banner2.jpg",
    eyebrow: "Edición azul",
    title: "Protección luz azul, menos fatiga",
    subtitle: "Trabaja y juega con mayor comodidad visual.",
    ctas: [
      {
        href: "/products?cats=Blue-Light%20Glasses",
        label: "Luz azul",
        variant: "primary",
      },
      { href: "/search", label: "Explorar todo", variant: "secondary" },
    ],
  },
  {
    id: 3,
    img: "/hero-banner3.jpg",
    eyebrow: "Sol & ciudad",
    title: "Sunglasses con tratamiento UV400",
    subtitle: "Bloqueo confiable. Estilos para cada día.",
    ctas: [
      {
        href: "/products?cats=Sunglasses",
        label: "Sunglasses",
        variant: "primary",
      },
      { href: "/about", label: "Conócenos", variant: "secondary" },
    ],
  },
];

function CTA({ href, children, variant = "primary" }) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2";
  return variant === "secondary" ? (
    <Link
      href={href}
      className={`${base} btn-outline bg-white/10 border-white/60 text-white hover:bg-white/20 focus-visible:ring-white/60`}
    >
      {children}
    </Link>
  ) : (
    <Link
      href={href}
      className={`${base} bg-brand text-white hover:opacity-90 focus-visible:ring-brand/40`}
    >
      {children}
    </Link>
  );
}

export default function HeroCarousel() {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const count = SLIDES.length;

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(timer.current);
  }, [count, locale]);

  const go = (d) => setIndex((i) => (i + d + count) % count);

  return (
    <section className="relative overflow-x-hidden">
      {" "}
      {/* clamp any stray horizontal pixels */}
      <div className="relative h-[72vh] min-h-[420px] w-full max-w-full overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <img
            key={s.id}
            src={s.img}
            alt={s.title}
            className={`absolute inset-0 block h-full w-full max-w-full object-cover transition-opacity duration-700 will-change-transform ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}

        {/* Soft top gradient (behind navbar) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-transparent"
        />

        {/* Center content */}
        <div className="relative z-10 flex h-full w-full max-w-full items-center justify-center">
          <div className="container-tight text-center text-white min-w-0">
            {" "}
            {/* min-w-0 prevents children from forcing width */}
            <p className="text-xs font-semibold tracking-wider uppercase drop-shadow">
              {SLIDES[index].eyebrow}
            </p>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight drop-shadow">
              {SLIDES[index].title}
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/90 drop-shadow">
              {SLIDES[index].subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {SLIDES[index].ctas.map((c) => (
                <CTA key={c.href} href={c.href} variant={c.variant}>
                  {c.label}
                </CTA>
              ))}
            </div>
          </div>
        </div>

        {/* Dots (centered, no overflow) */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
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

        {/* Prev/Next — hidden on mobile */}
        <div className="absolute inset-y-0 left-0 right-0 z-10 hidden md:flex items-center justify-between px-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="inline-flex items-center justify-center rounded-full w-11 h-11 bg-black/35 text-white hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="inline-flex items-center justify-center rounded-full w-11 h-11 bg-black/35 text-white hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
