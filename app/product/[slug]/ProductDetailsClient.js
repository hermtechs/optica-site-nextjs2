// app/product/[slug]/ProductDetailsClient.js
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import PromoBar from "@/components/PromoBar";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FiWhatsapp } from "react-icons/fi";

const DEFAULT_WA = process.env.NEXT_PUBLIC_WA_NUMBER || "573001112233";

function formatCOP(n) {
  if (typeof n !== "number") return n ?? "";
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `COP ${Math.round(n).toLocaleString("es-CO")}`;
  }
}

export default function ProductDetailsClient({ slug }) {
  const { locale, t } = useLocale();
  const [promoVisible, setPromoVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // live subscribe to product by slug
  useEffect(() => {
    if (!slug) return;
    const qref = query(
      collection(db, "products"),
      where("slug", "==", slug),
      limit(1)
    );
    const unsub = onSnapshot(qref, (snap) => {
      const doc = snap.docs[0];
      setProduct(doc ? { id: doc.id, ...doc.data() } : null);
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  const name =
    (locale === "es" ? product?.name_es : product?.name_en) ||
    product?.name ||
    "";
  const short =
    (locale === "es" ? product?.shortDesc_es : product?.shortDesc_en) ||
    product?.shortDesc ||
    "";
  const long =
    (locale === "es" ? product?.longDesc_es : product?.longDesc_en) ||
    product?.longDesc ||
    "";

  const gallery = Array.isArray(product?.gallery) ? product.gallery : [];
  const price = product?.price;
  const hasDiscount =
    typeof product?.discount === "number" && product.discount > 0;

  const finalPrice = useMemo(() => {
    if (!hasDiscount) return price;
    return Math.max(
      0,
      Math.round((price || 0) * (1 - (product.discount || 0) / 100))
    );
  }, [hasDiscount, price, product?.discount]);

  const waHref = useMemo(() => {
    if (!product) return "#";
    const phone = (product.whatsapp || DEFAULT_WA).replace(/[^\d]/g, "");
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://damioptica.com";
    const link = `${base}/product/${encodeURIComponent(slug)}`;
    const msg =
      locale === "es"
        ? `Hola, quiero ordenar este producto: ${name} ${
            price ? `(${formatCOP(finalPrice ?? price)})` : ""
          }. Enlace: ${link}`
        : `Hello, I want to order this product: ${name} ${
            price ? `(${formatCOP(finalPrice ?? price)})` : ""
          }. Link: ${link}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [product, slug, name, price, finalPrice, locale]);

  return (
    <>
      <Suspense fallback={null}>
        {promoVisible && <PromoBar onClose={() => setPromoVisible(false)} />}
        <SiteNavbar overHero={false} offsetByPromo={promoVisible} />
      </Suspense>

      <main className="bg-white">
        <div className="container-tight py-10">
          {loading ? (
            <div className="rounded-xl border border-brand/10 bg-white p-6 text-muted">
              {locale === "es" ? "Cargando…" : "Loading…"}
            </div>
          ) : !product ? (
            <div className="rounded-xl border border-brand/10 bg-white p-6">
              <h1 className="text-xl font-semibold text-ink mb-2">
                {locale === "es"
                  ? "Producto no encontrado"
                  : "Product not found"}
              </h1>
              <p className="text-muted">
                {locale === "es"
                  ? "Es posible que el producto haya sido movido o eliminado."
                  : "The product may have been moved or removed."}
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/products" className="btn">
                  {locale === "es"
                    ? "Ver todos los productos"
                    : "Browse all products"}
                </Link>
                <Link href="/" className="btn-outline">
                  {locale === "es" ? "Inicio" : "Home"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Gallery */}
              <div>
                <div className="overflow-hidden rounded-xl ring-1 ring-black/5 bg-surf">
                  <img
                    src={gallery[0] || product.image}
                    alt={name}
                    className="w-full object-contain"
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {gallery.slice(1, 5).map((g, i) => (
                      <div
                        key={g + i}
                        className="overflow-hidden rounded-lg ring-1 ring-black/5 bg-white"
                      >
                        <img
                          src={g}
                          alt={`${name} ${i + 2}`}
                          className="w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-ink">
                  {name}
                </h1>
                {product?.category && (
                  <div className="mt-1 text-sm text-muted">
                    {product.category}
                  </div>
                )}

                {/* Price */}
                <div className="mt-4 flex items-end gap-3">
                  <div className="text-2xl font-bold text-ink">
                    {formatCOP(finalPrice ?? price)}
                  </div>
                  {hasDiscount && (
                    <>
                      <div className="text-base text-muted line-through">
                        {formatCOP(price)}
                      </div>
                      <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Short / Long */}
                {short && <p className="mt-4 text-sm text-ink/90">{short}</p>}
                {long && <p className="mt-2 text-sm text-muted">{long}</p>}

                {/* WhatsApp CTA */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
                  >
                    <FiWhatsapp size={18} />
                    {t("order_whatsapp") || "Order on WhatsApp"}
                  </a>

                  <Link href="/products" className="btn-outline">
                    {locale === "es" ? "Seguir comprando" : "Continue shopping"}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
