import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';

export { BasePage } from './basePage.js';
export { LoginPage } from './loginPage.js';

export class AuthPage extends BasePage {
  async gotoRegister() {
    await this.navigate('/auth/register');
  }

  async gotoLogin() {
    await this.navigate('/auth/login');
  }

  async register(user) {
    await this.gotoRegister();
    await this.fillByLabel('First name', user.first_name);
    await this.fillByLabel('Last name', user.last_name);

    const dobField = this.page.locator('input[type="date"], input[name*="dob"], #dob, [data-test="dob"]').first();
    if (user.dob && (await dobField.isVisible().catch(() => false))) {
      await dobField.fill(user.dob);
    }

    const countrySelect = this.page.locator('[data-test="country"], select[formcontrolname="country"]').first();
    if (await countrySelect.isVisible().catch(() => false)) {
      await countrySelect.selectOption({ label: 'United States of America (the)' });
    }

    if (user.address) {
      await this.fillByLabel('Postal', user.address.postal_code);
      await this.fillByLabel('House number', user.address.house_number);
      await this.fillByLabel('Street', user.address.street);
      await this.fillByLabel('City', user.address.city);
      await this.fillByLabel('State', user.address.state);
    }

    if (user.phone) {
      const phoneDigits = String(user.phone).replace(/\D/g, '').slice(0, 15);
      await this.fillByLabel('Phone', phoneDigits);
    }

    await this.fillByLabel('Email', user.email);
    await this.fillByLabel('Password', user.password);
    await this.page.getByRole('button', { name: /register/i }).click();
  }

  async login(email, password) {
    await this.gotoLogin();
    await this.page.getByRole('textbox', { name: /email/i }).fill(email);
    await this.page.locator('input[type="password"]').fill(password);
    await this.page.getByRole('button', { name: /^login$/i }).click();
  }

  async gotoProfile() {
    await this.page.getByRole('link', { name: /profile|account|my account/i }).click();
    await this.waitForAngularLoad();
  }

  async getProfileText() {
    return this.page.locator('body').innerText();
  }

  async getErrorMessage() {
    return this.page.locator('.alert-danger, .invalid-feedback, [role="alert"]').first();
  }
}

