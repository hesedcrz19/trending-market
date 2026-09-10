import { test, expect } from '@playwright/test';

test('should test the filters', async ({ page }) => {
  await page.goto('/products');

  const priceRegExp = /Price: \$(?:(?:1[5-9]|2\d)(?:\.\d{2})?|30(?:\.00)?)/i;

  await page.getByRole('button', { name: /Open filters/i }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('searchbox', { name: /Search product/i }).fill('red');
  await dialog.getByRole('textbox', { name: /Min/i }).fill('15');
  await dialog.getByRole('textbox', { name: /Max/i }).fill('30');

  const productsList = page.getByRole('list', { name: /Products list/i });
  const productCards = productsList.getByRole('article');
  await expect(productCards).toHaveCount(1);

  for (const card of await productCards.all()) {
    await expect(card.getByTestId('price')).toContainText(priceRegExp);
    await expect(card.getByRole('heading', { level: 3 })).toContainText(/red/i);
  }
});
