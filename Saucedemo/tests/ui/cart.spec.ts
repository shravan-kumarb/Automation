import {test,expect} from '@fixtures/Pages';


test.describe('Cart Management @cart @regression',()=>{
    test.beforeEach(async({authenticatedPage})=>{
        await authenticatedPage.addToCart('Sauce Labs Backpack');
        await authenticatedPage.addToCart('Sauce Labs Bike Light');
    });

    test('cart shows added items @smoke',async({authenticatedPage,cartPage})=>{
        await authenticatedPage.openCart();
        await cartPage.expectLoaded();
        expect (await cartPage.getItemCount()).toBe(2);
        expect (await cartPage.getItemNames()).toContain('Sauce Labs Backpack');
        expect (await cartPage.getItemNames()).toContain('Sauce Labs Bike Light');
    });

    test('user can remove an item from the cart',async({authenticatedPage,cartPage})=>{
        await authenticatedPage.openCart();
        await cartPage.removeItem('Sauce Labs Backpack');
        expect(await cartPage.getItemCount()).toBe(1);
        expect(await cartPage.getItemNames()).toContain('Sauce Labs Bike Light');
    });

    test('user can continue shopping from cart',async({authenticatedPage,cartPage,productPage})=>{
        await authenticatedPage.openCart();
        await cartPage.expectLoaded();
        await cartPage.continue();
        await productPage.expectLoaded();
    })

    test('user can go to checkout page',async({authenticatedPage, cartPage,checkOutPage})=>{
        await authenticatedPage.openCart();
        await cartPage.expectLoaded();
        await cartPage.checkout();
        await checkOutPage.expectLoaded();
    })
})