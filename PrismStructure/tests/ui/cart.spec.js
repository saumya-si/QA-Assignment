import { test, expect } from '../../fixtures/testFixtures.js';

test.describe('Cart UI', () => {
  test.beforeEach(async ({ authPage, testUser }) => {
    await authPage.register(testUser);
    await authPage.login(testUser.email, testUser.password);
  });

  test('TC-UI-05 @Regression @positive Add product to cart and update quantity', async ({ productPage, cartPage }) => {
    await productPage.browseProducts();
    await productPage.openFirstInStockProduct();
    await productPage.addToCart();
    await cartPage.openCart();
    const items = cartPage.getCartLineItems();
    await expect(items.first()).toBeVisible();
    await cartPage.updateQuantity(2);
    const total = await cartPage.getCartTotalText();
    expect(total).toBeTruthy();
  });
});
