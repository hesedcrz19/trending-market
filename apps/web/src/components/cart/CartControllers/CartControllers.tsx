import { MAX_PRODUCT_QUANTITY } from '@/consts/cartConsts';
import { useCartStore } from '@/stores/cartStore';
import {
  useRef,
  useEffect,
  type HTMLAttributes,
  type InputEventHandler,
  type KeyboardEventHandler,
} from 'react';

type CartControllersProps = HTMLAttributes<HTMLDivElement> & { id: string; quantity: number };

export function CartControllers({ id, quantity, ...props }: CartControllersProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const increaseItem = useCartStore((store) => store.increaseItem);
  const decreaseItem = useCartStore((store) => store.decreaseItem);
  const setQuantity = useCartStore((store) => store.setQuantity);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = quantity.toString();
  }, [quantity]);

  const handleChange: InputEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  };

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const input = inputRef.current;
    if (!input) return;
    if (e.key === 'Enter') {
      setQuantity(id, Number(input.value));
      input.value = quantity.toString();
    }
  };

  return (
    <section {...props}>
      <button aria-label="Decrease product quantity" onClick={() => decreaseItem(id)}>
        −
      </button>
      <input
        name="quantity"
        aria-label="Change product quantity"
        ref={inputRef}
        type="text"
        inputMode="numeric"
        defaultValue={quantity}
        onInput={handleChange}
        onBlur={(e) => {
          setQuantity(id, Number(e.target.value));
          e.target.value = quantity.toString();
        }}
        onKeyDown={handleKeydown}
      />
      <button
        aria-label="Increase product quantity"
        onClick={() => increaseItem(id)}
        disabled={quantity >= MAX_PRODUCT_QUANTITY}
      >
        +
      </button>
    </section>
  );
}
