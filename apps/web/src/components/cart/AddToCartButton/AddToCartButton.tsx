import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cartStore';
import { CartToast } from '../CartToast/CartToast';
import { CartControllers } from '../CartControllers/CartControllers';
import { Trash } from 'lucide-react';
import { MAX_CART_QUANTITY } from '@/consts/cartConsts';

type AddToCartButtonProps = {
  id: string;
  image: string | null | undefined;
  title: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  controlProps?: HTMLAttributes<HTMLDivElement>;
  deleteBtnProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export function AddToCartButton({
  id,
  title,
  image,
  buttonProps,
  controlProps,
  deleteBtnProps,
}: AddToCartButtonProps) {
  const { addItem, cart, removeItem, cartLength } = useCartStore();

  const handleAddToCart = (id: string) => {
    if (cartLength() >= MAX_CART_QUANTITY) {
      toast.error('Error, the cart is full', {
        description: `You can only have maximum ${MAX_CART_QUANTITY} products in your cart.`,
      });
      return;
    }
    addItem(id);
    toast(<CartToast image={image} title={title} />);
  };

  if (Object.keys(cart).includes(id))
    return (
      <>
        <CartControllers {...controlProps} id={id} quantity={cart[id].quantity} />
        <button aria-label="Delete product" {...deleteBtnProps} onClick={() => removeItem(id)}>
          <Trash />
        </button>
      </>
    );

  return (
    <button {...buttonProps} onClick={() => handleAddToCart(id)}>
      Add to cart
    </button>
  );
}
