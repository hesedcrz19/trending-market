import { http, HttpResponse } from 'msw';
import { CATEGORIES_API_URL } from '@/consts/categoriesApi';
import { PRODUCT_SLUG_API_URL } from '@/consts/productApi';

export const handlers = [
  http.get(CATEGORIES_API_URL, () => {
    return HttpResponse.json([
      {
        id: crypto.randomUUID(),
        name: 'Clothes',
        slug: 'clothes',
        image: 'img',
        updatedAt: '10/10/10',
        createdAt: '10/10/10',
      },
      {
        id: crypto.randomUUID(),
        name: 'Shoes',
        slug: 'shoes',
        image: 'img',
        updatedAt: '10/10/10',
        createdAt: '10/10/10',
      },
      {
        id: crypto.randomUUID(),
        name: 'Furniture',
        slug: 'furniture',
        image: 'img',
        updatedAt: '10/10/10',
        createdAt: '10/10/10',
      },
    ]);
  }),
  http.get(`${PRODUCT_SLUG_API_URL}/product1`, () => {
    return HttpResponse.json({
      id: crypto.randomUUID(),
      title: 'Product1',
      slug: 'product1',
      price: 10,
      images: ['1', '2', '3'],
      originalPrice: 10,
      discount: 0,
      discountPercentage: 0,
      promotion: null,
      shippingCost: 0,
      rating: 5,
      description: 'Description 1',
      category: {
        id: crypto.randomUUID(),
        name: 'Clothes',
        slug: 'clothes',
        image: 'img',
        updatedAt: '10/10/10',
        createdAt: '10/10/10',
      },
      updatedAt: '10/10/10',
      createdAt: '10/10/10',
    });
  }),
];
