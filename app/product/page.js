// app/product/page.js
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProductByQueryPage({ searchParams }) {
  // Next 15: searchParams is a Promise
  const sp = await searchParams;
  const id = sp?.id ? decodeURIComponent(sp.id) : null;
  const slug = sp?.slug ? decodeURIComponent(sp.slug) : null;

  return <ProductDetailsClient id={id} slug={slug} />;
}
