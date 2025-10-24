// components/ContactHomeSection.js
"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";

export default function ContactHomeSection() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  // Static WA link (avoids hydration mismatch)
  const waHref =
    "https://wa.me/?text=" +
    encodeURIComponent(
      isEN
        ? "Hello! I’d like to get in touch with DamiOptica."
        : "¡Hola! Me gustaría ponerme en contacto con DamiOptica."
    );

  const items = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: t("contact_phone"),
      value: "(555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: t("contact_email_label"),
      value: "hello@damioptica.com",
      href: "mailto:hello@damioptica.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t("contact_visit"),
      value: "Av. Óptica 123, Local 2 — Ciudad Visión",
      href: "/contact",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t("hours"),
      value: t("hours_val"),
    },
  ];

  return (
    <section aria-labelledby="contact-home" className="bg-white">
      <div className="container-tight py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-brand uppercase">
              {t("contact_eyebrow")}
            </p>
            <h2
              id="contact-home"
              className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink"
            >
              {t("contact_title")}
            </h2>
            <p className="mt-3 text-ink/80">{t("contact_subtitle")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[var(--color-wa,#25D366)] hover:opacity-90"
              >
                {t("eye_cta_contact")}
              </a>
              <Link
                href="/contact"
                className="btn-outline inline-flex items-center gap-1"
              >
                {isEN ? "More contact options" : "Más opciones de contacto"}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-2xl border border-white/60 p-5"
              >
                <div className="inline-flex items-center justify-center rounded-xl bg-mist w-10 h-10 text-brand">
                  {it.icon}
                </div>
                <div className="mt-2 font-semibold text-ink">{it.title}</div>
                {it.href ? (
                  <a
                    href={it.href}
                    className="mt-0.5 inline-block text-brand hover:underline"
                  >
                    {it.value}
                  </a>
                ) : (
                  <div className="mt-0.5 text-ink/80">{it.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
