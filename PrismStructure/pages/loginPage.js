import { BasePage } from './basePage.js';

/**
 * Login page object — stable locators for /auth/login.
 * Locators use role/label-first strategy per Playwright best practices.
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email address/i });
    this.passwordInput = page.getByRole('textbox', { name: /^password/i });
    this.loginButton = page.getByRole('button', { name: /^login$/i });
    this.loginHeading = page.getByRole('heading', { name: /login/i });
    this.errorAlert = page.locator('[data-test="login-error"], .alert-danger, .invalid-feedback').first();
    this.userMenu = page.getByRole('link', { name: /profile|account|my account/i });
    this.signOutLink = page.getByRole('link', { name: /sign out|logout/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
  }

  async open() {
    await this.navigate('/auth/login');
    await expectLoginFormReady(this);
  }

  async fillCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.loginButton.click();
  }

  async login(email, password) {
    await this.open();
    await this.fillCredentials(email, password);
    await this.submit();
  }

  async waitForLoginSuccess() {
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15_000 });
  }

  async waitForLoginFailure() {
    await this.page.waitForURL(/\/auth\/login/, { timeout: 10_000 });
    await this.errorAlert.or(this.loginHeading).waitFor({ state: 'visible' });
  }

  loggedInIndicator() {
    return this.signOutLink
      .or(this.userMenu)
      .or(this.page.locator('[data-test="nav-user"]'));
  }

  async expectAuthenticatedNav() {
    await this.signInLink.waitFor({ state: 'hidden' });
  }
}

async function expectLoginFormReady(loginPage) {
  await loginPage.loginHeading.waitFor({ state: 'visible' });
  await loginPage.emailInput.waitFor({ state: 'visible' });
  await loginPage.passwordInput.waitFor({ state: 'visible' });
  await loginPage.loginButton.waitFor({ state: 'visible' });
}