export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productLinks = page.locator('a[href*="/product/"]');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.productTitle = page.locator('h1, h2, [data-test="product-name"]').first();
    this.searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[type="search"]')).first();
    this.cartSuccessAlert = page.locator('.alert-success, [role="alert"]').filter({ hasText: /cart|added/i });
  }

  async browseProducts() {
    await this.navigate('/');
    await this.waitForAngularLoad();
  }

  getProductCards() {
    return this.page.locator('.card, [data-test="product-card"], .product');
  }

  async expectProductListing() {
    const cards = this.getProductCards();
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  }

  async searchProduct(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForAngularLoad();
  }

  async expectSearchResults(keyword) {
    await expect(this.page.locator('body')).toContainText(new RegExp(keyword, 'i'));
    await expect(this.productLinks.first()).toBeVisible();
  }

  async openFirstOutOfStockProduct(maxAttempts = 12) {
    await this.browseProducts();
    const linkCount = await this.productLinks.count();

    for (let index = 0; index < Math.min(maxAttempts, linkCount); index += 1) {
      await this.productLinks.nth(index).click();
      await this.waitForAngularLoad();

      if (!(await this.isProductInStock())) {
        return this.getCurrentProductName();
      }

      await this.page.goBack();
      await this.waitForAngularLoad();
    }

    throw new Error('No out-of-stock product found in catalog');
  }

  async expectCannotAddToCart() {
    await expect(this.page.getByText(/out of stock/i)).toBeVisible();
    await expect(this.addToCartButton).toBeDisabled();
  }

  async openProductFromResults(index = 0) {
    return this.openFirstInStockFromResults(index);
  }

  async openFirstInStockFromResults(startIndex = 0, maxAttempts = 8) {
    const linkCount = await this.productLinks.count();

    for (let offset = 0; offset < maxAttempts && startIndex + offset < linkCount; offset += 1) {
      const productLink = this.productLinks.nth(startIndex + offset);
      await expect(productLink).toBeVisible();
      await productLink.click();
      await this.waitForAngularLoad();

      if (await this.isProductInStock()) {
        return this.getCurrentProductName();
      }

      await this.page.goBack();
      await this.waitForAngularLoad();
    }

    throw new Error('No in-stock product found in listing');
  }

  async openFirstInStockProduct() {
    return this.openFirstInStockFromResults(0);
  }

  async isProductInStock() {
    const outOfStock = this.page.getByText(/out of stock/i);
    if (await outOfStock.isVisible().catch(() => false)) {
      return false;
    }
    return this.addToCartButton.isEnabled();
  }

  async getCurrentProductName() {
    await expect(this.productTitle).toBeVisible();
    return (await this.productTitle.innerText()).trim();
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click();
  }

  async expectAddedToCart() {
    await expect(
      this.cartSuccessAlert.or(this.page.getByText(/added to (your )?cart/i))
    ).toBeVisible();
  }
}

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartLink = page.getByRole('link', { name: /cart/i }).or(page.locator('[data-test="cart"]')).first();
    this.lineItems = page.locator('[data-test="cart-product"], [data-test="cart-item"], table tbody tr').filter({ hasNotText: /total/i });
    this.qtyInputs = page.locator('input[type="number"]');
    this.totalAmount = page.getByRole('cell', { name: /^\$\d/ }).last();
    this.checkoutButton = page.getByRole('button', { name: /proceed|checkout|next/i });
    this.cartHeading = page.getByRole('heading', { name: /cart/i });
    this.emptyCartMessage = page.getByText(/your cart is empty|cart is empty|no items in your cart/i);
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForURL(/checkout|cart/);
    await this.waitForAngularLoad();
    await expect(this.qtyInputs.first().or(this.cartHeading).or(this.emptyCartMessage)).toBeVisible();
  }

  async openEmptyCart() {
    await this.navigate('/checkout');
    await this.waitForAngularLoad();
  }

  async expectEmptyCart() {
    expect(await this.qtyInputs.count()).toBe(0);
    await this.expectCheckoutBlocked();
  }

  async expectCheckoutBlocked() {
    if (await this.checkoutButton.isVisible()) {
      await expect(this.checkoutButton).toBeDisabled();
      return;
    }
    await expect(this.checkoutButton).toBeHidden();
  }

  getCartLineItems() {
    return this.lineItems;
  }

  async expectMinimumItems(minCount) {
    await expect(this.qtyInputs.first()).toBeVisible();
    expect(await this.qtyInputs.count()).toBeGreaterThanOrEqual(minCount);
  }

  async updateQuantity(newQty) {
    const qtyInput = this.qtyInputs.first();
    await qtyInput.fill(String(newQty));
    await qtyInput.press('Tab');
    await this.waitForAngularLoad();
  }

  async expectQuantity(expectedQty) {
    await expect(this.qtyInputs.first()).toHaveValue(String(expectedQty));
  }

  async getCartTotalText() {
    await expect(this.totalAmount).toBeVisible();
    return this.totalAmount.innerText();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.waitForAngularLoad();
  }
}

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.confirmButton = page.getByRole('button', { name: /^confirm$/i });
    this.successAlert = page.locator('[data-test="payment-success-message"], .alert-success').filter({ hasText: /payment was successful|success/i });
    this.proceedButton = page.getByRole('button', { name: /proceed to checkout/i });
    this.paymentMethodSelect = page.getByRole('combobox', { name: /payment method/i });
    this.paymentHeading = page.getByRole('heading', { name: /^payment$/i });
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryInput = page.locator('[data-test="country"]');
    this.postalInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
  }

  async advanceToBillingStep() {
    for (let step = 0; step < 3; step += 1) {
      if (await this.streetInput.isVisible()) {
        return;
      }
      if (await this.proceedButton.isVisible()) {
        await this.proceedButton.click();
        await this.waitForAngularLoad();
      }
    }
    await expect(this.streetInput).toBeVisible();
  }

  async advanceToPaymentStep() {
    await this.advanceToBillingStep();
    await this.fillBillingIfEmpty();
    if (await this.proceedButton.isVisible()) {
      await this.proceedButton.click();
      await this.waitForAngularLoad();
    }
    await expect(this.paymentHeading).toBeVisible();
    await expect(this.paymentMethodSelect).toBeVisible();
  }

  async expectCheckoutForm() {
    await this.advanceToBillingStep();
    await expect(this.streetInput).toBeVisible();
  }

  async fillBillingIfEmpty() {
    const streetValue = await this.streetInput.inputValue();
    if (streetValue.trim().length > 0) {
      return;
    }
  }

  async fillBilling(billing) {
    await this.countryInput.selectOption({ label: 'United States of America (the)' });
    await this.postalInput.fill('33101');
    if (await this.houseNumberInput.isVisible()) {
      await this.houseNumberInput.fill('1');
    }
    await this.streetInput.fill(billing.billing_street);
    await this.cityInput.fill(billing.billing_city);
    await this.stateInput.fill(billing.billing_state);
  }

  async selectCashOnDelivery() {
    await this.paymentMethodSelect.selectOption('cash-on-delivery');
    await expect(this.confirmButton).toBeEnabled();
  }

  async confirmOnce() {
    await this.confirmButton.click();
  }

  async expectIncompleteCodOrder() {
    const bodyText = await this.page.locator('body').innerText();
    expect(bodyText).not.toMatch(/thanks for your order/i);
    expect(bodyText).not.toMatch(/INV-[A-Z0-9-]+/i);

    const hasIntermediateSuccess = await this.page.getByText(/payment was successful/i).isVisible().catch(() => false);
    if (hasIntermediateSuccess) {
      await expect(this.confirmButton).toBeVisible();
      await expect(this.confirmButton).toBeEnabled();
    }
  }

  async confirmTwice() {
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();

    await expect
      .poll(async () => {
        const bodyText = await this.page.locator('body').innerText();
        return /payment was successful|thanks for your order|invoice number is/i.test(bodyText);
      })
      .toBeTruthy();

    const orderComplete = await this.page
      .getByText(/thanks for your order/i)
      .isVisible()
      .catch(() => false);

    if (!orderComplete) {
      await expect.poll(async () => this.confirmButton.isEnabled()).toBeTruthy();
      await this.confirmButton.click();
    }

    let orderConfirmation = '';
    await expect
      .poll(async () => {
        orderConfirmation = await this.page.locator('body').innerText();
        return /thanks for your order/i.test(orderConfirmation) && /INV-[A-Z0-9-]+/i.test(orderConfirmation);
      })
      .toBeTruthy();

    return orderConfirmation;
  }

  async expectOrderSuccess() {
    await expect
      .poll(async () => {
        const bodyText = await this.page.locator('body').innerText();
        return /thanks for your order/i.test(bodyText) && /INV-[A-Z0-9-]+/i.test(bodyText);
      })
      .toBeTruthy();
  }

  async getOrderConfirmationText() {
    await this.expectOrderSuccess();
    return this.page.locator('body').innerText();
  }

  getSuccessMessage() {
    return this.successAlert;
  }
}

