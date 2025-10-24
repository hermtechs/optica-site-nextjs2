// components/AboutClient.js
"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  CheckCircle2,
  Heart,
  Eye,
  Shield,
  Award,
  Stethoscope,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import products from "@/data/products";

export default function AboutClient() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  const values = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: t("about_value_care"),
      desc: t("about_value_care_desc"),
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: t("about_value_vision"),
      desc: t("about_value_vision_desc"),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t("about_value_quality"),
      desc: t("about_value_quality_desc"),
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: t("about_value_experts"),
      desc: t("about_value_experts_desc"),
    },
  ];

  const stats = [
    { label: t("about_stat_years"), value: "10+" },
    { label: t("about_stat_clients"), value: "25k+" },
    { label: t("about_stat_brands"), value: "60+" },
    { label: t("about_stat_rating"), value: "4.9★" },
  ];

  const featuredList = (products?.filter((p) => p?.featured) ?? []).slice(0, 4);
  const fallbackList =
    featuredList.length > 0 ? featuredList : (products ?? []).slice(0, 4);

  // Static WA link (no SSR mismatch)
  const waHref =
    "https://wa.me/?text=" +
    encodeURIComponent(
      isEN
        ? "Hello! I’d like to book an eye exam at DamiOptica."
        : "¡Hola! Me gustaría agendar un examen visual en DamiOptica."
    );

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 via-transparent to-transparent" />
        <div className="container-tight py-16 md:py-24">
          <p className="text-xs font-semibold tracking-wider text-brand uppercase">
            {t("about_eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-ink">
            {t("about_title")}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">{t("about_subtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn">
              {t("about_cta_shop")}
            </Link>
            <Link href="/search?autofocus=1" className="btn-outline">
              {t("about_cta_browse")}
            </Link>
          </div>
        </div>
      </section>

      {/* Story + Stats */}
      <section className="container-tight py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-mist/60 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-ink">
              {t("about_our_story")}
            </h2>
            <p className="mt-3 text-ink/80">{t("about_story_p1")}</p>
            <p className="mt-3 text-ink/80">{t("about_story_p2")}</p>
            <ul className="mt-4 space-y-2 text-ink/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand" />
                <span>{t("about_point_1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand" />
                <span>{t("about_point_2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand" />
                <span>{t("about_point_3")}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/60 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-ink">
              {t("about_in_numbers")}
            </h3>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-mist/50 px-4 py-6 text-center"
                >
                  <div className="text-2xl font-bold text-ink">{s.value}</div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">{t("about_stats_note")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-tight py-10 md:py-14">
        <h2 className="text-xl md:text-2xl font-semibold text-ink">
          {t("about_values_title")}
        </h2>
        <p className="mt-2 max-w-2xl text-muted">{t("about_values_sub")}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/60 p-5 hover:shadow-sm transition"
            >
              <div className="inline-flex items-center justify-center rounded-xl bg-mist w-10 h-10 text-brand">
                {v.icon}
              </div>
              <h3 className="mt-3 font-semibold text-ink">{v.title}</h3>
              <p className="mt-1 text-sm text-ink/80">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eye Tests block (with photo) */}
      <section id="eye-tests" className="container-tight py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative rounded-3xl overflow-hidden bg-mist/60 min-h-[260px]">
            <img
              src="/images/eye-exam.jpg"
              alt={t("eye_img_alt")}
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-transparent"
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-brand uppercase">
              {t("eye_eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink">
              {t("eye_title")}
            </h2>
            <p className="mt-3 text-ink/80">{t("eye_subtitle")}</p>

            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 w-5 h-5 text-brand" />
                <span className="text-ink/90">
                  {t("eye_point_optometrists_desc")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="mt-0.5 w-5 h-5 text-brand" />
                <span className="text-ink/90">
                  {t("eye_point_equipment_desc")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="mt-0.5 w-5 h-5 text-brand" />
                <span className="text-ink/90">
                  {t("eye_point_results_desc")}
                </span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[var(--color-wa,#25D366)] hover:opacity-90"
              >
                {t("eye_cta_book")}
              </a>
              <Link href="/contact" className="btn-outline">
                {t("eye_cta_contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products on About */}
      <section className="container-tight py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-ink">
              {t("featured")}
            </h2>
            <p className="text-sm text-muted">{t("feature_subtitle")}</p>
          </div>
          <Link
            href="/products"
            className="btn-outline self-start sm:self-auto"
          >
            {isEN ? "View all products" : "Ver todos los productos"}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackList.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative bg-mist/60">
        <div className="container-tight py-10 md:py-14">
          <div className="rounded-2xl bg-white border border-white/60 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-ink">
                {t("about_ready_title")}
              </h3>
              <p className="text-sm text-muted">{t("about_ready_sub")}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/products" className="btn">
                {t("about_cta_shop")}
              </Link>
              <Link href="/contact" className="btn-outline">
                {t("about_cta_contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
