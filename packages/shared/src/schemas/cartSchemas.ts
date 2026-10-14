import z from 'zod';
import { MAX_CART_QUANTITY } from '../consts/cartConsts.js';

export const cartItemSchema = z.object({
  quantity: z.number().int().min(1).max(MAX_CART_QUANTITY),
});

export const cartSchema = z.record(z.string(), cartItemSchema);

export const persistedCartSchema = z.object({
  cart: cartSchema,
});
