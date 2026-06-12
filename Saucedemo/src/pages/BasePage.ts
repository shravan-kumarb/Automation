import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }
}
