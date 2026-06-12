import {Page, Locator, expect} from '@playwright/test';
import { BasePage } from './BasePage';
import {logger} from '../utils/logger';

export class CartPage extends BasePage{
        private title : Locator
        private items : Locator
        private checkOutButton : Locator
        private continueShoppingButton : Locator

        constructor(page : Page){
            super(page);
            this.title = page.locator('.title');
            this.items = page.locator('.cart_item');
            this.checkOutButton= page.locator('#checkout');
            this.continueShoppingButton = page.locator('#continue-shopping');
        }

        async expectLoaded() : Promise<void>{
            await expect(this.title).toHaveText('Your Cart')
        }

        async getItemNames(): Promise<string[]>{
            return this.items.locator('.inventory_item_name').allInnerTexts();
        }

        async getItemCount() : Promise<number>{
            return this.items.count();
        }

        async removeItem(productName:string):Promise<void>{
            logger.info('Removing item from cart',{product:productName});
            const item = this.items.filter({hasText:productName});
            await item.getByRole('button',{name:'Remove'}).click();
        }

        async checkout() : Promise<void>{
            logger.info('Proceeding to checkout');
            await this.checkOutButton.click();
        }

        async continue() : Promise<void>{
            logger.info('Continuing shopping');
            await this.continueShoppingButton.click();
        }
    }
