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
import { useLocale } from "@/components/i18n/LocaleProvider";

const empty = {
  slug: "",
  // localized fields
  name_es: "",
  name_en: "",
  category_es: "",
  category_en: "",
  shortDesc_es: "",
  shortDesc_en: "",
  longDesc_es: "",
  longDesc_en: "",
  // non-localized
  price: 0,
  image: "",
  gallery: [],
  colors: ["#111827", "#6b7280", "#d1d5db"],
  features: [{ title: "Frame", desc: "Light, durable build." }],
  featured: false,
  discount: null,
  discountEnd: null,
};

const inputCls =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40";

function tsToMs(v) {
  if (!v) return 0;
  if (typeof v.toDate === "function") return v.toDate().getTime();
  if (typeof v.seconds === "number") return v.seconds * 1000;
  if (typeof v === "string") return new Date(v).getTime() || 0;
  if (typeof v === "number") return v;
  return 0;
}

export default function ProductsManager() {
  const { locale } = useLocale();
  const localeLang = (locale || "es").startsWith("en") ? "en" : "es";

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  // view + sorting (for table)
  const [view, setView] = useState("cards"); // 'cards' | 'table'
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // language tab for editing localized fields
  const [lang, setLang] = useState("es"); // 'es' | 'en'

  // live list
  useEffect(() => {
    const colRef = collection(db, "products");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    const fields = [
      "name_es",
      "name_en",
      "category_es",
      "category_en",
      "shortDesc_es",
      "shortDesc_en",
      "longDesc_es",
      "longDesc_en",
    ];
    return items.filter((p) => {
      return fields.some((k) => (p[k] || "").toLowerCase().includes(n));
    });
  }, [items, q]);

  const sorted = useMemo(() => {
    const list = filtered.slice();
    list.sort((a, b) => {
      const nameKey = `name_${localeLang}`;
      const catKey = `category_${localeLang}`;
      let av, bv;
      switch (sortKey) {
        case "name":
          av = (a[nameKey] || "").toLowerCase();
          bv = (b[nameKey] || "").toLowerCase();
          break;
        case "price":
          av = Number(a.price) || 0;
          bv = Number(b.price) || 0;
          break;
        case "featured":
          av = a.featured ? 1 : 0;
          bv = b.featured ? 1 : 0;
          break;
        case "category":
          av = (a[catKey] || "").toLowerCase();
          bv = (b[catKey] || "").toLowerCase();
          break;
        default:
          av = tsToMs(a.createdAt);
          bv = tsToMs(b.createdAt);
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir, localeLang]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "category" ? "asc" : "desc");
    }
  }

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
      };
      data.gallery = (data.gallery || []).filter(Boolean);

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

  const yes = localeLang === "es" ? "Sí" : "Yes";
  const no = localeLang === "es" ? "No" : "No";

  return (
    <div className="grid gap-6">
      {/* Controls (white) */}
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
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-400"
            onClick={() => {
              setForm(empty);
              setEditing(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Create product
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted">View:</span>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setView("cards")}
                className={`px-3 py-1.5 text-sm ${
                  view === "cards"
                    ? "bg-brand text-white"
                    : "bg-white text-ink hover:bg-mist"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-sm ${
                  view === "table"
                    ? "bg-brand text-white"
                    : "bg-white text-ink hover:bg-mist"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor (warm accent) */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-amber-200 bg-[#FFF9F2] p-4 shadow-sm grid gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">
            {editing?.id ? "Edit product" : "Create product"}
          </h3>

          {/* language toggle for editing localized fields */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Editing language:</span>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-3 py-1.5 text-sm ${
                  lang === "es"
                    ? "bg-ink text-white"
                    : "bg-white text-ink hover:bg-mist"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 text-sm ${
                  lang === "en"
                    ? "bg-ink text-white"
                    : "bg-white text-ink hover:bg-mist"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

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
            <label className="block text-sm text-ink/80 mb-1">Price</label>
            <input
              type="number"
              step="1"
              className={inputCls}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </div>

        {/* Localized fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/80 mb-1">
              {lang === "es" ? "Nombre (ES)" : "Name (EN)"}
            </label>
            <input
              className={inputCls}
              value={form[`name_${lang}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`name_${lang}`]: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm text-ink/80 mb-1">
              {lang === "es" ? "Categoría (ES)" : "Category (EN)"}
            </label>
            <input
              className={inputCls}
              value={form[`category_${lang}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`category_${lang}`]: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            {lang === "es"
              ? "Descripción corta (ES)"
              : "Short description (EN)"}
          </label>
          <textarea
            rows={2}
            className={inputCls}
            value={form[`shortDesc_${lang}`] || ""}
            onChange={(e) =>
              setForm({ ...form, [`shortDesc_${lang}`]: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-ink/80 mb-1">
            {lang === "es" ? "Descripción larga (ES)" : "Long description (EN)"}
          </label>
          <textarea
            rows={4}
            className={inputCls}
            value={form[`longDesc_${lang}`] || ""}
            onChange={(e) =>
              setForm({ ...form, [`longDesc_${lang}`]: e.target.value })
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Main image */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm font-medium mb-2">Main image</div>
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="w-full h-40 object-cover rounded-lg mb-2 border border-gray-200"
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
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-400"
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

      {/* List (cool accent) */}
      <div className="rounded-2xl border border-sky-200 bg-[#F7FBFF] p-3 shadow-sm">
        <div className="text-sm text-muted mb-2">
          {sorted.length} product(s)
        </div>

        {view === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <ProductCard product={p} />
                <div className="flex gap-2 mt-2">
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
                      window.scrollTo({ top: 0, behavior: "smooth" });
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full text-sm">
              <thead className="text-left bg-white border-b">
                <tr>
                  <th className="py-2 px-3">Image</th>
                  <th
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    Name{" "}
                    {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => toggleSort("category")}
                  >
                    Category{" "}
                    {sortKey === "category"
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => toggleSort("price")}
                  >
                    Price{" "}
                    {sortKey === "price" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => toggleSort("featured")}
                  >
                    Featured{" "}
                    {sortKey === "featured"
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => toggleSort("createdAt")}
                  >
                    Date{" "}
                    {sortKey === "createdAt"
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sorted.map((p) => {
                  const name = p[`name_${localeLang}`] || "";
                  const category = p[`category_${localeLang}`] || "";
                  const d = tsToMs(p.createdAt);
                  const date = d
                    ? new Date(d).toLocaleDateString(locale || "es-CO")
                    : "—";
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 px-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-mist border" />
                        )}
                      </td>
                      <td className="py-2 px-3">{name}</td>
                      <td className="py-2 px-3">{category || "—"}</td>
                      <td className="py-2 px-3">
                        ${Number(p.price || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3">{p.featured ? yes : no}</td>
                      <td className="py-2 px-3">{date}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
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
                              window.scrollTo({ top: 0, behavior: "smooth" });
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
