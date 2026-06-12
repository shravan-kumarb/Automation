import {test as base} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {ProductsPage} from '../pages/ProductsPage';
import {CartPage} from '../pages/CartPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import {Users} from '../data/Users';
import {logger} from '../utils/logger';

type Pages={
    loginPage:LoginPage;
    productPage:ProductsPage;
    cartPage:CartPage;
    checkOutPage:CheckOutPage;
    authenticatedPage:ProductsPage;
};

export const test = base.extend<Pages>({
    loginPage: async ({page},use)=> use(new LoginPage(page)),
    productPage:async ({page},use)=>use(new ProductsPage(page)),
    cartPage : async({page},use)=>use(new CartPage(page)),
    checkOutPage: async({page},use)=>use(new CheckOutPage(page)),

    authenticatedPage: async({page},use)=>{
        logger.info('Setting up authenticated session',{username: Users.Standard.username});
        const login = new LoginPage(page);
        const products = new ProductsPage(page);
        await login.open();
        await login.login(Users.Standard.username, Users.Standard.password);
        await products.expectLoaded();
        logger.info('Authenticated seesion ready');
        await use(products);
    },
});

export {expect} from '@playwright/test';