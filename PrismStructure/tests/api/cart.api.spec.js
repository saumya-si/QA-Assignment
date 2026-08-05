import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson } from '../../utils/apiHelper.js';
import { createUser, getFirstInStockProductId } from '../../utils/testDataFactory.js';

test.describe('Cart API', () => {
  let token;
  let productId;

  test.beforeEach(async ({ authApi, request }) => {
    const user = createUser();
    await authApi.register(user);
    const loginRes = await authApi.login(user.email, user.password);
    assertStatus(loginRes, 200);
    token = (await parseJson(loginRes)).access_token;
    authApi.setToken(token);
    productId = await getFirstInStockProductId(request);
  });

  test('TC-API-03 @Smoke @positive Create cart add product and verify contents', async ({ cartApi }) => {
    cartApi.setToken(token);
    const createRes = await cartApi.createCart();
    assertStatus(createRes, 201);
    const { id: cartId } = await parseJson(createRes);

    const addRes = await cartApi.addProduct(cartId, productId, 1);
    expect(addRes.ok()).toBeTruthy();

    const getRes = await cartApi.getCart(cartId);
    assertStatus(getRes, 200);
  });

  test('TC-API-04 @Regression @positive Update product quantity and verify cart', async ({ cartApi }) => {
    cartApi.setToken(token);
    const createRes = await cartApi.createCart();
    const { id: cartId } = await parseJson(createRes);
    await cartApi.addProduct(cartId, productId, 1);

    const updateRes = await cartApi.updateQuantity(cartId, productId, 2);
    expect(updateRes.ok()).toBeTruthy();

    const getRes = await cartApi.getCart(cartId);
    assertStatus(getRes, 200);
  });
});
