"use client";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    img: "/hero-banner.jpg", // place in /public or change paths
    eyebrow: "Great Accessories",
    titleLines: ["Modern and", "Timeless Glasses"],
    desc:
      "Purus commodo faucibus fermentum tortor suscipit morbi fringilla ac. " +
      "Egestas tempus fermentum tortor rhoncus pulvinar netus.",
    ctaText: "See more",
    ctaHref: "#",
  },
  {
    img: "/hero-banner2.jpg",
    eyebrow: "Summer Collection",
    titleLines: ["Shades for", "Every Adventure"],
    desc: "Feather-light frames, polarized lenses, all-day comfort.",
    ctaText: "Shop now",
    ctaHref: "#",
  },
  {
    img: "/hero-banner3.jpg",
    eyebrow: "Limited Drop",
    titleLines: ["Retro Frames", "Reimagined"],
    desc: "Classic silhouettes with modern materials and colors.",
    ctaText: "Explore",
    ctaHref: "#",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const len = slides.length;
  const timer = useRef(null);

  const goto = (n) => setI((n + len) % len);
  const next = () => goto(i + 1);
  const prev = () => goto(i - 1);

  useEffect(() => {
    timer.current = setInterval(next, 5500);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <section className="relative">
      {/* Stage */}
      <div className="relative h-[70vh] md:h-[76vh] lg:h-[82vh] overflow-hidden">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={
              "absolute inset-0 transition-opacity duration-700 " +
              (i === idx ? "opacity-100" : "opacity-0")
            }
            aria-hidden={i !== idx}
          >
            {/* Background */}
            <img
              src={s.img}
              alt=""
              className="w-full h-full object-cover z-0"
            />
            {/* Overlays behind navbar */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30 z-0" />
            <div className="absolute left-0 top-0 bottom-0 w-44 md:w-64 bg-gradient-to-r from-black/25 to-transparent z-0" />
          </div>
        ))}

        {/* Content */}
        <div className="absolute inset-0 z-10">
          <div className="container-tight h-full grid place-items-center">
            <div className="text-white text-center text-shadow-lg max-w-2xl">
              <p className="uppercase tracking-[0.18em] text-sm md:text-base font-medium mb-3">
                {slides[i].eyebrow}
              </p>
              <h1 className="font-serif font-bold leading-[1.05] text-4xl md:text-5xl lg:text-6xl mb-4">
                {slides[i].titleLines.map((line, k) => (
                  <span key={k}>
                    {line}
                    {k < slides[i].titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-white/90 text-sm md:text-base mb-6">
                {slides[i].desc}
              </p>
              <div className="flex justify-center">
                <a
                  href={slides[i].ctaHref}
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-white text-ink font-semibold hover:bg-surf transition"
                >
                  {slides[i].ctaText}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-ink rounded-full w-10 h-10 grid place-items-center z-20"
        >
          ←
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-ink rounded-full w-10 h-10 grid place-items-center z-20"
        >
          →
        </button>

        {/* Dots (brand color on active) */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goto(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={
                "h-2.5 rounded-full transition-all " +
                (i === idx
                  ? "w-6 bg-brand"
                  : "w-2.5 bg-white/70 hover:bg-white")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
