import { test } from '../../fixtures/testFixtures.js';

test.describe('Product UI', () => {
  test('TC-UI-04 @Regression @negative @edge Out-of-stock product cannot be added to cart', async ({
    productPage,
  }) => {
    await productPage.openFirstOutOfStockProduct();
    await productPage.expectCannotAddToCart();
  });
});
