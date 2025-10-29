// app/categories/[slug]/CategoryProductsClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";

export default function CategoryProductsClient({ slug }) {
  const [items, setItems] = useState([]);

  // Turn "gafas-oftalmicas" -> "gafas oftalmicas" for matching
  const normalized = useMemo(
    () => (slug || "").toLowerCase().replace(/-/g, " ").trim(),
    [slug]
  );
  const normalizedDash = useMemo(
    () => (slug || "").toLowerCase().replace(/\s+/g, "-").trim(),
    [slug]
  );

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const filtered = list.filter((p) => {
        const raw = (
          p.category_es ||
          p.category_en ||
          p.category ||
          ""
        ).toLowerCase();
        const asDash = raw.replace(/\s+/g, "-");
        return raw.includes(normalized) || asDash.includes(normalizedDash);
      });

      setItems(filtered);
    });
    return () => unsub();
  }, [normalized, normalizedDash]);

  return (
    <section className="container-tight py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink capitalize">
          {normalized || "Categoría"}
        </h1>
        <p className="text-muted">
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-brand/10 bg-white p-6 text-muted">
          No hay productos en esta categoría todavía.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id || p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
