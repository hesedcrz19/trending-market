import styles from './CartModal.module.css';
import emptyCartImg from '@/assets/images/cart-empty.webp';
import { useModal } from '@/hooks/useModal';
import { useCartStore } from '@/stores/cartStore';
import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useModalContext } from '@/context/ModalContext';
import { createPortal } from 'react-dom';
import { CartItem } from '../CartItem/CartItem';
import { motion, stagger, type Variants } from 'motion/react';
import { formatPrice } from '@/utils/formatPrice';

export const CART_MODAL_KEY = 'cartModal';

const dialogVariants: Variants = {
  close: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  open: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      delayChildren: stagger(0, { startDelay: 0.3 }),
    },
  },
};

export function CartModal() {
  const [total, setTotal] = useState<Record<string, number>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const modalControls = useModal({
    dialogRef,
    autoClose: true,
    shouldHideScrollbar: true,
    controlTheTransitions: true,
  });
  const { addModalControls } = useModalContext();
  const cart = useCartStore((store) => store.cart);
  const cartLength = useCartStore((store) => store.cartLength);
  const clearCart = useCartStore((store) => store.clearCart);

  useEffect(() => {
    addModalControls(CART_MODAL_KEY, modalControls);
  }, [addModalControls, modalControls]);

  const { close, isOpening, startClosing } = modalControls;

  return createPortal(
    <motion.dialog
      className={styles.dialog}
      ref={dialogRef}
      variants={dialogVariants}
      initial={isOpening ? 'open' : 'close'}
      animate={isOpening ? 'open' : 'close'}
      onAnimationComplete={(variant) => {
        if (variant === 'close') close();
      }}
    >
      <section className={styles.dialogFlex} aria-labelledby={titleId}>
        <button
          aria-label="Close cart modal"
          className={styles.closeBtn}
          onClick={() => startClosing()}
        >
          <X />
        </button>

        <h2 id={titleId}>Products Cart ({cartLength()})</h2>

        {cartLength() ? (
          <ul className={styles.itemsList}>
            {Object.entries(cart).map(([id, item]) => (
              <li key={id} className={styles.itemContainer}>
                <CartItem id={id} quantity={item.quantity} setTotal={setTotal} />
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyCart />
        )}

        {cartLength() > 0 && (
          <div className={styles.underContainer}>
            <p className={styles.total}>
              {`Total: ${formatPrice(Object.values(total).reduce((prev, curr) => prev + curr, 0))}`}
            </p>
            <button onClick={clearCart}>Clear cart</button>
          </div>
        )}
      </section>
    </motion.dialog>,
    document.body
  );
}

function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <img src={emptyCartImg} alt="" />
      <h3>The cart is empty.</h3>
      <p>You don&apos;t have any products in your cart yet.</p>
    </div>
  );
}
