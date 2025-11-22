// components/Footer.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

// Firestore (guarded, one-time fetch for categories)
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, limit } from "firebase/firestore";

// Re-use the site content hook you already have elsewhere
import useSiteContent from "@/lib/useSiteContent";

function slugify(s = "") {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Footer() {
  const { t, locale } = useLocale();
  const isEN = locale === "en";
  const year = new Date().getFullYear();

  // Contact info from Firestore (via your existing hook)
  const { content } = useSiteContent();

  const phoneRaw =
    content?.contact_phone_display ||
    content?.contact_phone ||
    "(555) 123-4567";
  const phoneHref = `tel:${
    (content?.contact_phone || "").replace(/[^\d+]/g, "") || "+15551234567"
  }`;
  const email = content?.contact_email || "hello@damioptica.com";
  const address =
    (isEN ? content?.contact_address_en : content?.contact_address_es) ||
    content?.contact_address ||
    t("address_line");
  const hours =
    (isEN ? content?.contact_hours_en : content?.contact_hours_es) ||
    t("hours_val");

  // Categories (derived from products) – safe fallback when rules block
  const [cats, setCats] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        // Small, cheap read; only used to render a few footer links
        const qSnap = await getDocs(
          query(collection(db, "products"), limit(200))
        );

        const byName = new Map(); // key: display name (localized), value: slug
        qSnap.forEach((doc) => {
          const p = doc.data() || {};
          const display =
            (isEN ? p.category_en : p.category_es) ||
            p.category ||
            (isEN ? "General" : "General");
          const localSlug = slugify(display); // localized slug for the link

          // Only keep the first example we see per display name
          if (display && !byName.has(display)) {
            byName.set(display, localSlug);
          }
        });

        const list = Array.from(byName.entries()).map(([name, key]) => ({
          name,
          key,
        }));

        setCats(list.slice(0, 5)); // show a few
      } catch (err) {
        // Most likely: permission-denied. Fall back silently for production.
        if (process.env.NODE_ENV !== "production") {
          console.warn("Footer categories read failed:", err?.code || err);
        }
        setCats([]); // graceful fallback
      }
    })();
  }, [isEN]); // refetch when language toggles

  const linkBase =
    "text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded";
  const socialBtn =
    "inline-flex items-center justify-center w-9 h-9 rounded-full border border-brand/30 text-brand hover:bg-mist transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

  return (
    <footer className="mt-14 bg-white border-t border-white/60">
      <div className="container-tight py-12 grid gap-10 md:grid-cols-4">
        {/* Brand + blurb + socials */}
        <div className="space-y-4">
          <a href="/" className="text-2xl font-semibold text-ink">
            {t("brand")}
          </a>
          <p className="text-sm text-muted">{t("footer_tagline")}</p>
          <div className="flex items-center gap-2 pt-2">
            <a aria-label="Facebook" href="#" className={socialBtn}>
              <Facebook size={18} />
            </a>
            <a aria-label="Instagram" href="#" className={socialBtn}>
              <Instagram size={18} />
            </a>
            <a aria-label="Twitter/X" href="#" className={socialBtn}>
              <Twitter size={18} />
            </a>
            <a aria-label="YouTube" href="#" className={socialBtn}>
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Shop (dynamic categories + See all) */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">
            {t("footer_shop")}
          </h3>
          <ul className="space-y-2">
            {cats.map((c) => (
              <li key={c.key}>
                {/* Localized link built from the localized name */}
                <Link
                  href={`/categories/${encodeURIComponent(slugify(c.name))}`}
                  className={linkBase}
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/categories" className={linkBase}>
                {isEN ? "See all categories" : "Ver todas las categorías"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care (trimmed as requested) */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">
            {t("footer_care")}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/help/faq" className={linkBase}>
                {t("care_faq")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkBase}>
                {t("care_contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter → Contact Us button */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">
            {t("stay_in_loop")}
          </h3>
          <p className="text-sm text-muted mb-3">{t("newsletter_blurb")}</p>
          <Link href="/contact" className="btn px-4 py-2 inline-flex">
            {isEN ? "Contact us" : "Contáctanos"}
          </Link>
        </div>
      </div>

      {/* Contact row (from Firestore via useSiteContent) */}
      <div className="border-t border-white/60 bg-mist/50">
        <div className="container-tight py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">{t("call_us")}</p>
              <a href={phoneHref} className="text-muted hover:text-brand">
                {phoneRaw}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">{t("email")}</p>
              <a
                href={`mailto:${email}`}
                className="text-muted hover:text-brand"
              >
                {email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">{t("visit")}</p>
              <p className="text-muted">{address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">{t("hours")}</p>
              <p className="text-muted">{hours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal row */}
      <div className="border-t border-white/60">
        <div className="container-tight py-6 text-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            © {year} {t("brand")}. {t("all_rights")}
          </p>
          <nav className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
            >
              {t("legal_privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
            >
              {t("legal_terms")}
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
            >
              {t("legal_cookies")}
            </Link>
            <Link
              href="/accessibility"
              className="text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
            >
              {t("legal_accessibility")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
