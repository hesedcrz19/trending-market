import styles from './Product.module.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState, useEffect } from 'react';
import { fetchProductBySlug } from '@/services/fetchProductBySlug';
import { formatProduct } from '@/utils/formatProducts';
import { ProductCarrousel } from '../ProductCarrousel/ProductCarrousel';
import { useLocation } from 'react-router';
import type { FormattedProduct } from '@/types/formattedProduct';
import { AddToCartButton } from '@/components/cart/AddToCartButton/AddToCartButton';
import { Star } from 'lucide-react';

export function Product({ slug }: { slug: string | undefined }) {
  const { state } = useLocation() as { state?: { product?: FormattedProduct } };

  const [product, setProduct] = useState<Partial<FormattedProduct>>(() =>
    state?.product && state.product.slug === slug ? state.product : {}
  );
  const [loading, setLoading] = useState(() => (state?.product?.slug === slug ? false : true));
  const [error, setError] = useState(false);

  const {
    id,
    title,
    category,
    price,
    description,
    originalPrice,
    discountPercentage,
    shippingCost,
    promotion,
    rating,
    principalImage,
  } = product;

  useEffect(() => {
    if (product.slug === slug) return;

    fetchProductBySlug(slug)
      .then((product) => {
        setProduct(formatProduct(product));
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, product.slug]);

  if (error) {
    return <p>A error as occurred</p>;
  }

  return (
    <article className={styles.productContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title?.fullContent ?? <Skeleton />}</h2>
      </header>

      <div className={styles.content}>
        <ProductCarrousel product={product} loading={loading} />

        <div className={styles.rightSide}>
          <p className={styles.description}>{description?.fullContent ?? <Skeleton count={6} />}</p>

          <div className={styles.details}>
            <p className={styles.detailsItem}>
              {category?.name.fullContent ?? <Skeleton width={80} />}
            </p>
          </div>

          <div className={styles.ratingContainer}>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <RatingStar key={i} starNumber={i} rating={rating || 0} />
              ))}
            {rating ? `(${rating})` : ''}
          </div>

          <div className={styles.pricesContainer}>
            <div className={styles.prices}>
              {originalPrice !== price && (
                <p className={styles.originalPrice}>
                  <span className="sr-only">Original price: </span>
                  {originalPrice}
                </p>
              )}
              <p
                className={`${styles.price} ${originalPrice !== price ? styles.hasDiscount : ''}`}
                data-testid="price"
              >
                <span className="sr-only">Price: </span>
                {price ?? <Skeleton width="80px" />}
              </p>
            </div>

            {(discountPercentage !== 0 || promotion !== null) && (
              <ul className={styles.promos}>
                {promotion && <li className={styles.promotion}>{promotion}</li>}
                {discountPercentage !== 0 && discountPercentage && (
                  <li className={styles.promotion}>
                    {discountPercentage ? `${discountPercentage}% off` : <Skeleton width="50px" />}
                  </li>
                )}
              </ul>
            )}
          </div>

          <p className={styles.shippingCost}>
            {shippingCost ? shippingCost.text : <Skeleton width="100px" />}
          </p>

          <footer className={styles.footer}>
            {loading || !id ? (
              <div style={{ flexGrow: 1 }}>
                <Skeleton height={35} borderRadius={3} />
              </div>
            ) : (
              <>
                <AddToCartButton
                  id={id}
                  title={title?.content ?? ''}
                  image={principalImage}
                  buttonProps={{ className: styles.addToCartBtn }}
                  controlProps={{ className: styles.itemControls }}
                  deleteBtnProps={{ className: styles.deleteBtn }}
                />
                <button className={styles.favBtn} aria-label="Add product to favorites">
                  <Star />
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}

function RatingStar({ starNumber, rating }: { starNumber: number; rating: number }) {
  const starWidth = Math.max(0, (rating - starNumber) * 100);
  return (
    <div className={styles.star}>
      {rating ? <div style={{ width: `${starWidth}%` }}></div> : <Skeleton />}
    </div>
  );
}
