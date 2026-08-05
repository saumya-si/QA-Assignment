export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForAngularLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickByRole(role, name, options = {}) {
    await this.page.getByRole(role, { name, ...options }).click();
  }

  async fillByLabel(label, value) {
    await this.page.getByLabel(label, { exact: false }).fill(value);
  }
}
