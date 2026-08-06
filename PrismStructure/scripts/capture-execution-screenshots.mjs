/**
 * Captures redacted execution screenshots for execution-evidence/ (committed to repo).
 * Run: npm run capture:screenshots
 */
import { chromium, request } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../config/env.config.js';
import { env } from '../config/env.config.js';
import { AuthPage, LoginPage, ProductPage, CartPage, CheckoutPage } from '../pages/index.js';
import { AuthApiPage } from '../api/index.js';
import { createUser, getCustomerEmail, createBillingAddress, getSearchKeyword } from '../utils/testDataFactory.js';
import {
  searchAndAddProduct,
  prepareCodPaymentStep,
} from '../utils/purchaseFlowHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../reports/execution-evidence/screenshots');

async function shot(page, filename) {
  const filePath = path.join(OUT_DIR, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log('Saved', filePath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: env.baseUrl,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: false,
  });
  const page = await context.newPage();
  const apiContext = await request.newContext({ baseURL: env.apiBaseUrl });
  const authApi = new AuthApiPage(apiContext);
  const authPage = new AuthPage(page);
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const testUser = createUser();

  try {
    // TC-MAN-03 — HTTPS site loads (login page on practicesoftwaretesting.com)
    await loginPage.open();
    await shot(page, 'manual-https-padlock.png');

    // TC-MAN-02 — invalid login error
    await loginPage.login(getCustomerEmail(), 'WrongPassword@99');
    await loginPage.waitForLoginFailure();
    await shot(page, 'manual-invalid-login.png');

    // TC-MAN-01 / TC-UI-02 — register via API, login, profile
    await authApi.register(testUser);
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForLoginSuccess();
    await shot(page, 'manual-login-success.png');

    await authPage.gotoProfile();
    await page.waitForLoadState('networkidle');
    await shot(page, 'manual-profile-verification.png');

    // TC-MAN-04 — catalog loaded
    await productPage.browseProducts();
    await productPage.expectProductListing();
    await shot(page, 'manual-catalog-loaded.png');

    // TC-MAN-05 / TC-MAN-06 — COD checkout success (double confirm)
    const user2 = createUser();
    await authApi.register(user2);
    await loginPage.login(user2.email, user2.password);
    await loginPage.waitForLoginSuccess();
    await searchAndAddProduct(productPage, apiContext, getSearchKeyword());
    await cartPage.openCart();
    await cartPage.proceedToCheckout();
    await prepareCodPaymentStep(checkoutPage, createBillingAddress('evidence-cod'));
    await checkoutPage.confirmTwice();
    await checkoutPage.expectOrderSuccess();
    await shot(page, 'manual-cod-double-confirm.png');

    // TC-MAN-07 — single confirm, no invoice
    const user3 = createUser();
    await authApi.register(user3);
    await loginPage.login(user3.email, user3.password);
    await loginPage.waitForLoginSuccess();
    await searchAndAddProduct(productPage, apiContext);
    await cartPage.openCart();
    await cartPage.proceedToCheckout();
    await prepareCodPaymentStep(checkoutPage, createBillingAddress('evidence-single'));
    await checkoutPage.confirmOnce();
    await checkoutPage.expectIncompleteCodOrder();
    await shot(page, 'manual-single-confirm-no-invoice.png');

    // TC-MAN-08 — duplicate email registration
    const duplicateUser = { ...createUser(), email: getCustomerEmail() };
    await authPage.register(duplicateUser);
    const error = await authPage.getErrorMessage();
    await error.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    await shot(page, 'manual-duplicate-email-error.png');
  } finally {
    await apiContext.dispose();
    await browser.close();
  }

  console.log('\nScreenshot capture complete:', OUT_DIR);
}

async function captureHtmlReportScreenshot() {
  const reportPath = path.resolve(__dirname, '../reports/html/index.html');
  if (!fs.existsSync(reportPath)) {
    console.log('Skipping auto-html-report-index.png — run npm test first to generate HTML report');
    return;
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto(`file://${reportPath}`);
  await page.waitForLoadState('networkidle');
  await shot(page, 'auto-html-report-index.png');
  await browser.close();
}

async function run() {
  await main();
  await captureHtmlReportScreenshot();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
