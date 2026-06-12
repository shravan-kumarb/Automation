import{test,expect} from '@fixtures/Pages';
import {Users} from '@data/Users';

test.describe('Login Feature @login @smoke',()=>{
    test('valid user can log in @critical',async({loginPage,productPage})=>{

     await loginPage.open();
     await loginPage.login(Users.Standard.username,Users.Standard.password);
     await productPage.expectLoaded();
    });

    test('locked out user sees an error @negative',async({loginPage})=>{
        await loginPage.open();
        await loginPage.login(Users.locked.username,Users.locked.password);
        await loginPage.expectError(/locked out/i);//i case insensitive
    });

    test('performance glitch user can still log in @performance',async ({loginPage,productPage})=>{
        await loginPage.open();
        await loginPage.login(Users.performance.username,Users.performance.password);
        await productPage.expectLoaded();
    })
        const cases =[
            {name: 'wrong password', user:'standard_user', pass:'wrong',  msg:/do not match/i},
            {name: 'unknown user', user:'no_user', pass:'secret',  msg:/do not match/i},
            {name: 'empty username', user:'', pass:'secret_sauce',  msg:/Username is required/i},
            {name: 'empty password', user:'standard_user', pass:'',  msg:/Password is required/i},
        ]

        for(const c of cases){
            test(`${c.name} shows error @regression`,async({loginPage})=>{
                await loginPage.open();
                await loginPage.login(c.user,c.pass);
                await loginPage.expectError(c.msg);
            });
        }
        

    });