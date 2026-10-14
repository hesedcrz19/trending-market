import z from 'zod';
import { PROMOTIONS } from '@trending-market/shared';
import type { Category } from '@trending-market/shared';
import { categories } from '@/data/categories.js';

const categoriesID = categories.map((category) => category.id);

export const productSchema = z.object(
  {
    title: z
      .string('The title must be a string')
      .trim()
      .min(1, 'The title must have at least 1 characters')
      .refine((val) => !/\s{2,}/.test(val), {
        error: 'The title must not contain consecutive spaces',
      }),
    description: z
      .string('The description must be a string')
      .trim()
      .min(1, 'The description must have at least 1 characters'),
    originalPrice: z
      .number('The price must be a number')
      .positive('the price must be higher tha 0')
      .refine((val) => Number(val.toFixed(2)) === val, {
        error: 'The price must have at most 2 decimal places',
      }),
    discountPercentage: z
      .number('The discount percentage must be a number')
      .min(0, 'The discount percentage must be a positive number')
      .max(100, 'The discount percentage must be a number between 0 and 100')
      .int('The discount percentage must be an integer'),
    promotion: z
      .enum(PROMOTIONS, { error: `The promotion must be: ${PROMOTIONS.join(', ')}` })
      .nullable(),
    shippingCost: z
      .number('The shipping cost must be a number')
      .min(0, 'The shipping cost must be a positive number')
      .refine((val) => Number(val.toFixed(2)) === val, {
        error: 'The shippingCost must have at most 2 decimal places',
      }),
    rating: z
      .number('The rating must be a number')
      .min(0, 'The rating must be a positive number')
      .max(5, 'The rating must be a number between 0 and 5')
      .refine((val) => Number(val.toFixed(1)) === val, {
        error: 'The rating must have at most 1 decimal place',
      }),
    images: z.array(z.url('The images element must be a valid URL'), 'The images must be an array'),
    categoryId: z.literal(categoriesID, "The category id doesn't exist"),
  },
  'The product must be an object'
);

export type CreateProduct = z.infer<typeof productSchema>;
export type UpdateProduct = Omit<CreateProduct, 'categoryId'> & {
  id: string;
  categoryId?: string;
  category: Category;
  createdAt: string;
};
