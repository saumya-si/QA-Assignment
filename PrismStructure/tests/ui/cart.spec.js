import { test, expect } from '../../fixtures/testFixtures.js';
import { registerAndLogin } from '../../utils/purchaseFlowHelper.js';

test.describe('Cart UI', () => {
  test('TC-UI-05 @Regression @negative Empty cart prevents checkout progression', async ({
    authApi,
    loginPage,
    cartPage,
    testUser,
  }) => {
    await registerAndLogin({ authApi, loginPage, testUser });

    await cartPage.openEmptyCart();
    await cartPage.expectEmptyCart();
  });
});
