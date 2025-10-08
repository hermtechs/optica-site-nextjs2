import ProductCard from "./ProductCard";
import fallbackProducts from "@/data/products";

export default function FeaturedCollection({
  products,
  title = "FEATURE COLLECTION",
  subtitle = "Browse a curated set of our most-loved eyewear.",
}) {
  // If a products prop is passed, use it as-is (even if empty).
  // If not passed at all, fall back to local data.
  const items = products ? products : fallbackProducts;

  return (
    <section className="bg-white">
      <div className="container-tight py-12 md:py-16">
        <header className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-muted max-w-2xl mx-auto mt-3">
              {subtitle}
            </p>
          )}
        </header>

        {items.length === 0 ? (
          <div className="text-center text-muted py-16">No products found.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
