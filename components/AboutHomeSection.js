// components/AboutHomeSection.js
"use client";

import Link from "next/link";
import useSiteContent from "@/lib/useSiteContent";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AboutHomeSection() {
  const { getStrict, content } = useSiteContent();
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  // Firestore-managed, already localized via admin panel
  const title = getStrict("home_about_title"); // e.g., "Nuestra misión" / "Our mission"
  const body = getStrict("home_about_body");
  const img = content.home_about_image || "/images/home-about.jpg";

  // Section title (localized with safe fallback)
  const sectionTitle =
    t("about_section_title") || (isEN ? "About us" : "Sobre nosotros");

  // CTA (localized with safe fallback)
  const ctaLabel = t("about_cta") || (isEN ? "About us" : "Sobre nosotros");

  return (
    <section className="container-tight py-10">
      {/* Section heading to clearly label this as the About Us area */}
      <header className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-ink">
          {sectionTitle}
        </h2>
      </header>

      <div className="grid gap-6 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5 md:grid-cols-2">
        <div className="relative">
          <img
            src={img}
            alt={isEN ? "About us" : "Sobre nosotros"}
            className="h-full w-full rounded-xl object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
        </div>

        <div>
          {/* Inner content title from Firestore (use h3 to keep hierarchy clean) */}
          <h3 className="text-2xl font-semibold text-ink">{title}</h3>
          <p className="mt-3 text-ink/80 whitespace-pre-line">{body}</p>

          <div className="mt-5">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
