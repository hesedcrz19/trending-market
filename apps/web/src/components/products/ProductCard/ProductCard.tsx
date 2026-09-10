import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import styles from './ProductCard.module.css';
import fallbackImage from '@/assets/images/fallback.png';
import { Link } from 'react-router';
import { useLocation, useSearchParams } from 'react-router';
import type { FormattedProduct } from '@/types/formattedProduct';
import { type SyntheticEvent } from 'react';
import { AddToCartButton } from '../../cart/AddToCartButton/AddToCartButton';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Partial<FormattedProduct>;
  loading: boolean;
}

export function ProductCard({ product, loading }: ProductCardProps) {
  const {
    id,
    title,
    price,
    originalPrice,
    discountPercentage,
    shippingCost,
    promotion,
    principalImage,
    category,
    rating,
  } = product;

  const imageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const imageElement = event.target as HTMLImageElement;
    imageElement.src = fallbackImage;
  };

  return (
    <li className={styles.productItem}>
      <article className={styles.productCard}>
        {!loading && <ProductLink product={product} />}

        <header className={styles.header}>
          {!loading ? (
            <img
              src={principalImage || fallbackImage}
              alt={title?.fullContent}
              onError={imageError}
            />
          ) : (
            <Skeleton style={{ aspectRatio: 1 / 1 }} />
          )}
        </header>

        <h3>{title?.content ?? <Skeleton count={2} />}</h3>

        <Link
          to={loading ? '' : `/products?category=${category?.slug}`}
          className={styles.category}
        >
          {category?.name.content ?? <Skeleton width="50px" />}
        </Link>

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

          {(discountPercentage || promotion) && (
            <ul className={styles.promos}>
              {discountPercentage !== 0 && discountPercentage && (
                <li className={styles.promotion}>{`-${discountPercentage}%`}</li>
              )}
              {promotion && <li className={styles.promotion}>{promotion}</li>}
            </ul>
          )}
        </div>

        <p className={styles.shippingCost}>
          {shippingCost ? shippingCost.text : <Skeleton width="100px" />}
        </p>

        <footer className={styles.footer}>
          {loading || !id ? (
            <div style={{ flexGrow: 1 }}>
              <Skeleton height={'100%'} />
            </div>
          ) : (
            <>
              <AddToCartButton
                id={id}
                image={principalImage}
                title={title?.content ?? ''}
                buttonProps={{ className: styles.addToCartBtn }}
                controlProps={{ className: styles.itemControls }}
                deleteBtnProps={{ className: styles.deleteItem }}
              />
              <button className={styles.favBtn} aria-label="Add product to favorites">
                <Star />
              </button>
            </>
          )}
        </footer>
      </article>
    </li>
  );
}

function ProductLink({ product }: { product: Partial<FormattedProduct> }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  return (
    <Link
      to={`/products/${product.slug ?? ''}?${searchParams.toString()}`}
      state={{ backgroundLocation: location, product: product }}
      className={styles.link}
      aria-label={`See more about ${product.title?.fullContent}`}
      replace
    />
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
