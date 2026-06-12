import { test, expect } from '@fixtures/Pages';
import { Users } from '@data/Users';
import { invalidLoginCases } from '@data/loginData';

test.describe('Login Feature @login @smoke', () => {
  test('valid user can log in @critical', async ({ loginPage, productPage }) => {
    await loginPage.open();
    await loginPage.login(Users.standard.username, Users.standard.password);
    await productPage.expectLoaded();
  });

  test('locked out user sees an error @negative', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(Users.locked.username, Users.locked.password);
    await loginPage.expectError(/locked out/i); //i case insensitive
  });

  test('performance glitch user can still log in @performance', async ({
    loginPage,
    productPage,
  }) => {
    await loginPage.open();
    await loginPage.login(Users.performance.username, Users.performance.password);
    await productPage.expectLoaded();
  });

  for (const c of invalidLoginCases) {
    test(`${c.name} shows error @regression`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(c.username, c.password);
      await loginPage.expectError(c.message);
    });
  }
});
