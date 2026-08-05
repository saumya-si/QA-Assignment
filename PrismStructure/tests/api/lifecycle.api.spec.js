import { test, expect } from '../../fixtures/testFixtures.js';
import { runApiPurchaseLifecycle } from '../../utils/apiLifecycleHelper.js';

test.describe('API Purchase Lifecycle', () => {
  test.setTimeout(60_000);

  test('TC-API-07 @Smoke @Regression @positive Complete API purchase lifecycle from registration to invoice', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
    testUser,
  }) => {
    const result = await runApiPurchaseLifecycle({
      authApi,
      productApi,
      cartApi,
      invoiceApi,
      testUser,
      productCount: 2,
      quantities: [1, 2],
    });

    expect(result.products).toHaveLength(2);
    expect(result.expectedItems).toHaveLength(2);
    expect(result.cart.cart_items).toHaveLength(2);
    expect(result.invoice.invoicelines.length).toBeGreaterThanOrEqual(1);

    for (const line of result.invoice.invoicelines) {
      expect(line.product_id).toBeTruthy();
      expect(line.quantity).toBeGreaterThan(0);
      expect(line.unit_price).toBeGreaterThan(0);
    }
  });
});
