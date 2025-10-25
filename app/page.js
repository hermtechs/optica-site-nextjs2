"use client";
import { useMemo, useState } from "react";
import PromoBar from "@/components/PromoBar";
import SiteNavbar from "@/components/SiteNavbar";
import HeroCarousel from "@/components/HeroCarousel";
import CollectionsPills from "@/components/CollectionsPills";
import FeaturedCollection from "@/components/FeaturedCollection";
import ProductsExplorer from "@/components/ProductsExplorer";
import Footer from "@/components/Footer";
import baseProducts from "@/data/products";
import EyeTestSection from "@/components/EyeTestSection";
import AboutHomeSection from "@/components/AboutHomeSection";
import ContactHomeSection from "@/components/ContactHomeSection";

function makeManyProducts(src, total = 30) {
  // repeat and lightly vary price + slug suffix for uniqueness
  const out = [];
  let i = 0;
  while (out.length < total) {
    const p = src[i % src.length];
    const n = Math.floor(out.length / src.length) + 1; // batch number
    out.push({
      ...p,
      slug: `${p.slug}-v${n}-${out.length}`,
      price:
        typeof p.price === "number"
          ? Math.max(49, Math.round(p.price * (0.9 + (out.length % 5) * 0.03)))
          : p.price,
    });
    i++;
  }
  return out;
}

export default function Home() {
  const [promoVisible, setPromoVisible] = useState(true);

  const manyProducts = useMemo(() => makeManyProducts(baseProducts, 36), []);

  return (
    <>
      {promoVisible && <PromoBar onClose={() => setPromoVisible(false)} />}
      <SiteNavbar overHero offsetByPromo={promoVisible} />
      <main>
        {/*<HeroCarousel />*/}

        {/* Categories row (no search here anymore) */}
        <CollectionsPills /* show category pills only */ />

        {/* Featured section – small curated set */}
        <FeaturedCollection
          products={baseProducts}
          title="FEATURED COLLECTION"
          subtitle="Editor’s picks—clean silhouettes and everyday comfort."
        />

        {/* 👇 NEW: full explorer with search + sort + filters */}
        <ProductsExplorer products={manyProducts} />
        <EyeTestSection />
        <AboutHomeSection />
        <ContactHomeSection />
      </main>
      <Footer />
    </>
  );
}
