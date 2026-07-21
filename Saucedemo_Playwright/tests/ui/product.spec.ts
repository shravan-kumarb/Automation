import { test, expect } from '@fixtures/Pages';
import { ProductNames, expectedProductCount } from '@data/products';
import { SortOptions } from '@data/productData';
import { defaultCartItems } from '@data/cartData';

test.describe('Product Page', () => {
  test('inventory has  products @smoke', async ({ authenticatedPage }) => {
    const names = await authenticatedPage.getAllProductByNames();
    expect(names).toHaveLength(expectedProductCount);
    expect(names).toContain(ProductNames.backpack);
  });

  test('sort by price low to high @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy(SortOptions.priceLowToHigh);
    const price = await authenticatedPage.getAllProductByPrice();
    const sorted = [...price].sort((a, b) => a - b);
    expect(price).toEqual(sorted);
  });

  test('sort by name Z to A @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy(SortOptions.nameZToA);
    const names = await authenticatedPage.getAllProductByNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('cart badge updates when adding products @smoke', async ({ authenticatedPage }) => {
    const [first, second] = defaultCartItems;
    await authenticatedPage.addToCart(first);
    await authenticatedPage.addToCart(second);
    expect(await authenticatedPage.getCartCount()).toBe(defaultCartItems.length);

    await authenticatedPage.removeFromCart('Sauce Labs Backpack');
    expect(await authenticatedPage.getCartCount()).toBe(defaultCartItems.length - 1);
  });
});
