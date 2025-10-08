// app/product/[slug]/page.js

import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import Footer from "@/components/Footer";
import products from "@/data/products";

export default function ProductPage({ params }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return <div className="container-tight py-16">Not found.</div>;

  return (
    <>
      <PromoBar />
      <Navbar />
      <main className="container-tight py-10 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-3">
            {product.gallery.map((g, i) => (
              <img
                key={i}
                src={g}
                alt=""
                className="w-20 h-20 rounded border object-cover"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted">${product.price.toFixed(2)}</p>

          <div className="space-y-3">
            <label className="text-sm text-muted">Size</label>
            <select className="border px-3 py-2 rounded-md w-full max-w-xs">
              {["S", "M", "L"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <label className="text-sm text-muted">Color</label>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  className="w-6 h-6 rounded-full border"
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn">Add Prescription Lenses</button>
              <button className="btn-outline">Add to Cart</button>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-4 pt-6">
            {product.features.map((f, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">{f.title}</span>
                <p className="text-muted">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
