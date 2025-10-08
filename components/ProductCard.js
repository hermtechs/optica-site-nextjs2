"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa"; // icon inside the main button

function buildWhatsAppHref({ phone, product, siteOrigin }) {
  const productUrl = `${siteOrigin}/product/${product.slug}`;
  const lines = [
    `Hi! I'd like to order: ${product.name}`,
    product.price != null ? `Price: $${product.price}` : null,
    product.shortDesc ? `Details: ${product.shortDesc}` : null,
    `Link: ${productUrl}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${text}`;
}

export default function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);

  // env fallbacks for local dev
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15551234567";
  const siteOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const waHref = useMemo(
    () => buildWhatsAppHref({ phone, product, siteOrigin }),
    [phone, product, siteOrigin]
  );

  const snippet = product.shortDesc || "";
  const more = product.longDesc || "";
  const collapsedText =
    snippet.length > 140 ? snippet.slice(0, 140) + "…" : snippet;
  const showReadToggle = more || snippet.length > 140;

  return (
    <article className="flex flex-col gap-3">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-md border border-white/60 bg-white shadow-card"
      >
        <div className="aspect-[4/3] grid place-items-center bg-mist/60">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Title + price + WhatsApp CTA */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/product/${product.slug}`}
            className="font-medium text-ink hover:underline"
          >
            {product.name}
          </Link>
          {product.price != null && (
            <p className="text-sm text-muted mt-1">${product.price}</p>
          )}
        </div>

        {/* Single primary WhatsApp button */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white bg-wa hover:bg-[#1DA851] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
          onClick={(e) => {
            if (!phone) {
              e.preventDefault();
              alert("WhatsApp number not set.");
            }
          }}
        >
          <FaWhatsapp size={16} />
          <span>Order on WhatsApp</span>
        </a>
      </div>

      {/* Description with read more/less */}
      {(snippet || more) && (
        <div className="text-sm text-muted">
          {expanded ? (
            <>
              {snippet}
              {more ? <> {more}</> : null}
            </>
          ) : (
            <>{collapsedText}</>
          )}

          {showReadToggle && (
            <button
              type="button"
              className="ml-2 font-medium text-brand hover:underline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
