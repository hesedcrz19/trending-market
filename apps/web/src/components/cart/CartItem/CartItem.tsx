import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import imgFallback from '@/assets/images/fallback.png';
import styles from './CartItem.module.css';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { fetchProductById } from '@/services/fetchProductsById';
import type { FormattedProduct } from '@/types/formattedProduct';
import { formatProduct } from '@/utils/formatProducts';
import { CartControllers } from '../CartControllers/CartControllers';
import { Star, Trash } from 'lucide-react';

export function CartItem({
  id,
  quantity,
  setTotal,
}: {
  id: string;
  quantity: number;
  setTotal: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [product, setProduct] = useState<Partial<FormattedProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const removeItem = useCartStore((store) => store.removeItem);

  useEffect(() => {
    fetchProductById(id)
      .then((res) => {
        setError(false);
        setProduct(formatProduct(res));
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!product.numericPrice) return;

    setTotal((prev) => ({ ...prev, [id]: (product.numericPrice ?? 0) * quantity }));

    return () => {
      setTotal((prev) => {
        const newValue = { ...prev };
        delete newValue[id];
        return newValue;
      });
    };
  }, [product.numericPrice, quantity, setTotal, id]);

  const { principalImage, title, promotion, price, originalPrice, shippingCost, numericPrice } =
    product;

  const hasDiscount = originalPrice !== price;

  if (error)
    return (
      <article className={styles.cartError}>
        <h3>An unexpected error occurred trying to fetch this product.</h3>
        <button onClick={() => removeItem(id)}>Delete product</button>
      </article>
    );

  return (
    <article className={styles.cartItem}>
      <div className={styles.imgContainer}>
        <img src={principalImage || imgFallback} alt={title?.fullContent || ''} />
        {!loading ? (
          <CartControllers className={styles.itemControls} id={id} quantity={quantity} />
        ) : (
          <Skeleton />
        )}
      </div>

      <div className={styles.contentContainer}>
        <h3>{title?.content ?? <Skeleton />}</h3>

        <div className={styles.detailsContainer}>
          <div className={styles.priceContainer}>
            {hasDiscount && (
              <p className={styles.originalPrice}>
                <span className="sr-only">Original price: </span>
                {originalPrice}
              </p>
            )}

            <p
              className={`${styles.price} ${hasDiscount ? styles.hasDiscount : ''}`}
              data-testid="price"
            >
              <span className="sr-only">Price: </span>
              {price ?? <Skeleton width="80px" />}
            </p>
          </div>

          {promotion && <p className={styles.promotion}>{promotion}</p>}
        </div>

        <p className={styles.shippingCost}>
          {shippingCost ? shippingCost.text : <Skeleton width="100px" />}
        </p>

        <div className={styles.footer}>
          <p className={styles.total}>
            {numericPrice ? `Total: $${(numericPrice ?? 0) * quantity}` : <Skeleton width={100} />}
          </p>

          {!loading && (
            <div className={styles.buttons}>
              <button className={styles.favBtn} aria-label="Add item to favorites">
                <Star />
              </button>
              <button
                onClick={() => removeItem(id)}
                className={styles.trashBtn}
                aria-label="Delete product"
              >
                <Trash />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
