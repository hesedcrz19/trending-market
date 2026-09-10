import { escapeRegExp } from '@/utils/escapeRegExp';
import { ProductsGrid } from '@/components/layouts/ProductsGrid/ProductsGrid';
import { formatProduct } from '@/utils/formatProducts';
import { getByText, getByRole, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { it, expect, describe } from 'vitest';
import type { FormattedProduct } from '@/types/formattedProduct';
import { AppError } from '@trending-market/shared';
import userEvent from '@testing-library/user-event';

const category1 = {
  id: crypto.randomUUID(),
  name: 'Clothes',
  slug: 'clothes',
  image: 'img',
  updatedAt: '10/10/10',
  createdAt: '10/10/10',
};
const products: FormattedProduct[] = [
  {
    id: crypto.randomUUID(),
    title: 'Product1',
    slug: 'product1',
    price: 10,
    images: [],
    originalPrice: 10,
    discount: 0,
    discountPercentage: 0,
    promotion: null,
    shippingCost: 0,
    rating: 5,
    description: 'Description 1',
    category: category1,
    updatedAt: '10/10/10',
    createdAt: '10/10/10',
  },
  {
    id: crypto.randomUUID(),
    title: 'Product2',
    slug: 'product2',
    price: 10,
    images: [],
    originalPrice: 10,
    discount: 0,
    discountPercentage: 0,
    promotion: null,
    shippingCost: 0,
    rating: 5,
    description: 'Description 2',
    category: category1,
    updatedAt: '10/10/10',
    createdAt: '10/10/10',
  },
].map((p) => formatProduct(p));

const setup = ({
  products = [],
  loading = false,
  error = null,
}: { products?: FormattedProduct[]; loading?: boolean; error?: Error | AppError | null } = {}) =>
  render(
    <MemoryRouter>
      <ProductsGrid products={products} loading={loading} error={error} />
    </MemoryRouter>
  );

describe('ProductsGrid tests', () => {
  it('Should not found the products', () => {
    setup();
    expect(screen.getByRole('heading', { name: /no products found/i })).toBeInTheDocument();
  });

  it('Should not found the products', () => {
    setup({ error: new Error('Error fetching the products') });
    expect(screen.getByRole('heading', { name: /unexpected fetch error/i })).toBeInTheDocument();
  });

  it('Should render the loading skeletons', () => {
    setup({ loading: true });
    expect(screen.getAllByRole('article')).toHaveLength(12);

    products.forEach((p) => {
      expect(screen.queryByRole('heading', { name: p.title.fullContent })).not.toBeInTheDocument();
      expect(screen.queryByText(new RegExp(p.price))).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /see more about/i })).not.toBeInTheDocument();
    });
  });

  it('Should render the products', () => {
    setup({ products });
    const productCards = screen.getAllByRole('article');

    products.forEach((p, i) => {
      const linkRegExp = new RegExp(`see more about ${escapeRegExp(p.title.fullContent)}`, 'i');

      expect(
        getByRole(productCards[i], 'heading', { name: escapeRegExp(p.title.content) })
      ).toBeInTheDocument();
      expect(getByText(productCards[i], new RegExp(escapeRegExp(p.price)))).toBeInTheDocument();
      expect(getByRole(productCards[i], 'link', { name: linkRegExp })).toBeInTheDocument();
    });
  });

  it('Should add a product to cart and change the quantity', async () => {
    setup({ products });
    const firstCard = screen.getAllByRole('article')[0];
    const user = userEvent.setup();

    // Add product to cart
    const addToCartBtn = getByRole(firstCard, 'button', { name: /add to cart/i });
    await user.click(addToCartBtn);
    expect(addToCartBtn).not.toBeInTheDocument();

    const input = getByRole(firstCard, 'textbox', { name: /change product quantity/i });
    expect(input).toHaveValue('1');

    await user.clear(input);
    await user.type(input, '- 0 d1.ds0');
    expect(input).toHaveValue('10');

    await user.click(getByRole(firstCard, 'button', { name: /increase product quantity/i }));
    expect(input).toHaveValue('11');
    await user.click(getByRole(firstCard, 'button', { name: /decrease product quantity/i }));
    expect(input).toHaveValue('10');
  });
});
