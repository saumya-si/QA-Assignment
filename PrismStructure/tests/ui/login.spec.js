import { test, expect } from '../../fixtures/testFixtures.js';
import { getCustomerEmail, generateInvalidPassword } from '../../utils/testDataFactory.js';

test.describe('Login UI', () => {
  test('TC-UI-02 @Smoke @positive Valid user login redirects and shows authenticated UI', async ({
    loginPage,
    authApi,
    testUser,
  }) => {
    const registerResponse = await authApi.register(testUser);
    expect(registerResponse.ok(), 'Test user must be registered before login').toBeTruthy();

    await loginPage.login(testUser.email, testUser.password);

    await loginPage.waitForLoginSuccess();
    await expect(loginPage.page).not.toHaveURL(/\/auth\/login/);
    await loginPage.expectAuthenticatedNav();
  });

  test('TC-UI-03 @Regression @negative Invalid user login shows error and stays on login page', async ({
    loginPage,
  }) => {
    const email = getCustomerEmail();
    const invalidPassword = generateInvalidPassword();

    await loginPage.login(email, invalidPassword);

    await loginPage.waitForLoginFailure();
    await expect(loginPage.page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.errorAlert).toBeVisible();
  });
});
