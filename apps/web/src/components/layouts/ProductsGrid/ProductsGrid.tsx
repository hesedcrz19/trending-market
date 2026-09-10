import styles from './ProductsGrid.module.css';
import { ProductCard } from '@/components/products/ProductCard/ProductCard';
import { NotFound } from '@/components/products/NotFound/NotFound';
import type { FormattedProduct } from '@/types/formattedProduct';
import type { AppError } from '@trending-market/shared';
import { ProductsError } from '@/components/products/ProductsError/ProductsError';

interface ProductsGridProps {
  products: FormattedProduct[];
  loading: boolean;
  error: null | Error | AppError;
}

export function ProductsGrid({ products, loading, error }: ProductsGridProps) {
  if (error) return <ProductsError />;

  if (!products?.length && !loading) return <NotFound />;

  return (
    <ul className={styles.productsGrid} aria-label="Products list">
      {<ProductsCards products={products} loading={loading} />}
    </ul>
  );
}

function ProductsCards({ products, loading }: { products: FormattedProduct[]; loading: boolean }) {
  if (loading)
    return Array.from({ length: 12 }).map((_, i) => (
      <ProductCard key={i} product={{}} loading={loading} />
    ));

  return products?.map((product) => (
    <ProductCard key={product.id} product={product} loading={loading} />
  ));
}
