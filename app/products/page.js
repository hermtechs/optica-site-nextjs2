// app/products/page.js
import ProductsSearchPage from "@/components/ProductsSearchPage";

export default function ProductsPage() {
  return (
    <ProductsSearchPage
      basePath="/products"
      title="DamiOptica — Todos los productos / All products"
      subtitle="Explora todo el catálogo. Busca, ordena y filtra fácilmente."
    />
  );
}
