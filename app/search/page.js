import ProductsSearchPage from "@/components/ProductsSearchPage";

export default function SearchAllProductsPage() {
  // This renders the exact same UI/data as /products
  return <ProductsSearchPage basePath="/search" />;
}
