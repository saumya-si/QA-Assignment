import { test, expect } from '../../fixtures/testFixtures.js';
import { getSearchKeyword } from '../../utils/testDataFactory.js';
import {
  registerAndLogin,
  searchAndAddProduct,
  addProductFromBrowse,
  updateCartQuantity,
  completeCodCheckout,
  verifyLatestInvoice,
  prepareCodPaymentStep,
  verifyNoInvoicesForUser,
} from '../../utils/purchaseFlowHelper.js';
import { createBillingAddress } from '../../utils/testDataFactory.js';

test.describe('Purchase Flow E2E', () => {
  test.describe.configure({ retries: 1 });
  test.setTimeout(120_000);

  test('TC-UI-06 @Regression @negative @edge Single COD confirm does not complete order or create invoice', async ({
    authApi,
    invoiceApi,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    invoicePage,
    testUser,
    request,
  }) => {
    await registerAndLogin({ authApi, loginPage, testUser });
    await searchAndAddProduct(productPage, request);

    await cartPage.openCart();
    await cartPage.expectMinimumItems(1);
    await cartPage.proceedToCheckout();

    await prepareCodPaymentStep(checkoutPage, createBillingAddress('single-confirm'));
    await checkoutPage.confirmOnce();
    await checkoutPage.expectIncompleteCodOrder();

    await verifyNoInvoicesForUser(authApi, invoiceApi, testUser);

    await invoicePage.gotoInvoices();
    expect(await invoicePage.getInvoiceCount()).toBe(0);
  });

  test('TC-UI-07 @Smoke @Regression @positive Complete purchase journey with COD and invoice verification', async ({
    authApi,
    invoiceApi,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    invoicePage,
    testUser,
    request,
  }) => {
    // Step 1: Log in with a valid user account
    await registerAndLogin({ authApi, loginPage, testUser });

    // Step 2: Search for a product and add to cart
    const searchKeyword = getSearchKeyword();
    const { name: searchedProduct } = await searchAndAddProduct(productPage, request, searchKeyword);
    expect(searchedProduct.length).toBeGreaterThan(0);

    // Step 3: Browse catalog and add a second product
    const browsedProduct = await addProductFromBrowse(productPage, 1);
    expect(browsedProduct.length).toBeGreaterThan(0);

    // Step 4: Update product quantity in cart
    const cartTotal = await updateCartQuantity(cartPage, 2);
    expect(cartTotal).toMatch(/\d/);

    // Step 5–6: Checkout with COD and double-confirm order placement
    await cartPage.proceedToCheckout();
    const { orderConfirmation } = await completeCodCheckout(checkoutPage);

    // Step 7: Verify invoice is generated with expected order details
    const invoiceDetails = await verifyLatestInvoice(invoicePage, authApi, invoiceApi, testUser, {
      orderConfirmation,
      productNames: [searchedProduct, browsedProduct],
      minInvoiceCount: 1,
    });

    expect(invoiceDetails).toMatch(/\$\d/);
    expect(await invoicePage.getInvoiceCount()).toBe(1);
  });
});
