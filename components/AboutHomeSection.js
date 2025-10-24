// components/AboutHomeSection.js
"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Award, Heart, Eye } from "lucide-react";

export default function AboutHomeSection() {
  const { t } = useLocale();

  const points = [
    { icon: <Heart className="w-5 h-5" />, title: t("about_point_1") },
    { icon: <Eye className="w-5 h-5" />, title: t("about_point_2") },
    { icon: <Award className="w-5 h-5" />, title: t("about_point_3") },
  ];

  return (
    <section aria-labelledby="about-home" className="bg-white">
      <div className="container-tight py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Copy column */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-brand uppercase">
              {t("about_eyebrow")}
            </p>
            <h2
              id="about-home"
              className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink"
            >
              {t("about_title")}
            </h2>
            <p className="mt-3 text-ink/80">{t("about_subtitle")}</p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {points.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-white/60 p-3"
                >
                  <span className="inline-flex items-center justify-center rounded-xl bg-mist text-brand w-9 h-9">
                    {p.icon}
                  </span>
                  <span className="text-ink/90">{p.title}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn">
                {t("about_cta_browse")}
              </Link>
              <Link href="/products" className="btn-outline">
                {t("about_cta_shop")}
              </Link>
            </div>
          </div>

          {/* Image / visual */}
          <div className="relative rounded-3xl overflow-hidden bg-mist/60 min-h-[260px]">
            <img
              src="/images/team-optica.jpg"
              alt="DamiOptica team"
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
