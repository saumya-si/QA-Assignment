import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson, extractPaginatedData } from '../../utils/apiHelper.js';
import { createUser } from '../../utils/testDataFactory.js';
import {
  authenticateForPurchase,
  createShoppingCart,
  addProductToCart,
  discoverInStockProducts,
  generateInvoice,
} from '../../utils/apiLifecycleHelper.js';

test.describe('Invoice API', () => {
  test('TC-API-06 @Regression @negative User can only access own invoices (IDOR)', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const userA = createUser();
    const userB = createUser();

    await authenticateForPurchase(authApi, userA, productApi, cartApi, invoiceApi);
    const [product] = await discoverInStockProducts(productApi, 1);
    const cartId = await createShoppingCart(cartApi);
    await addProductToCart(cartApi, cartId, product.id, 1);
    const invoiceA = await generateInvoice(invoiceApi, cartId);

    await authenticateForPurchase(authApi, userB, invoiceApi);
    const invoicesResponse = await invoiceApi.getInvoices();
    assertStatus(invoicesResponse, 200);
    const invoicesB = extractPaginatedData(await parseJson(invoicesResponse));
    const invoiceIdsB = invoicesB.map((invoice) => invoice.id);

    expect(invoiceIdsB).not.toContain(invoiceA.id);

    const foreignInvoiceResponse = await invoiceApi.getInvoice(invoiceA.id);
    expect([401, 403, 404]).toContain(foreignInvoiceResponse.status());
  });
});
