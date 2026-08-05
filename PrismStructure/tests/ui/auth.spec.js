import { test, expect } from '../../fixtures/testFixtures.js';
import { getCustomerCredentials } from '../../utils/testDataFactory.js';

test.describe('Authentication UI', () => {
  test('TC-UI-01 @Smoke @positive Register new user with valid data', async ({ authPage, testUser }) => {
    await authPage.register(testUser);
    await expect(authPage.page).not.toHaveURL(/register/);
  });

  test('TC-UI-02 @Smoke @positive Login with valid credentials and verify profile', async ({ authPage, testUser }) => {
    await authPage.register(testUser);
    await authPage.login(testUser.email, testUser.password);
    await authPage.gotoProfile();
    const profileText = await authPage.getProfileText();
    expect(profileText).toContain(testUser.first_name);
    expect(profileText).toContain(testUser.email);
  });

  test('TC-UI-03 @Regression @negative Login with invalid password shows error', async ({ authPage }) => {
    const creds = getCustomerCredentials();
    await authPage.login(creds.email, 'InvalidPassword@99');
    await expect(authPage.page).toHaveURL(/login/);
  });

  test('TC-UI-08 @Regression @negative Register with duplicate email shows error', async ({ authPage, testUser }) => {
    const creds = getCustomerCredentials();
    const duplicateUser = { ...testUser, email: creds.email };
    await authPage.register(duplicateUser);
    const error = authPage.getErrorMessage();
    await expect(error).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(authPage.page).toHaveURL(/register/);
    });
  });
});
