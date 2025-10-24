// components/ContactClient.js
"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactClient() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    // Simple mailto fallback (can be swapped for an API later)
    const subject = encodeURIComponent(
      isEN ? "Contact from DamiOptica website" : "Contacto desde DamiOptica"
    );
    const body = encodeURIComponent(
      `${t("contact_name")}: ${form.name}\n${t("contact_email")}: ${
        form.email
      }\n\n${t("contact_message")}:\n${form.message}`
    );
    window.location.href = `mailto:hello@damioptica.com?subject=${subject}&body=${body}`;
  };

  const waHref =
    "https://wa.me/?text=" +
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
                    href="tel:+15551234567"
                    className="text-brand hover:underline"
                  >
                    (555) 123-4567
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("contact_email_label")}</div>
                  <a
                    href="mailto:hello@damioptica.com"
                    className="text-brand hover:underline"
                  >
                    hello@damioptica.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("contact_visit")}</div>
                  <p>Av. Óptica 123, Local 2 — Ciudad Visión</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-brand" />
                <div>
                  <div className="font-medium">{t("hours")}</div>
                  <p>{t("hours_val")}</p>
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

          {/* Right: form + map (span 2 cols) */}
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

            {/* Map (static embed; replace src with your map if you like) */}
            <div className="rounded-2xl overflow-hidden border border-white/60">
              <iframe
                title={t("contact_map_title")}
                className="w-full h-64 md:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.08%2C4.60%2C-74.04%2C4.64&layer=mapnik&marker=4.62%2C-74.06"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
