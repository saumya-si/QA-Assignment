import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson, extractPaginatedData } from '../../utils/apiHelper.js';
import { createUser } from '../../utils/testDataFactory.js';
import {
  authenticateForPurchase,
  createShoppingCart,
  addProductToCart,
  discoverInStockProducts,
  generateInvoice,
  verifyInvoiceInList,
} from '../../utils/apiLifecycleHelper.js';

test.describe('Invoice API', () => {
  test('TC-API-05 @Smoke @Regression Generate invoice COD and verify response', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
    testUser,
  }) => {
    await authenticateForPurchase(authApi, testUser, productApi, cartApi, invoiceApi);
    const [product] = await discoverInStockProducts(productApi, 1);

    const cartId = await createShoppingCart(cartApi);
    await addProductToCart(cartApi, cartId, product.id, 1);

    const invoice = await generateInvoice(invoiceApi, cartId);
    expect(invoice.invoicelines.some((line) => line.product_id === product.id)).toBe(true);

    const listed = await verifyInvoiceInList(invoiceApi, invoice.id);
    expect(listed.invoice_number).toBe(invoice.invoice_number);
    expect(listed.total).toBe(invoice.total);
  });

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
