// app/product/ProductDetailsClient.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { db } from "@/lib/firebaseClient";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import useSiteContent from "@/lib/useSiteContent";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Locale-aware COP (no decimals, always “COP”, not $).
 * EN: COP 12,345
 * ES: COP 12.345
 */
function formatCOPLocalized(value, isEN) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? "");
  try {
    return new Intl.NumberFormat(isEN ? "en-US" : "es-CO", {
      style: "currency",
      currency: "COP",
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    const grouped = Math.round(num).toLocaleString(isEN ? "en-US" : "de-DE");
    return `COP ${grouped}`;
  }
}

function originSafe() {
  if (typeof window === "undefined") return "";
  try {
    return window.location.origin || "";
  } catch {
    return "";
  }
}

function productPermalink(p) {
  const base = originSafe();
  const pid = p?.id ?? p?._id ?? p?.docId ?? p?.documentId;
  const slug = p?.slug?.trim();
  if (pid) return `${base}/product?id=${encodeURIComponent(pid)}`;
  if (slug) return `${base}/product/${encodeURIComponent(slug)}`;
  return base || "#";
}

function waLink(product, phone, isEN) {
  const digits = (phone || "").replace(/\D+/g, "");
  const displayName =
    (isEN ? product?.name_en : product?.name_es) ||
    product?.name ||
    (isEN ? "Unnamed product" : "Producto sin nombre");
  const priceText = formatCOPLocalized(product?.price, isEN);

  const text = encodeURIComponent(
    (isEN
      ? `Hello, I’d like to order this product:\n• ${displayName}\n• ${priceText}`
      : `Hola, quiero pedir este producto:\n• ${displayName}\n• ${priceText}`) +
      `\n${productPermalink(product)}`
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export default function ProductDetailsClient({ id, slug }) {
  const { locale } = useLocale();
  const isEN = locale === "en";
  const router = useRouter();
  const { content } = useSiteContent();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [idx, setIdx] = useState(0);
  const [mainLoaded, setMainLoaded] = useState(false);
  const mainImgRef = useRef(null);

  // Live fetch by id (preferred) or slug
  useEffect(() => {
    let unsub;
    async function run() {
      setLoading(true);
      try {
        if (id) {
          const ref = doc(db, "products", id);
          unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
            else setProduct(null);
            setLoading(false);
          });
          return;
        }
        if (slug) {
          const qy = query(
            collection(db, "products"),
            where("slug", "==", slug),
            limit(1)
          );
          unsub = onSnapshot(qy, (snap) => {
            if (!snap.empty) {
              const d = snap.docs[0];
              setProduct({ id: d.id, ...d.data() });
            } else {
              setProduct(null);
            }
            setLoading(false);
          });
          return;
        }
        setProduct(null);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setProduct(null);
        setLoading(false);
      }
    }
    run();
    return () => unsub?.();
  }, [id, slug]);

  // Localized fields
  const title =
    (isEN ? product?.name_en : product?.name_es) ||
    product?.name_en ||
    product?.name_es ||
    product?.name ||
    "";

  const category =
    (isEN ? product?.category_en : product?.category_es) ||
    product?.category_en ||
    product?.category_es ||
    product?.category ||
    "";

  const longDesc =
    (isEN ? product?.longDesc_en : product?.longDesc_es) ||
    product?.longDesc_en ||
    product?.longDesc_es ||
    product?.longDesc ||
    product?.shortDesc_en ||
    product?.shortDesc_es ||
    product?.shortDesc ||
    "";

  const images = useMemo(() => {
    const g = Array.isArray(product?.gallery) ? product.gallery : [];
    const list = [product?.image, ...g].filter(Boolean);
    return [...new Set(list)];
  }, [product]);

  // Normalize numeric fields
  const discountNum = Number(product?.discount);
  const hasDiscount = Number.isFinite(discountNum) && discountNum > 0;

  const finalPrice = useMemo(() => {
    const base = Number(product?.price);
    if (!Number.isFinite(base)) return product?.price;
    if (!hasDiscount) return base;
    return Math.max(0, Math.round(base * (1 - discountNum / 100)));
  }, [product, hasDiscount, discountNum]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const onKey = (e) => {
      if (!images.length) return;
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  // Reset image loader when changing index
  useEffect(() => {
    setMainLoaded(false);
    // Nice UX on mobile
    mainImgRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [idx]);

  // UI bits
  const badge = (txt, cls) => (
    <span
      className={`rounded-full ${cls} px-2.5 py-1 text-xs font-semibold text-white shadow`}
    >
      {txt}
    </span>
  );

  const phone = content?.contact_phone;
  const wa = product ? waLink(product, phone, isEN) : "#";

  if (loading) {
    return (
      <>
        <SiteNavbar overHero={false} offsetByPromo={false} />
        <main className="container-tight py-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/3] rounded-xl bg-mist animate-pulse" />
            <div className="space-y-4">
              <div className="h-7 w-3/4 rounded bg-mist animate-pulse" />
              <div className="h-5 w-1/2 rounded bg-mist animate-pulse" />
              <div className="h-10 w-40 rounded bg-mist animate-pulse" />
              <div className="h-24 w-full rounded bg-mist animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SiteNavbar overHero={false} offsetByPromo={false} />
        <main className="bg-white">
          <div className="container-tight py-14">
            <h1 className="text-2xl md:text-3xl font-semibold text-ink">
              {isEN ? "Product not found" : "Producto no encontrado"}
            </h1>
            <p className="text-muted mt-2">
              {isEN
                ? "We couldn’t find that item. Maybe the link changed or the product is unavailable."
                : "No pudimos encontrar ese artículo. Tal vez se cambió el enlace o el producto ya no está disponible."}
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/search?autofocus=1" className="btn">
                {isEN ? "View all products" : "Ver todos los productos"}
              </Link>
              <Link href="/" className="btn-outline">
                {isEN ? "Home" : "Inicio"}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />

      <main className="bg-white">
        <div className="container-tight py-8 md:py-12">
          {/* Back / crumbs */}
          <div className="mb-5 flex items-center gap-3 text-sm text-muted">
            <button
              className="inline-flex items-center gap-2 hover:text-ink"
              onClick={() => router.back()}
            >
              <ArrowLeft size={16} />
              {isEN ? "Back" : "Atrás"}
            </button>
            <span className="select-none">•</span>
            {!!category && (
              <Link
                className="hover:text-ink"
                href={`/search?cats=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* LEFT: Gallery */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow">
                {/* Main image */}
                {images.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={mainImgRef}
                      key={images[idx]}
                      src={images[idx]}
                      alt={title}
                      className="aspect-[4/3] w-full object-cover"
                      onLoad={() => setMainLoaded(true)}
                    />
                    {/* Simple loader overlay */}
                    {!mainLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-mist" />
                    )}
                  </>
                ) : (
                  <div className="aspect-[4/3] w-full rounded-2xl bg-mist" />
                )}

                {/* Badges */}
                <div className="absolute left-3 top-3 z-10 flex gap-2">
                  {product.featured &&
                    badge(isEN ? "Featured" : "Destacado", "bg-brand")}
                  {product.isNew &&
                    badge(isEN ? "New" : "Nuevo", "bg-emerald-500")}
                  {hasDiscount &&
                    badge(`-${Number(product.discount)}%`, "bg-rose-500")}
                </div>

                {/* Prev/Next */}
                {images.length > 1 && (
                  <>
                    <button
                      aria-label="Prev"
                      onClick={() =>
                        setIdx((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow ring-1 ring-black/5 hover:bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => setIdx((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow ring-1 ring-black/5 hover:bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src + i}
                      src={src}
                      alt={`${title} ${i + 1}`}
                      className={`h-16 w-20 cursor-pointer rounded-lg object-cover ring-1 transition ${
                        i === idx
                          ? "ring-brand"
                          : "ring-black/5 hover:ring-brand/40"
                      }`}
                      onClick={() => setIdx(i)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info */}
            <div>
              {!!category && (
                <div className="mb-1 text-xs uppercase tracking-wide text-muted">
                  {category}
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-semibold text-ink">
                {title}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-center gap-3">
                <div className="text-2xl font-bold text-ink">
                  {formatCOPLocalized(finalPrice, isEN)}
                </div>
                {hasDiscount && (
                  <div className="text-lg text-muted line-through">
                    {formatCOPLocalized(product.price, isEN)}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
                >
                  <FaWhatsapp size={18} />
                  {isEN ? "Order on WhatsApp" : "Ordenar por WhatsApp"}
                </a>

                <Link
                  href={`/search?cats=${encodeURIComponent(category || "")}`}
                  className="btn-outline"
                >
                  {isEN ? "More in this category" : "Más de esta categoría"}
                </Link>
              </div>

              {/* Description */}
              {!!longDesc && (
                <div className="prose mt-6 max-w-none text-ink">
                  <p className="whitespace-pre-line leading-relaxed">
                    {longDesc}
                  </p>
                </div>
              )}

              {/* Meta / features */}
              {Array.isArray(product?.features) &&
                product.features.length > 0 && (
                  <div className="mt-6 text-sm text-ink">
                    <div className="mb-1 font-medium">
                      {isEN ? "Features" : "Características"}
                    </div>
                    <ul className="list-disc pl-5 text-ink/90">
                      {product.features.map((f, i) => (
                        <li key={i}>
                          {f?.title && (
                            <span className="font-medium">{f.title}: </span>
                          )}
                          <span>{f?.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
