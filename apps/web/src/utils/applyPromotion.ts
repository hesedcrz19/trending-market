import type { PROMOTIONS } from '@trending-market/shared';

export const applyPromotion = (
  price: number,
  quantity: number,
  promotion: (typeof PROMOTIONS)[number] | null
) => {
  let quantityToPay: number;

  if (promotion === '2x1') {
    quantityToPay = quantity - Math.floor(quantity / 2);
  } else if (promotion === '3x2') {
    quantityToPay = quantity - Math.floor(quantity / 3);
  } else {
    quantityToPay = quantity;
  }

  return price * quantityToPay;
};
