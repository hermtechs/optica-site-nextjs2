// app/search/page.js same ui as app/products/page.js
"use client";

import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import ProductsExplorer from "@/components/ProductsExplorer";
import useProducts from "@/lib/useProducts";

export default function SearchAllProductsPage() {
  const products = useProducts(); // Firestore only
  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-8">
        <ProductsExplorer products={products} />
      </main>
      <Footer />
    </>
  );
}
