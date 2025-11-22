// components/ProductCard.js
"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useMemo } from "react";
import useSiteContent from "@/lib/useSiteContent";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Format COP with locale-aware thousands separators:
 *  - EN:  1,234
 *  - ES:  1.234
 *  Always show currency as "COP" (not $), no decimals.
 */
function formatCOPLocalized(value, isEN) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? "");
  try {
    return new Intl.NumberFormat(isEN ? "en-US" : "es-CO", {
      style: "currency",
      currency: "COP",
      currencyDisplay: "code", // "COP 12,345" / "COP 12.345"
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    // Fallback: simple grouping
    const grouped = Math.round(num).toLocaleString(isEN ? "en-US" : "de-DE"); // de-DE gives dot grouping
    return `COP ${grouped}`;
  }
}

// Prefer ID route; fallback to slug route; absolute URL for WA message
function getProductUrl(product) {
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "";
  const pid =
    product?.id ?? product?._id ?? product?.docId ?? product?.documentId;
  const slug = product?.slug?.trim();

  if (pid) return `${origin}/product?id=${encodeURIComponent(pid)}`;
  if (slug) return `${origin}/product/${encodeURIComponent(slug)}`;
  return origin || "#";
}

function waLink(product, phone, isEN) {
  const digits = (phone || "").replace(/\D+/g, "");
  const displayName =
    (isEN ? product?.name_en : product?.name_es) ||
    product?.name ||
    (isEN ? "Unnamed product" : "Producto sin nombre");

  const priceText = formatCOPLocalized(product?.price, isEN);

  const baseText = isEN
    ? `Hello, I’d like to order this product:\n• ${displayName}\n• ${priceText}`
    : `Hola, quiero pedir este producto:\n• ${displayName}\n• ${priceText}`;

  const text = encodeURIComponent(`${baseText}\n${getProductUrl(product)}`);
  return `https://wa.me/${digits}?text=${text}`;
}

export default function ProductCard({ product }) {
  const { content } = useSiteContent();
  const { locale, t } = useLocale();
  const isEN = locale === "en";

  const rawDiscount = Number(product?.discount);
  const hasDiscount = Number.isFinite(rawDiscount) && rawDiscount > 0;
  const isFeatured = product?.featured === true;
  const isNew = product?.isNew === true;

  const { finalPrice, origPrice } = useMemo(() => {
    const base = Number(product?.price);
    const safeBase = Number.isFinite(base) ? base : undefined;
    if (!hasDiscount || !Number.isFinite(safeBase)) {
      return { finalPrice: safeBase, origPrice: safeBase };
    }
    const discounted = Math.max(
      0,
      Math.round(safeBase * (1 - rawDiscount / 100))
    );
    return { finalPrice: discounted, origPrice: safeBase };
  }, [product?.price, hasDiscount, rawDiscount]);

  // Localized name & category
  const name =
    (isEN ? product?.name_en : product?.name_es) ||
    product?.name ||
    (isEN ? "Unnamed product" : "Producto sin nombre");

  const category =
    (isEN ? product?.category_en : product?.category_es) ||
    product?.category ||
    "";

  // Prefer routing by id; fall back to slug
  const pid =
    product?.id ?? product?._id ?? product?.docId ?? product?.documentId;
  const slug = product?.slug?.trim();
  const detailsHref = pid
    ? `/product?id=${encodeURIComponent(pid)}`
    : slug
    ? `/product/${encodeURIComponent(slug)}`
    : "#";

  const cardDisabled = !pid && !slug;
  const wa = waLink(product, content?.contact_phone, isEN);

  // UI labels
  const orderLabel =
    t("order_whatsapp") ||
    (isEN ? "Order on WhatsApp" : "Ordenar por WhatsApp");
  const detailsLabel = isEN ? "View details" : "Ver detalles";
  const featuredLabel = isEN ? "Featured" : "Destacado";
  const newLabel = isEN ? "New" : "Nuevo";

  return (
    <div
      className="
        group relative overflow-hidden rounded-xl bg-white
        shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5
        transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.10)]
      "
    >
      {/* Image (photo-first) */}
      {cardDisabled ? (
        <div className="relative block">
          <div className="relative aspect-[4/3] overflow-hidden">
            {(isFeatured || isNew || hasDiscount) && (
              <div className="absolute left-3 top-3 z-10 flex gap-2">
                {isFeatured && (
                  <span className="rounded-full bg-brand px-2 py-1 text-xs font-semibold text-white shadow">
                    {featuredLabel}
                  </span>
                )}
                {isNew && (
                  <span className="rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white shadow">
                    {newLabel}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white shadow">
                    -{rawDiscount}%
                  </span>
                )}
              </div>
            )}
            <img
              src={product?.image}
              alt={name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <Link href={detailsHref} className="relative block">
          <div className="relative aspect-[4/3] overflow-hidden">
            {(isFeatured || isNew || hasDiscount) && (
              <div className="absolute left-3 top-3 z-10 flex gap-2">
                {isFeatured && (
                  <span className="rounded-full bg-brand px-2 py-1 text-xs font-semibold text-white shadow">
                    {featuredLabel}
                  </span>
                )}
                {isNew && (
                  <span className="rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white shadow">
                    {newLabel}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white shadow">
                    -{rawDiscount}%
                  </span>
                )}
              </div>
            )}
            <img
              src={product?.image}
              alt={name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      {/* Minimal content under photo */}
      <div className="p-4">
        {!!category && (
          <div className="mb-1 text-xs uppercase tracking-wide text-muted">
            {category}
          </div>
        )}
        <div className="line-clamp-1 text-lg font-semibold text-ink">
          {name}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-base font-bold text-ink">
            {formatCOPLocalized(finalPrice, isEN)}
          </div>
          {hasDiscount && (
            <div className="text-sm text-muted line-through">
              {formatCOPLocalized(origPrice, isEN)}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2
              text-sm font-semibold text-white shadow-sm transition
              hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50
            "
          >
            <FaWhatsapp size={16} />
            <span>{orderLabel}</span>
          </a>

          {!cardDisabled && (
            <Link
              href={detailsHref}
              className="ml-auto text-sm font-medium text-brand hover:underline"
            >
              {detailsLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
