// app/eye-tests/page.js
"use client";

import { FaWhatsapp } from "react-icons/fa";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import useSiteContent from "@/lib/useSiteContent";
import { useLocale } from "@/components/i18n/LocaleProvider";

function waLink(phone, locale, defTextES, defTextEN) {
  const digits = (phone || "").replace(/\D+/g, "");
  const text =
    locale === "en"
      ? defTextEN ||
        "Hello, I’d like to book an eye exam. Do you have availability?"
      : defTextES ||
        "Hola, quiero reservar un examen de la vista. ¿Tienen disponibilidad?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function EyeTestsPage() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";
  const { getStrict, content } = useSiteContent();

  const title = getStrict("eye_title"); // localized from Firestore
  const body = getStrict("eye_body"); // localized from Firestore
  const img = content?.eye_image || "/images/eye-exam.jpg";
  const phone = content?.contact_phone;

  const wurl = waLink(
    phone,
    locale,
    // Optional custom default texts if you want:
    "Hola, quiero reservar un examen de la vista. ¿Tienen disponibilidad?",
    "Hello, I’d like to book an eye exam. Do you have availability?"
  );

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />

      <main className="bg-white">
        <section className="container-tight py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-2 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
            {/* Text */}
            <div className="order-last md:order-first">
              <p className="text-xs font-semibold tracking-wider text-brand uppercase">
                {isEN ? "Eye exams" : "Exámenes de la vista"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">{title}</h1>
              <p className="mt-3 text-ink/80 whitespace-pre-line">{body}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={wurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
                >
                  <FaWhatsapp size={18} />
                  {isEN ? "Book on WhatsApp" : "Reservar por WhatsApp"}
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={img}
                alt={isEN ? "Eye exam" : "Examen de la vista"}
                className="h-full w-full rounded-xl object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
