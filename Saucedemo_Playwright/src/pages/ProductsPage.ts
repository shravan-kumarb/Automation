import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class ProductsPage extends BasePage {
  readonly title: Locator;
  private inventory: Locator;
  private cartLink: Locator;
  private cartBadge: Locator;
  private sortDropDownOnly: Locator;
  private burgerMenu: Locator;
  private logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.inventory = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropDownOnly = page.locator('.product_sort_container');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
    await expect(this.inventory).not.toHaveCount(0);
  }

  async addToCart(productName: string): Promise<void> {
    logger.info('Adding product to cart', { product: productName });
    const card = this.inventory.filter({ hasText: productName });
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    logger.info('Removing product from cart', { product: productName });
    const card = this.inventory.filter({ hasText: productName });
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    const text = (await this.cartBadge.textContent())?.trim() ?? '0';
    return parseInt(text, 10);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    logger.info('Sorting products', { option });
    await this.sortDropDownOnly.selectOption(option);
  }

  async getAllProductByNames(): Promise<string[]> {
    return await this.inventory.locator('.inventory_item_name ').allInnerTexts();
  }

  async getAllProductByPrice(): Promise<number[]> {
    const prices = await this.inventory.locator('.inventory_item_price').allInnerTexts();
    return prices.map((p) => parseFloat(p.replace('$', '').trim()));
  }

  async openCart(): Promise<void> {
    logger.info('Opening cart');
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}
