// components/ProductCard.js
"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLocale } from "@/components/i18n/LocaleProvider";

function computeFinalPrice(product) {
  const price = Number(product?.price ?? 0);
  const pct = Number(product?.discountPct ?? 0);
  if (!isFinite(price) || price <= 0) return { final: 0, hasDiscount: false };
  if (!isFinite(pct) || pct <= 0) return { final: price, hasDiscount: false };
  const final = Math.max(0, price * (1 - pct / 100));
  return { final: Math.round(final * 100) / 100, hasDiscount: true };
}
function isNew(createdAtIso, days = 30) {
  try {
    const created = new Date(createdAtIso).getTime();
    return isFinite(created) && Date.now() - created <= days * 86400000;
  } catch {
    return false;
  }
}

export default function ProductCard({ product }) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const { final, hasDiscount } = useMemo(
    () => computeFinalPrice(product),
    [product]
  );
  const newBadge = isNew(product?.createdAt);

  // Build WhatsApp link on the client to avoid SSR/CSR mismatch
  const [waHref, setWaHref] = useState("#");
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const ref = typeof window !== "undefined" ? window.location.href : "";
    const productUrl = origin
      ? `${origin}/product/${product.slug}`
      : `/product/${product.slug}`;
    const waMsg = encodeURIComponent(
      `Hola, quiero ordenar este producto:\n` +
        `• ${product?.name}\n` +
        `• SKU: ${product?.sku || "N/A"}\n` +
        `• Precio: $${final.toFixed(2)} USD ${
          hasDiscount ? `(descuento ${product.discountPct}% aplicado)` : ""
        }\n` +
        `• Enlace: ${productUrl}\n` +
        (ref ? `Desde: ${ref}` : "")
    );
    setWaHref(`https://wa.me/?text=${waMsg}`);
  }, [product, final, hasDiscount]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white shadow-sm hover:shadow-md transition">
      {/* Media */}
      <Link
        href={`/product/${product.slug}`}
        className="block aspect-[4/3] overflow-hidden bg-mist"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>

      {/* Badges */}
      <div className="absolute left-2 top-2 flex gap-2">
        {newBadge && (
          <span className="rounded-full bg-brand text-white text-xs px-2 py-1 shadow">
            NEW
          </span>
        )}
        {hasDiscount && (
          <span className="rounded-full bg-red-500 text-white text-xs px-2 py-1 shadow">
            -{Number(product.discountPct)}%
          </span>
        )}
        {product?.featured && (
          <span className="rounded-full bg-amber-500 text-white text-xs px-2 py-1 shadow">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="mt-1 text-xs text-muted">{product.category}</p>
          </div>
          <div className="text-right">
            {hasDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-xs line-through text-muted">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-base font-semibold text-ink">
                  ${final.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-semibold text-ink">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-ink/80">
          {expanded ? product.longDesc : product.shortDesc}
        </p>
        {product.longDesc && product.longDesc !== product.shortDesc && (
          <button
            type="button"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                {t("read_less")} <FiChevronUp size={16} />
              </>
            ) : (
              <>
                {t("read_more")} <FiChevronDown size={16} />
              </>
            )}
          </button>
        )}

        {/* CTA */}
        <div className="mt-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (waHref === "#") e.preventDefault();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-wa,#25D366)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <FaWhatsapp size={16} aria-hidden="true" />
            {t("order_whatsapp")}
          </a>
        </div>

        {typeof product.inventory === "number" && (
          <p className="mt-2 text-xs text-muted">
            {product.inventory > 0
              ? `${product.inventory} in stock`
              : "Out of stock"}
          </p>
        )}
      </div>
    </div>
  );
}
