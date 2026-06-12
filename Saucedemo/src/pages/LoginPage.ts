import {Page,Locator,expect} from '@playwright/test';
import { BasePage } from './BasePage';
import {logger} from '../utils/logger';

export class LoginPage extends BasePage {
    private userName:Locator
    private password: Locator
    private submit: Locator
    private errorMessage: Locator

    constructor(page:Page){
        super(page)
        this.userName=  page.locator('#user-name');
        this.password=  page.locator('#password');
        this.submit=page.locator('#login-button');
        this.errorMessage = page.locator('.error-message-container h3');
    }

        async open(): Promise<void>{
        logger.info('Opening login page');
        await this.goto('/');
        await expect(this.submit).toBeVisible();
    }   
    
        async login(usernameValue:string, passwordValue:string){
        logger.info('Logging in',{username:usernameValue});
        await this.userName.fill(usernameValue);
        await this.password.fill(passwordValue);
        await this.submit.click();
    }

    async expectError(message:string|RegExp):Promise<void>{

        await expect(this.errorMessage).toHaveText(message);
    }
    

    async getErrorMessage():Promise<string>{
        return (await this.errorMessage.textContent())?.trim() ?? '';
    }
}