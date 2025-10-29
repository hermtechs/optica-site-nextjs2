// app/product/[slug]/page.js

import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { slug } = await params; // Next 15: params is a Promise
  return <ProductDetailsClient slug={decodeURIComponent(slug)} />;
}
