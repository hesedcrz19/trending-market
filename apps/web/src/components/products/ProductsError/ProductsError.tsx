import { Link, useSearchParams } from 'react-router';
import styles from './ProductsError.module.css';
import errorImage from '@/assets/images/error.png';
import { useProductsStore } from '@/stores/productsStore';
import { setFiltersByParams } from '@/utils/setFiltersByParams';
import { PAGE } from '@/consts/filtersConsts';
import { House, RotateCcw } from 'lucide-react';

export function ProductsError() {
  const fetchProducts = useProductsStore((store) => store.fetchProducts);
  const [searchParams] = useSearchParams();

  return (
    <section className={styles.container}>
      <img src={errorImage} className={styles.img} alt="" />
      <h2>Unexpected fetch error</h2>
      <p>An error occurred trying to fetch the products.</p>
      <div>
        <Link to={'/'}>
          <House />
          Home
        </Link>
        <button
          onClick={() =>
            void fetchProducts(setFiltersByParams(searchParams), Number(searchParams.get(PAGE)))
          }
        >
          <RotateCcw />
          Retry
        </button>
      </div>
    </section>
  );
}
