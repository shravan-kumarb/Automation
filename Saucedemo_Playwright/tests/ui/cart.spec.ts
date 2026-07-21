import { defaultCartItems } from '@data/cartData';
import { test, expect } from '@fixtures/Pages';

const [firstItem, secondItem] = defaultCartItems;

test.describe('Cart Management @cart @regression', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    for (const item of defaultCartItems) await authenticatedPage.addToCart(item);
  });

  test('cart shows added items @smoke', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.openCart();
    await cartPage.expectLoaded();
    expect(await cartPage.getItemCount()).toBe(defaultCartItems.length);
    expect(await cartPage.getItemNames()).toContain(firstItem);
    expect(await cartPage.getItemNames()).toContain(secondItem);
  });

  test('user can remove an item from the cart', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.openCart();
    await cartPage.removeItem(firstItem);
    expect(await cartPage.getItemCount()).toBe(defaultCartItems.length - 1);
    expect(await cartPage.getItemNames()).toContain(secondItem);
  });

  test('user can continue shopping from cart', async ({
    authenticatedPage,
    cartPage,
    productPage,
  }) => {
    await authenticatedPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.continue();
    await productPage.expectLoaded();
  });

  test('user can go to checkout page', async ({ authenticatedPage, cartPage, checkOutPage }) => {
    await authenticatedPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();
    await checkOutPage.expectLoaded();
  });
});
