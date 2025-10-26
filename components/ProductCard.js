// components/ProductCard.js
"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FaWhatsapp } from "react-icons/fa";

function useText(product) {
  const { locale, t } = useLocale();
  const lang = (locale || "es").startsWith("en") ? "en" : "es";
  const name = product[`name_${lang}`] || "";
  const shortDesc = product[`shortDesc_${lang}`] || "";
  const category = product[`category_${lang}`] || "";
  return { t, lang, name, shortDesc, category };
}

export default function ProductCard({ product }) {
  const { t, lang, name, shortDesc } = useText(product);
  const price = Number(product.price || 0);

  const waText = encodeURIComponent(
    `${name}\n${shortDesc ? shortDesc + "\n" : ""}Price: $${price.toFixed(
      2
    )}\nLink: ${
      typeof window !== "undefined" ? window.location.origin : ""
    }/product/${product.slug}`
  );
  const waHref = `https://wa.me/?text=${waText}`;

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
        {product.image ? (
          <img
            src={product.image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-ink font-medium line-clamp-1">{name}</h3>
          {product.discount ? (
            <span className="text-xs rounded bg-red-50 text-red-700 px-2 py-0.5">
              -{product.discount}%
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-ink/70 line-clamp-2">{shortDesc}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-ink font-semibold">${price.toFixed(2)}</div>

          <a
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-[#25D366] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#25D366]/40"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            {t("order_whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
