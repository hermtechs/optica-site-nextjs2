// app/about/page.js
"use client";

import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import useProducts from "@/lib/useProducts";
import useSiteContent from "@/lib/useSiteContent";

export default function AboutPage() {
  const products = useProducts(); // Firestore only
  const { getStrict } = useSiteContent();

  const title = getStrict("about_title");
  const body = getStrict("about_body");
  const image = getStrict("about_image"); // can be plain key (no _es/_en)

  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-10">
        {(title || body || image) && (
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {image ? (
              <img
                src={image}
                alt=""
                className="w-full rounded-2xl object-cover border"
              />
            ) : (
              <div className="w-full h-64 rounded-2xl bg-mist border" />
            )}
            <div>
              <h1 className="text-3xl font-semibold text-ink">{title}</h1>
              <p className="mt-4 text-ink/80 whitespace-pre-line">{body}</p>
            </div>
          </div>
        )}

        {featured.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ink mb-4">Destacados</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
