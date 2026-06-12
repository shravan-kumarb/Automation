import {Page, Locator, expect} from '@playwright/test';
import {BasePage} from './BasePage';
import {logger} from '../utils/logger';

export interface CheckOutInfo{
    firstName : string;
    lastName : string;
    postalCode : string;
}

export class CheckOutPage extends BasePage{
        private firstName :Locator;
        private lastName :Locator;
        private postalCode: Locator;
        private continueButton: Locator;
        private cancelButton: Locator;
        private subtotal : Locator;
        private tax: Locator;
        private total: Locator;
        private finishButton : Locator;
        private successHeader: Locator;
        private errorMessage: Locator;

        constructor(page:Page){
            super(page);
            this.firstName = page.locator('#first-name');
            this.lastName = page.locator('#last-name');
            this.postalCode = page.locator('#postal-code');
            this.continueButton= page.locator('#continue');
            this.cancelButton = page.locator('#cancel');
            this.subtotal = page.locator('.summary_subtotal_label');
            this.tax= page.locator('.summary_tax_label');
            this.total=page.locator('.summary_total_label');
            this.finishButton= page.locator('#finish');
            this.successHeader= page.locator('.complete-header');
            this.errorMessage = page.locator('h3');
        }

        async expectLoaded(): Promise<void>{
            await expect(this.firstName).toBeVisible();
        }
        async fillInfo(info: CheckOutInfo): Promise<void>{
            logger.info('Filling checkout info',{firstName: info.firstName,
                lastName: info.lastName,
                postalCode: info.postalCode,
            })
            await this.firstName.fill(info.firstName);
            await this.lastName.fill(info.lastName);
            await this.postalCode.fill(info.postalCode);
            await this.continueButton.click();
        }

        async getTotals() :Promise <{subtotal:number;tax:number;total:number}>{
            const parse = async (loc:Locator)=>{
                const text = (await loc.textContent()) ?? '';//if it null or undefined return ''
                const match = text.match(/[\d.]+/);
                return match ? parseFloat(match[0]):0;
            };
            return{
                subtotal:await parse(this.subtotal),
                tax: await parse(this.tax),
                total: await parse(this.total),
            };
        }

        async finish(): Promise<void>{
            logger.info('Finishing order');
            await this.finishButton.click();
        }

        async expectSuccess (): Promise<void>{
            await expect (this.successHeader).toHaveText('Thank you for your order!');
        }

        async expectError(message:string|RegExp) :Promise<void>{
            await expect ( this.errorMessage).toHaveText(message);
        }

}