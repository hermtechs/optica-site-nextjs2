// components/EyeTestSection.js
"use client";

import Link from "next/link";
import { Stethoscope, ShieldCheck, Clock, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function EyeTestSection() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  // Static WhatsApp link (no SSR mismatch)
  const waHref =
    "https://wa.me/?text=" +
    encodeURIComponent(
      isEN
        ? "Hello! I’d like to book an eye exam at DamiOptica."
        : "¡Hola! Me gustaría agendar un examen visual en DamiOptica."
    );

  const features = [
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: t("eye_point_optometrists"),
      desc: t("eye_point_optometrists_desc"),
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: t("eye_point_equipment"),
      desc: t("eye_point_equipment_desc"),
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t("eye_point_results"),
      desc: t("eye_point_results_desc"),
    },
  ];

  return (
    <section aria-labelledby="eye-tests" className="bg-white">
      <div className="container-tight py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-brand uppercase">
              {t("eye_eyebrow")}
            </p>
            <h2
              id="eye-tests"
              className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink"
            >
              {t("eye_title")}
            </h2>
            <p className="mt-3 text-ink/80">{t("eye_subtitle")}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/60 p-4"
                >
                  <div className="inline-flex items-center justify-center rounded-xl bg-mist w-10 h-10 text-brand">
                    {f.icon}
                  </div>
                  <h3 className="mt-2 font-semibold text-ink">{f.title}</h3>
                  <p className="text-sm text-ink/80">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn bg-[var(--color-wa,#25D366)] hover:opacity-90"
              >
                {t("eye_cta_book")}
              </a>
              <Link
                href="/about#eye-tests"
                className="btn-outline inline-flex items-center gap-1"
              >
                {t("eye_cta_more")}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Image (optional) */}
          <div className="relative rounded-3xl overflow-hidden bg-mist/60 min-h-[260px]">
            <img
              src="/images/eye-exam.jpg"
              alt={t("eye_img_alt")}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              loading="lazy"
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
