import { test, expect } from '@playwright/test';

test('Should add a product to the cart', async ({ page }) => {
  await page.goto('/products');

  const productsList = page.getByRole('list', { name: /products list/i });
  const firstCard = productsList.getByRole('article').first();
  const addToCartButton = firstCard.getByRole('button', { name: /add to cart/i });
  await expect(addToCartButton).toBeVisible();
  await addToCartButton.click();
  await expect(addToCartButton).not.toBeVisible();

  const cartControllersInput = firstCard.getByRole('textbox', { name: /change product quantity/i });
  await expect(cartControllersInput).toHaveValue('1');
  await cartControllersInput.fill('2');
  await expect(cartControllersInput).toHaveValue('2');

  const cartModalBtn = page.getByRole('button', { name: /open cart modal/i });
  const cartModal = page.getByRole('region', { name: /products cart/i });

  await expect(cartModal).not.toBeVisible();
  await cartModalBtn.click();
  await expect(cartModal).toBeVisible();

  const cartList = cartModal.getByRole('list');
  await expect(cartList.getByRole('listitem')).toHaveCount(1);

  const firstCartItem = cartList.first();
  await expect(
    firstCartItem.getByRole('textbox', { name: /change product quantity/i })
  ).toHaveValue('2');

  await firstCartItem.getByRole('button', { name: /delete product/i }).click();
  await expect(cartList.getByRole('listitem')).toHaveCount(0);
});
