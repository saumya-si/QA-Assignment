import { test as base } from '@playwright/test';
import { AuthPage, ProductPage, CartPage, CheckoutPage, InvoicePage } from '../pages/index.js';
import { AuthApiPage, ProductApiPage, CartApiPage, InvoiceApiPage } from '../api/index.js';
import { createUser } from '../utils/testDataFactory.js';

export const test = base.extend({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  invoicePage: async ({ page }, use) => {
    await use(new InvoicePage(page));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApiPage(request));
  },
  productApi: async ({ request }, use) => {
    await use(new ProductApiPage(request));
  },
  cartApi: async ({ request }, use) => {
    await use(new CartApiPage(request));
  },
  invoiceApi: async ({ request }, use) => {
    await use(new InvoiceApiPage(request));
  },
  testUser: async ({}, use) => {
    await use(createUser());
  },
});

export { expect } from '@playwright/test';
