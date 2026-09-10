import type { Cart } from '@/types/cartTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_CART_QUANTITY, MAX_PRODUCT_QUANTITY } from '@/consts/cartConsts';

interface CartStore {
  cart: Cart;
  cartLength: () => number;
  addItem: (productsId: string) => void;
  removeItem: (productsId: string) => void;
  increaseItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {},
      cartLength: () => Object.keys(get().cart).length,
      addItem: (productId) =>
        set(({ cart, cartLength }) => {
          if (cartLength() >= MAX_CART_QUANTITY) return {};
          return {
            cart: {
              ...cart,
              [productId]: {
                quantity: Math.min((cart[productId]?.quantity ?? 0) + 1, MAX_PRODUCT_QUANTITY),
              },
            },
          };
        }),
      removeItem: (productId) =>
        set((store) => {
          const newCart = { ...store.cart };
          delete newCart[productId];
          return { cart: newCart };
        }),
      increaseItem: (productId) =>
        set((store) => ({
          cart: {
            ...store.cart,
            [productId]: {
              quantity: Math.min((store.cart[productId]?.quantity ?? 0) + 1, MAX_PRODUCT_QUANTITY),
            },
          },
        })),
      decreaseItem: (productId) =>
        set((store) => {
          const productQuantity = store.cart[productId]?.quantity;
          const newCart = { ...store.cart };

          if (!productQuantity || productQuantity <= 1) {
            delete newCart[productId];
          } else {
            newCart[productId].quantity = Math.min(productQuantity - 1, MAX_PRODUCT_QUANTITY);
          }
          return { cart: newCart };
        }),
      setQuantity: (productId, quantity) => {
        set((store) => {
          const newCart = { ...store.cart };

          if (Number.isNaN(quantity) || quantity < 1) {
            delete newCart[productId];
          } else {
            newCart[productId].quantity = Math.min(Math.floor(quantity), MAX_PRODUCT_QUANTITY);
          }
          return { cart: newCart };
        });
      },
      clearCart: () => set(() => ({ cart: {} })),
    }),
    {
      name: 'cart-storage',
      version: 1,
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
