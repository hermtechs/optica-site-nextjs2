// app/product/[slug]/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

function formatCOP(n) {
  if (typeof n !== "number") return n;
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

function waLink(p) {
  const base = "https://wa.me/";
  const text = encodeURIComponent(
    `Hola, quiero este producto:\n• ${
      p.name_es || p.name_en || p.name
    }\n• ${formatCOP(p.price)}\n${
      typeof window !== "undefined" ? window.location.href : ""
    }`
  );
  return `${base}?text=${text}`;
}

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const qy = query(collection(db, "products"), where("slug", "==", slug));
    const unsub = onSnapshot(qy, (snap) => {
      const doc = snap.docs[0]?.data();
      setProduct(doc || null);
      setReady(true);
    });
    return () => unsub();
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const g = Array.isArray(product.gallery) ? product.gallery : [];
    // Ensure main image at least
    return g.length ? g : product.image ? [product.image] : [];
  }, [product]);

  const hasDiscount =
    product && typeof product.discount === "number" && product.discount > 0;

  const finalPrice = useMemo(() => {
    if (!product) return null;
    if (!hasDiscount) return product.price;
    return Math.max(
      0,
      Math.round(product.price * (1 - product.discount / 100))
    );
  }, [product, hasDiscount]);

  if (!ready) {
    return (
      <>
        <SiteNavbar overHero={false} offsetByPromo={false} />
        <main className="container-tight py-10">
          <div className="h-64 animate-pulse rounded-2xl bg-mist" />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SiteNavbar overHero={false} offsetByPromo={false} />
        <main className="container-tight py-10">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
            <h1 className="text-xl font-semibold text-ink">
              Producto no encontrado
            </h1>
            <p className="mt-2 text-muted">
              Este producto no existe o fue removido.
            </p>
            <div className="mt-4">
              <Link href="/products" className="text-brand underline">
                Ver todos los productos
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const name =
    product.name_es || product.name_en || product.name || "Producto sin nombre";
  const category =
    product.category_es || product.category_en || product.category || "";

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={gallery[active]}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`overflow-hidden rounded-lg ring-2 ${
                      active === i ? "ring-brand" : "ring-transparent"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-16 w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
              <div className="text-xs uppercase tracking-wide text-muted">
                {category}
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-ink">{name}</h1>

              <div className="mt-3 flex items-center gap-2">
                <div className="text-2xl font-bold text-ink">
                  {formatCOP(finalPrice)}
                </div>
                {hasDiscount && (
                  <div className="text-base text-muted line-through">
                    {formatCOP(product.price)}
                  </div>
                )}
                {hasDiscount && (
                  <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Short / long */}
              {product.shortDesc_es ||
              product.shortDesc_en ||
              product.shortDesc ? (
                <p className="mt-4 text-ink/80">
                  {product.shortDesc_es ||
                    product.shortDesc_en ||
                    product.shortDesc}
                </p>
              ) : null}

              {product.longDesc_es ||
              product.longDesc_en ||
              product.longDesc ? (
                <p className="mt-3 text-ink/70 whitespace-pre-line">
                  {product.longDesc_es ||
                    product.longDesc_en ||
                    product.longDesc}
                </p>
              ) : null}

              {/* Features */}
              {Array.isArray(product.features) &&
                product.features.length > 0 && (
                  <div className="mt-5 grid gap-2">
                    <div className="text-sm font-semibold text-ink">
                      Detalles
                    </div>
                    <ul className="grid gap-1 text-ink/80">
                      {product.features.map((f, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium">{f.title}:</span>{" "}
                          <span>{f.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Colors */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="text-sm font-semibold text-ink">Colores</div>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((c, i) => (
                      <span
                        key={i}
                        className="h-6 w-6 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={waLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
                >
                  <FaWhatsapp size={18} />
                  Pedir por WhatsApp
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-mist px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gray-200"
                >
                  Volver a productos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related (very simple: show a few images if gallery > 1) */}
        {gallery.length > 1 && (
          <section className="mt-10">
            <h3 className="mb-3 text-lg font-semibold text-ink">Más fotos</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-56 w-full rounded-xl object-cover shadow ring-1 ring-black/5"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
