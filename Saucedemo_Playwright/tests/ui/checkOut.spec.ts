import { test, expect } from '@fixtures/Pages';
import { getProductPrice } from '@data/products';
import { checkoutValidationCases, validCustomer } from '@data/checkoutData';

const CART_ITEM = ['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)'];
const EXPECTED_SUBTOTAL = CART_ITEM.reduce((sum, name) => sum + getProductPrice(name), 0);

test.describe('End- to - End checkout', () => {
  test.beforeEach('Add products to cart', async ({ authenticatedPage }) => {
    for (const name of CART_ITEM) {
      await authenticatedPage.addToCart(name);
    }
    expect(await authenticatedPage.getCartCount()).toBe(CART_ITEM.length);
  });

  test('user can complete full checkout flow @smoke @e2e', async ({
    authenticatedPage,
    cartPage,
    checkOutPage,
  }) => {
    await test.step('Open cart and verify contents', async () => {
      await authenticatedPage.openCart();
      await cartPage.expectLoaded();
      const items = await cartPage.getItemNames();
      expect(items).toEqual(CART_ITEM);
    });

    await test.step('Begin checkout and fill information', async () => {
      await cartPage.checkout();
      await checkOutPage.fillInfo(validCustomer);
    });

    await test.step('Verify price', async () => {
      const total = await checkOutPage.getTotals();
      expect(total.subtotal).toBeCloseTo(EXPECTED_SUBTOTAL, 2);
      expect(total.total).toBeCloseTo(total.subtotal + total.tax, 2);
    });

    await test.step('Complete order', async () => {
      await checkOutPage.finish();
      await checkOutPage.expectSuccess();
    });
  });

  for (const tc of checkoutValidationCases) {
    const id =
      (tc.firstName || 'empty') + '/' + (tc.lastName || 'empty') + '/' + (tc.postalCode || 'empty');

    test(`Validation: ${id} -> "${tc.lastName}" @validation @data-driven`, async ({
      authenticatedPage,
      cartPage,
      checkOutPage,
    }) => {
      await authenticatedPage.openCart();
      await cartPage.checkout();
      await checkOutPage.fillInfo({
        firstName: tc.firstName,
        lastName: tc.lastName,
        postalCode: tc.postalCode,
      });
      await checkOutPage.expectError(tc.message);
    });
  }
});
