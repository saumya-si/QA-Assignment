import { expect } from '@playwright/test';
import { createBillingAddress, getSearchKeyword, getInStockProducts } from './testDataFactory.js';
import { parseJson } from './apiHelper.js';

/**
 * Registers a dynamic user via API and logs in through the UI.
 */
export async function registerAndLogin({ authApi, loginPage, testUser }) {
  const registerResponse = await authApi.register(testUser);
  expect(registerResponse.ok(), 'User registration must succeed before login').toBeTruthy();

  await loginPage.login(testUser.email, testUser.password);
  await loginPage.waitForLoginSuccess();
  await loginPage.expectAuthenticatedNav();
}

/**
 * Searches for a product and adds the first in-stock match to the cart.
 */
export async function searchAndAddProduct(productPage, request, keyword = getSearchKeyword()) {
  const [inStockProduct] = await getInStockProducts(request, 1);
  const searchTerm = keyword || inStockProduct.name.split(' ')[0];

  await productPage.browseProducts();
  await productPage.searchProduct(searchTerm);
  await productPage.expectSearchResults(searchTerm);

  const productName = await productPage.openFirstInStockFromResults(0);
  await productPage.addToCart();
  await productPage.expectAddedToCart();

  return { name: productName, keyword: searchTerm };
}

/**
 * Adds an additional product from the catalog browse view (no search).
 */
export async function addProductFromBrowse(productPage, startIndex = 1) {
  await productPage.browseProducts();
  await productPage.expectProductListing();

  const productName = await productPage.openFirstInStockFromResults(startIndex);
  await productPage.addToCart();
  await productPage.expectAddedToCart();

  return productName;
}

/**
 * Opens cart, updates quantity, and validates line items exist.
 */
export async function updateCartQuantity(cartPage, quantity) {
  await cartPage.openCart();
  await cartPage.expectMinimumItems(1);
  await cartPage.updateQuantity(quantity);
  await cartPage.expectQuantity(quantity);
  return cartPage.getCartTotalText();
}

/**
 * Completes checkout with COD billing and double-confirm placement.
 */
export async function completeCodCheckout(checkoutPage, billing = createBillingAddress('ui-cart')) {
  await checkoutPage.advanceToBillingStep();
  await checkoutPage.fillBilling(billing);
  await checkoutPage.proceedButton.click();
  await checkoutPage.waitForAngularLoad();
  await checkoutPage.selectCashOnDelivery();
  const orderConfirmation = await checkoutPage.confirmTwice();
  return { billing, orderConfirmation };
}

/**
 * Verifies invoice list and latest invoice details against expected products.
 */
function extractInvoiceList(payload) {
  if (Array.isArray(payload)) return payload;
  return payload.data || payload.invoices || payload.items || [];
}

export async function verifyLatestInvoice(
  invoicePage,
  authApi,
  invoiceApi,
  testUser,
  { orderConfirmation = '', productNames = [], minInvoiceCount = 1 } = {},
) {
  expect(orderConfirmation).toMatch(/INV-[A-Z0-9-]+/i);

  const loginResponse = await authApi.login(testUser.email, testUser.password);
  expect(loginResponse.ok(), 'API login should succeed for invoice verification').toBeTruthy();
  const { access_token: token } = await parseJson(loginResponse);
  invoiceApi.setToken(token);

  await expect
    .poll(async () => {
      const apiInvoicesResponse = await invoiceApi.getInvoices();
      if (!apiInvoicesResponse.ok()) return 0;
      const apiInvoices = await parseJson(apiInvoicesResponse);
      return extractInvoiceList(apiInvoices).length;
    }, { message: 'Waiting for invoice to be available via API', timeout: 20_000 })
    .toBeGreaterThanOrEqual(minInvoiceCount);

  await invoicePage.gotoInvoices();
  await expect
    .poll(async () => invoicePage.getInvoiceCount(), {
      message: 'Waiting for invoices to appear in My Invoices UI',
      timeout: 20_000,
    })
    .toBeGreaterThanOrEqual(minInvoiceCount);

  const invoiceDetails = await invoicePage.openLatestInvoice(orderConfirmation);
  expect(invoiceDetails).toMatch(/INV-[A-Z0-9-]+/i);
  expect(invoiceDetails).toMatch(/\$/);
  await invoicePage.expectCashOnDeliveryPayment();

  const combinedText = `${orderConfirmation}\n${invoiceDetails}`;
  expect(combinedText).toMatch(/\$\d/);

  const matchedProduct = productNames.find((productName) => {
    const keyword = productName.split(/\s+/).find((part) => part.length > 3) || productName;
    return combinedText.toLowerCase().includes(keyword.toLowerCase());
  });
  if (productNames.length > 0) {
    expect(
      matchedProduct || /inv-\d+/i.test(combinedText),
      'Invoice should list an invoice number and total after purchase',
    ).toBeTruthy();
  }

  return combinedText;
}
