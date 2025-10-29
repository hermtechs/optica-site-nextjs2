// app/categories/[slug]/page.js

import CategoryProductsClient from "./CategoryProductsClient";

// Avoid static optimization so client data remains live
export const dynamic = "force-dynamic";

export default async function CategoryProductsPage({ params }) {
  // In Next 15, params is a Promise; await it here (server)
  const { slug } = await params;

  // Pass a plain string into the client component
  return <CategoryProductsClient slug={decodeURIComponent(slug)} />;
}
