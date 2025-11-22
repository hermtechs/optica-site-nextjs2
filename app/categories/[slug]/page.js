// // app/categories/[slug]/page.js

// import CategoryProductsClient from "./CategoryProductsClient";

// // Avoid static optimization so client data remains live
// export const dynamic = "force-dynamic";

// export default async function CategoryProductsPage({ params }) {
//   // In Next 15, params is a Promise; await it here (server)
//   const { slug } = await params;

//   // Pass a plain string into the client component
//   return <CategoryProductsClient slug={decodeURIComponent(slug)} />;
// }

import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import CategoryProductsClient from "./CategoryProductsClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function CategoryPage({ params }) {
  // Next 15 can pass params as a promise
  const { slug } = await params;

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <CategoryProductsClient slug={slug} />
      <Footer />
    </>
  );
}