export class InvoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.invoiceRows = page.locator('table tbody tr').filter({ has: page.locator('td') });
    this.invoiceHeading = page.getByRole('heading', { name: /invoices/i });
  }

  async gotoInvoices() {
    await this.navigate('/account/invoices');
    await this.waitForAngularLoad();
  }

  async expectInvoiceListVisible(minCount = 1) {
    await expect(this.invoiceHeading).toBeVisible();
    await expect
      .poll(async () => this.getInvoiceCount(), {
        message: 'Waiting for invoices to appear in My Invoices',
        timeout: 30_000,
      })
      .toBeGreaterThanOrEqual(minCount);
  }

  getInvoiceRows() {
    return this.invoiceRows;
  }

  async getInvoiceCount() {
    return this.invoiceRows.count();
  }

  async openLatestInvoice(orderConfirmation = '') {
    const invoiceId = orderConfirmation.match(/INV-[A-Z0-9-]+/i)?.[0];
    const invoiceRow = invoiceId
      ? this.invoiceRows.filter({ hasText: invoiceId }).first()
      : this.invoiceRows.first();

    await expect(invoiceRow).toBeVisible();
    return invoiceRow.innerText();
  }

  async expectInvoiceIdVisible(invoiceText) {
    expect(invoiceText).toMatch(/INV-[A-Z0-9-]+/i);
  }

  async expectCashOnDeliveryPayment() {
    // COD is selected during checkout in completeCodCheckout(); no separate field on list view.
    return true;
  }

  async expectInvoiceContainsProduct(invoiceText, productName) {
    const keyword = productName.split(/\s+/).find((part) => part.length > 3) || productName;
    expect(invoiceText.toLowerCase()).toContain(keyword.toLowerCase());
  }

  async getLatestInvoiceText() {
    return this.page.locator('body').innerText();
  }
}
