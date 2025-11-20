// app/page.js
"use client";

import { useState } from "react";

import PromoBar from "@/components/PromoBar";
import SiteNavbar from "@/components/SiteNavbar";
import HeroCarousel from "@/components/HeroCarousel";
import CollectionsPills from "@/components/CollectionsPills";
import FeaturedCollection from "@/components/FeaturedCollection";
import ProductsExplorer from "@/components/ProductsExplorer";
import EyeTestSection from "@/components/EyeTestSection";
import AboutHomeSection from "@/components/AboutHomeSection";
import ContactHomeSection from "@/components/ContactHomeSection";
import Footer from "@/components/Footer";

import useProducts from "@/lib/useProducts";
import { useLocale } from "@/components/i18n/LocaleProvider"; // 👈 NEW

export default function Home() {
  const [promoVisible, setPromoVisible] = useState(true);

  // i18n
  const { t } = useLocale(); // 👈 NEW

  // STRICT: live Firestore only
  const liveProducts = useProducts();
  const featured = liveProducts.filter((p) => p.featured);

  return (
    <>
      {promoVisible && <PromoBar onClose={() => setPromoVisible(false)} />}
      <SiteNavbar overHero offsetByPromo={promoVisible} />
      <main className="overflow-x-hidden">
        <HeroCarousel />
        <CollectionsPills />

        {/* Featured from Firestore only (hidden if none) */}
        {featured.length > 0 && (
          <FeaturedCollection
            products={featured}
            title={t("feature_collection")} // 👈 localized
            subtitle={t("feature_subtitle")} // 👈 localized
          />
        )}

        {/* All products from Firestore only (empty if none) */}
        <ProductsExplorer products={liveProducts} />

        {/* Content sections read strictly from Firestore */}
        <EyeTestSection />
        <AboutHomeSection />
        <ContactHomeSection />
      </main>
      <Footer />
    </>
  );
}
