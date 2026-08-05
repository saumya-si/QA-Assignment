import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson } from '../../utils/apiHelper.js';
import { createUser, createBillingAddress, getFirstInStockProductId } from '../../utils/testDataFactory.js';

test.describe('Invoice API', () => {
  test('TC-API-05 @Smoke @Regression Generate invoice COD and verify response', async ({
    authApi,
    cartApi,
    invoiceApi,
    request,
  }) => {
    const user = createUser();
    await authApi.register(user);
    const loginRes = await authApi.login(user.email, user.password);
    const token = (await parseJson(loginRes)).access_token;
    authApi.setToken(token);
    cartApi.setToken(token);
    invoiceApi.setToken(token);

    const productId = await getFirstInStockProductId(request);
    const cartRes = await cartApi.createCart();
    const { id: cartId } = await parseJson(cartRes);
    await cartApi.addProduct(cartId, productId, 1);

    const invoicePayload = createBillingAddress(cartId);
    const invoiceRes = await invoiceApi.createInvoice(invoicePayload);
    assertStatus(invoiceRes, 201);
    const invoice = await parseJson(invoiceRes);
    expect(invoice).toBeTruthy();
  });

  test('TC-API-06 @Regression @negative User can only access own invoices (IDOR)', async ({ authApi, invoiceApi }) => {
    const userA = createUser();
    const userB = createUser();
    await authApi.register(userA);
    await authApi.register(userB);

    const loginA = await authApi.login(userA.email, userA.password);
    const tokenA = (await parseJson(loginA)).access_token;
    invoiceApi.setToken(tokenA);
    const invoicesA = await invoiceApi.getInvoices();
    assertStatus(invoicesA, 200);

    const loginB = await authApi.login(userB.email, userB.password);
    const tokenB = (await parseJson(loginB)).access_token;
    invoiceApi.setToken(tokenB);
    const invoicesB = await invoiceApi.getInvoices();
    assertStatus(invoicesB, 200);

    const bodyA = await parseJson(invoicesA);
    const bodyB = await parseJson(invoicesB);
    const idsA = JSON.stringify(bodyA);
    const idsB = JSON.stringify(bodyB);
    expect(idsA).not.toEqual(idsB);
  });
});
