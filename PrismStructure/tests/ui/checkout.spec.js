import { test, expect } from '../../fixtures/testFixtures.js';
import { createBillingAddress } from '../../utils/testDataFactory.js';

test.describe('Checkout E2E UI', () => {
  test.beforeEach(async ({ authPage, testUser }) => {
    await authPage.register(testUser);
    await authPage.login(testUser.email, testUser.password);
  });

  test('TC-UI-07 @Smoke @Regression @positive E2E purchase with COD and double-confirm invoice', async ({
    productPage,
    cartPage,
    checkoutPage,
    invoicePage,
  }) => {
    await productPage.browseProducts();
    await productPage.openFirstInStockProduct();
    await productPage.addToCart();

    await productPage.browseProducts();
    const secondProduct = productPage.page.locator('a[href*="/product/"]').nth(1);
    if (await secondProduct.isVisible()) {
      await secondProduct.click();
      await productPage.addToCart();
    }

    await cartPage.openCart();
    await cartPage.proceedToCheckout();

    const billing = createBillingAddress('ui-cart');
    await checkoutPage.fillBilling(billing);
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmTwice();

    await invoicePage.gotoInvoices();
    const invoiceText = await invoicePage.getLatestInvoiceText();
    expect(invoiceText.toLowerCase()).toMatch(/invoice/);
  });
});
