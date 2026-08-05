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
    await this.fillByLabel('Email', user.email);
    await this.fillByLabel('Password', user.password);
    if (user.dob) {
      const dobField = this.page.locator('input[type="date"], input[name*="dob"], #dob').first();
      if (await dobField.isVisible().catch(() => false)) {
        await dobField.fill(user.dob);
      }
    }
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
  async browseProducts() {
    await this.navigate('/');
    await this.waitForAngularLoad();
  }

  async getProductCards() {
    return this.page.locator('.card, [data-test="product-card"], .product');
  }

  async searchProduct(keyword) {
    const searchInput = this.page.getByPlaceholder(/search/i).or(this.page.locator('input[type="search"]')).first();
    await searchInput.fill(keyword);
    await searchInput.press('Enter');
    await this.waitForAngularLoad();
  }

  async openFirstInStockProduct() {
    const productLink = this.page.locator('a[href*="/product/"]').first();
    await productLink.click();
    await this.waitForAngularLoad();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }
}

export class CartPage extends BasePage {
  async openCart() {
    await this.page.getByRole('link', { name: /cart/i }).or(this.page.locator('[data-test="cart"]')).first().click();
    await this.waitForAngularLoad();
  }

  async getCartLineItems() {
    return this.page.locator('table tbody tr, .cart-item, [data-test="cart-item"]');
  }

  async updateQuantity(newQty) {
    const qtyInput = this.page.locator('input[type="number"], .quantity-input').first();
    await qtyInput.fill(String(newQty));
    await qtyInput.press('Tab');
    await this.waitForAngularLoad();
  }

  async getCartTotalText() {
    const total = this.page.locator('text=/total/i').last();
    return total.innerText();
  }

  async proceedToCheckout() {
    await this.page.getByRole('button', { name: /proceed|checkout/i }).click();
    await this.waitForAngularLoad();
  }
}

export class CheckoutPage extends BasePage {
  async fillBilling(billing) {
    await this.fillByLabel('Street', billing.billing_street);
    await this.fillByLabel('City', billing.billing_city);
    await this.fillByLabel('State', billing.billing_state);
    await this.fillByLabel('Country', billing.billing_country);
    await this.fillByLabel('Postal', billing.billing_postal_code);
  }

  async selectCashOnDelivery() {
    await this.page.getByLabel(/cash on delivery/i).or(this.page.getByText(/cash on delivery/i)).first().click();
  }

  async confirmOnce() {
    await this.page.getByRole('button', { name: /confirm/i }).click();
  }

  async confirmTwice() {
    await this.confirmOnce();
    await this.page.waitForTimeout(500);
    await this.confirmOnce();
  }

  async getSuccessMessage() {
    return this.page.locator('.alert-success, [role="alert"]').first();
  }
}

export class InvoicePage extends BasePage {
  async gotoInvoices() {
    await this.page.getByRole('link', { name: /invoices/i }).click();
    await this.waitForAngularLoad();
  }

  async getInvoiceRows() {
    return this.page.locator('table tbody tr, .invoice-item, [data-test="invoice-row"]');
  }

  async getLatestInvoiceText() {
    return this.page.locator('body').innerText();
  }
}
