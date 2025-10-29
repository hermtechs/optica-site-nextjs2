// app/categories/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";

function slugify(s) {
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CategoriesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const cats = useMemo(() => {
    const map = new Map();
    for (const p of items) {
      const label = p.category_es || p.category_en || p.category || "General";
      const key = p.categoryKey || slugify(label);
      if (!map.has(key))
        map.set(key, { key, label, count: 0, sample: p.image });
      const obj = map.get(key);
      obj.count += 1;
      if (!obj.sample && p.image) obj.sample = p.image;
    }
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [items]);

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-10">
        <h1 className="mb-6 text-2xl font-semibold text-ink">Categorías</h1>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cats.map((c) => (
            <Link
              key={c.key}
              href={`/categories/${c.key}`}
              className="group overflow-hidden rounded-xl bg-white shadow ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {c.sample ? (
                  <img
                    src={c.sample}
                    alt={c.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-mist text-muted">
                    {c.label}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-ink">{c.label}</div>
                <div className="text-sm text-muted">{c.count} producto(s)</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
