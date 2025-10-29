// components/admin/ProductsManager.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { db, storage } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProductCard from "@/components/ProductCard";

const empty = {
  slug: "",
  name: "",
  price: 0,
  image: "",
  category: "",
  category_es: "",
  category_en: "",
  name_es: "",
  name_en: "",
  shortDesc: "",
  longDesc: "",
  shortDesc_es: "",
  longDesc_es: "",
  shortDesc_en: "",
  longDesc_en: "",
  gallery: [],
  colors: ["#111827", "#6b7280", "#d1d5db"],
  features: [{ title: "Frame", desc: "Light, durable build." }],
  featured: false,
  isNew: false,
  discount: null,
  discountEnd: null,
  categoryKey: "",
};

const inputCls =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

function slugify(s) {
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProductsManager() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  // live list
  useEffect(() => {
    const colRef = collection(db, "products");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    items.forEach((p) => {
      if (p.category_es) set.add(p.category_es);
      if (p.category_en) set.add(p.category_en);
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((p) => {
      const hay =
        (p.name || "") +
        " " +
        (p.name_es || "") +
        " " +
        (p.name_en || "") +
        " " +
        (p.category || "") +
        " " +
        (p.category_es || "") +
        " " +
        (p.category_en || "") +
        " " +
        (p.shortDesc || "") +
        " " +
        (p.shortDesc_es || "") +
        " " +
        (p.shortDesc_en || "");
      return hay.toLowerCase().includes(n);
    });
  }, [items, q]);

  async function uploadToStorage(file) {
    const key = `products/${Date.now()}-${file.name}`;
    const r = ref(storage, key);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = {
        ...form,
        price: Number(form.price) || 0,
        createdAt: form.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      // Compute categoryKey (prefer ES, then EN, then generic)
      const label = data.category_es || data.category_en || data.category || "";
      data.categoryKey = slugify(label);
      data.gallery = (data.gallery || []).filter(Boolean);

      if (!data.slug) throw new Error("Slug is required.");
      if (!data.name && !data.name_es && !data.name_en)
        throw new Error(
          "At least one name (name, name_es, or name_en) is required."
        );

      if (editing?.id) {
        await updateDoc(doc(db, "products", editing.id), data);
      } else {
        await addDoc(collection(db, "products"), data);
      }
      setForm(empty);
      setEditing(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
  }

  return (
    <div className="grid gap-6">
      {/* Controls (section color A) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className={inputCls}
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button
            className="btn"
            onClick={() => {
              setForm(empty);
              setEditing(null);
            }}
          >
            New product
          </button>
        </div>
      </div>

      {/* Editor (section color B - very light tint via ring only) */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm grid gap-4"
      >
        <h3 className="text-lg font-semibold text-ink">
          {editing?.id ? "Edit product" : "Create product"}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Slug (unique)
            </label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Price (COP)
            </label>
            <input
              type="number"
              step="1"
              className={inputCls}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">Name (ES)</label>
            <input
              className={inputCls}
              value={form.name_es}
              onChange={(e) => setForm({ ...form, name_es: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">Name (EN)</label>
            <input
              className={inputCls}
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Category (ES)
            </label>
            <input
              list="cats"
              className={inputCls}
              value={form.category_es}
              onChange={(e) =>
                setForm({ ...form, category_es: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Category (EN)
            </label>
            <input
              list="cats"
              className={inputCls}
              value={form.category_en}
              onChange={(e) =>
                setForm({ ...form, category_en: e.target.value })
              }
            />
          </div>
        </div>

        <datalist id="cats">
          {categoryOptions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Short description (ES)
          </label>
          <textarea
            rows={2}
            className={inputCls}
            value={form.shortDesc_es}
            onChange={(e) => setForm({ ...form, shortDesc_es: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Short description (EN)
          </label>
          <textarea
            rows={2}
            className={inputCls}
            value={form.shortDesc_en}
            onChange={(e) => setForm({ ...form, shortDesc_en: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Long description (ES)
          </label>
          <textarea
            rows={4}
            className={inputCls}
            value={form.longDesc_es}
            onChange={(e) => setForm({ ...form, longDesc_es: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            Long description (EN)
          </label>
          <textarea
            rows={4}
            className={inputCls}
            value={form.longDesc_en}
            onChange={(e) => setForm({ ...form, longDesc_en: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Main image (section color C - same but visual separation via border) */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm font-medium mb-2">Main image</div>
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="mb-2 h-40 w-full rounded-lg border border-gray-200 object-cover"
              />
            )}
            <div className="flex gap-2">
              <input
                type="url"
                className={`${inputCls} flex-1`}
                placeholder="https://… or /glasses/round-gold.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <label className="btn-outline cursor-pointer shrink-0">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadToStorage(file);
                    setForm((f) => ({ ...f, image: url }));
                  }}
                />
              </label>
            </div>
          </div>

          {/* Gallery */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm font-medium mb-2">
              Gallery (comma separated or upload)
            </div>
            <textarea
              rows={3}
              className={inputCls}
              placeholder="/glasses/round-gold.jpg, https://…"
              value={(form.gallery || []).join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  gallery: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
            <label className="btn-outline mt-2 inline-block cursor-pointer">
              Upload images
              <input
                multiple
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  const urls = [];
                  for (const f of files) urls.push(await uploadToStorage(f));
                  setForm((f) => ({
                    ...f,
                    gallery: [...(f.gallery || []), ...urls],
                  }));
                }}
              />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <span className="text-ink/90">Featured</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
            />
            <span className="text-ink/90">New</span>
          </label>

          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              step="1"
              className={inputCls}
              value={form.discount ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, discount: v === "" ? null : Number(v) });
              }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/80 mb-1">
              Discount ends (optional)
            </label>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.discountEnd ?? ""}
              onChange={(e) =>
                setForm({ ...form, discountEnd: e.target.value || null })
              }
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={busy}
            type="submit"
          >
            {editing?.id ? "Save changes" : "Create product"}
          </button>
          {editing?.id && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List (section color A again) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-muted mb-2">
          {filtered.length} product(s)
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-xs">
                {p.featured && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-brand ring-1 ring-brand/20">
                    Featured
                  </span>
                )}
                {p.isNew && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
                    New
                  </span>
                )}
                {typeof p.discount === "number" && p.discount > 0 && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700 ring-1 ring-rose-200">
                    -{p.discount}%
                  </span>
                )}
              </div>

              <ProductCard product={p} />

              <div className="mt-3 flex gap-2">
                <button
                  className="btn-outline"
                  onClick={() => {
                    setEditing(p);
                    setForm({
                      ...empty,
                      ...p,
                      gallery: p.gallery || [],
                      colors: p.colors || empty.colors,
                      features: p.features || empty.features,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-outline"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
