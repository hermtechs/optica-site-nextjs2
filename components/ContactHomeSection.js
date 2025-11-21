// components/ContactHomeSection.js
"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import useSiteContent from "@/lib/useSiteContent";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";

/** Build a WA link from Firestore phone + localized default text */
function buildWaHref(content, locale) {
  const digits = (content?.contact_phone || "").replace(/\D+/g, "");
  const text =
    locale === "en"
      ? content?.contact_wa_text_en ||
        "Hello! I’d like to get in touch with DamiOptica."
      : content?.contact_wa_text_es ||
        "¡Hola! Me gustaría ponerme en contacto con DamiOptica.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function ContactHomeSection() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";
  const { content } = useSiteContent();

  // Localized copy for the section header (falls back to i18n strings)
  const eyebrow =
    (isEN ? content?.contact_eyebrow_en : content?.contact_eyebrow_es) ??
    t("contact_eyebrow");
  const title =
    (isEN ? content?.contact_title_en : content?.contact_title_es) ??
    t("contact_title");
  const subtitle =
    (isEN ? content?.contact_subtitle_en : content?.contact_subtitle_es) ??
    t("contact_subtitle");

  // Details pulled from Firestore, localized where applicable
  const phoneDisplay = content?.contact_phone_display || content?.contact_phone;
  const phoneHref = content?.contact_phone
    ? `tel:${content.contact_phone.replace(/\s+/g, "")}`
    : undefined;

  const email = content?.contact_email;
  const emailHref = email ? `mailto:${email}` : undefined;

  const address =
    (isEN ? content?.contact_address_en : content?.contact_address_es) ||
    content?.contact_address ||
    "";

  const hours =
    (isEN ? content?.contact_hours_en : content?.contact_hours_es) ||
    content?.contact_hours ||
    t("hours_val");

  const waHref = buildWaHref(content, locale);

  // Cards (hide empty values)
  const items = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: t("contact_phone"),
      value: phoneDisplay,
      href: phoneHref,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: t("contact_email_label"),
      value: email,
      href: emailHref,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t("contact_visit"),
      value: address,
      href: address ? "/contact" : undefined,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t("hours"),
      value: hours,
    },
  ].filter((it) => Boolean(it.value));

  return (
    <section aria-labelledby="contact-home" className="bg-white">
      <div className="container-tight py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Copy */}
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">
                {eyebrow}
              </p>
            )}
            <h2
              id="contact-home"
              className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-ink/80">{subtitle}</p>}

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
                key={`${it.title}-${it.value}`}
                className="rounded-2xl border border-white/60 p-5"
              >
                <div className="inline-flex items-center justify-center rounded-xl bg-mist w-10 h-10 text-brand">
                  {it.icon}
                </div>
                <div className="mt-2 font-semibold text-ink">{it.title}</div>
                {it.href ? (
                  <a
                    href={it.href}
                    className="mt-0.5 inline-block text-brand hover:underline break-words"
                  >
                    {it.value}
                  </a>
                ) : (
                  <div className="mt-0.5 text-ink/80 break-words">
                    {it.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
