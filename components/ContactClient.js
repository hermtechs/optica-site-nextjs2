// components/ContactClient.js
"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Phone, Mail, MapPin, Clock, Send, MapPinned } from "lucide-react";
import useSiteContent from "@/lib/useSiteContent"; // ← reads Firestore site/content

// Build a Google Maps EMBED url (no API key) using coordinates or address.
function buildGMapEmbed({ lat, lng, address, locale }) {
  const hl = locale === "en" ? "en" : "es";
  if (
    typeof lat === "number" &&
    !Number.isNaN(lat) &&
    typeof lng === "number" &&
    !Number.isNaN(lng)
  ) {
    // q=lat,lng works without a key for an embedded map
    return `https://www.google.com/maps?hl=${hl}&q=${lat},${lng}&z=15&output=embed`;
  }
  if (address && address.trim()) {
    return `https://www.google.com/maps?hl=${hl}&q=${encodeURIComponent(
      address
    )}&z=15&output=embed`;
  }
  // graceful fallback = Bogotá
  return `https://www.google.com/maps?hl=${hl}&q=Bogot%C3%A1%2C%20Colombia&z=11&output=embed`;
}

// Build a Google “directions” link the user can open in Maps
function buildGDirections({ lat, lng, address }) {
  if (
    typeof lat === "number" &&
    !Number.isNaN(lat) &&
    typeof lng === "number" &&
    !Number.isNaN(lng)
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  if (address && address.trim()) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  }
  return `https://www.google.com/maps`;
}

export default function ContactClient() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  // 🔎 Pull editable contact data from Firestore (set in Admin → Site settings)
  const { content } = useSiteContent();
  const phoneDisplay = content?.contact_phone_display || "(555) 123-4567";
  const phoneE164 = content?.contact_phone || "+15551234567";
  const email = content?.contact_email || "hello@damioptica.com";

  const address =
    (isEN ? content?.contact_address_en : content?.contact_address_es) ||
    "Main Street 24, Suite 3, Medellín, Colombia";

  const hoursHTML =
    (isEN ? content?.contact_hours_html_en : content?.contact_hours_html_es) ||
    (isEN
      ? "Monday to Saturday: 9:00 AM – 6:00 PM<br/>Sunday: Closed"
      : "Lunes a sábado: 9:00 – 18:00<br/>Domingo: Cerrado");

  const latNum =
    typeof content?.contact_lat === "number"
      ? content.contact_lat
      : Number.isFinite(Number(content?.contact_lat))
      ? Number(content?.contact_lat)
      : undefined;

  const lngNum =
    typeof content?.contact_lng === "number"
      ? content.contact_lng
      : Number.isFinite(Number(content?.contact_lng))
      ? Number(content?.contact_lng)
      : undefined;

  const mapSrc = useMemo(
    () => buildGMapEmbed({ lat: latNum, lng: lngNum, address, locale }),
    [latNum, lngNum, address, locale]
  );

  const directionsHref = useMemo(
    () => buildGDirections({ lat: latNum, lng: lngNum, address }),
    [latNum, lngNum, address]
  );

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      isEN ? "Contact from DamiOptica website" : "Contacto desde DamiOptica"
    );
    const body = encodeURIComponent(
      `${t("contact_name")}: ${form.name}\n${t("contact_email")}: ${
        form.email
      }\n\n${t("contact_message")}:\n${form.message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const waHref =
    "https://wa.me/" +
    (phoneE164 || "") +
    "?text=" +
    encodeURIComponent(
      isEN
        ? "Hello! I’d like to get in touch with DamiOptica."
        : "¡Hola! Me gustaría ponerme en contacto con DamiOptica."
    );

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-tight py-14 md:py-20">
          <p className="text-xs font-semibold tracking-wider text-brand uppercase">
            {t("contact_eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-ink">
            {t("contact_title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">{t("contact_subtitle")}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container-tight pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: details */}
          <div className="rounded-2xl border border-white/60 p-6">
            <h2 className="text-lg font-semibold text-ink">
              {t("contact_reach_us")}
            </h2>

            <ul className="mt-4 space-y-4 text-ink/90">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("contact_phone")}</div>
                  <a
                    href={`tel:${phoneE164}`}
                    className="text-brand hover:underline"
                  >
                    {phoneDisplay}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("contact_email_label")}</div>
                  <a
                    href={`mailto:${email}`}
                    className="text-brand hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("contact_visit")}</div>
                  <p>{address}</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("hours")}</div>
                  <p dangerouslySetInnerHTML={{ __html: hoursHTML }} />
                </div>
              </li>
            </ul>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full mt-6 bg-[var(--color-wa,#25D366)] hover:opacity-90"
            >
              {t("eye_cta_contact")}
            </a>
          </div>

          {/* Right: form + Google Map */}
          <div className="lg:col-span-2 grid gap-8">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-white/60 p-6"
            >
              <h2 className="text-lg font-semibold text-ink">
                {t("contact_form_title")}
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-1">
                  <label className="block text-sm text-muted mb-1">
                    {t("contact_name")}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-brand/25 bg-mist px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder={t("contact_name_ph")}
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm text-muted mb-1">
                    {t("contact_email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full rounded-lg border border-brand/25 bg-mist px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-muted mb-1">
                    {t("contact_message")}
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="w-full rounded-lg border border-brand/25 bg-mist px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder={t("contact_message_ph")}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn mt-4 inline-flex items-center gap-2"
              >
                <Send size={16} />
                {t("contact_send")}
              </button>
            </form>

            {/* Google Map embed (no API key) */}
            <div className="rounded-2xl overflow-hidden border border-white/60">
              <iframe
                title={t("contact_map_title")}
                className="w-full h-64 md:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
              />
              <div className="flex items-center justify-end p-3">
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                >
                  <MapPinned size={16} />
                  {isEN ? "Open in Google Maps" : "Abrir en Google Maps"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
