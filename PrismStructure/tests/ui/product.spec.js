import { test, expect } from '../../fixtures/testFixtures.js';
import { getSearchKeyword } from '../../utils/testDataFactory.js';

test.describe('Product UI', () => {
  test('TC-UI-04 @Smoke @positive Browse products and verify listing loads', async ({ productPage }) => {
    await productPage.browseProducts();
    const cards = productPage.getProductCards();
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('TC-UI-06 @Regression @positive Search product by name returns results', async ({ productPage }) => {
    await productPage.browseProducts();
    await productPage.searchProduct(getSearchKeyword());
    await expect(productPage.page.locator('body')).toContainText(new RegExp(getSearchKeyword(), 'i'));
  });
});
