import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson } from '../../utils/apiHelper.js';
import { createUser, createBillingAddress } from '../../utils/testDataFactory.js';
import { registerUser, loginUser, createShoppingCart } from '../../utils/apiLifecycleHelper.js';
import {
  assertErrorResponse,
  assertUnauthorized,
  assertNotFound,
  assertValidationError,
  getInvalidResourceId,
} from '../../utils/apiNegativeHelper.js';

test.describe('Negative API', () => {
  test('TC-API-08 @Regression @negative Invalid login credentials return error without token', async ({
    authApi,
    testUser,
  }) => {
    await registerUser(authApi, testUser);

    const invalidResponse = await authApi.post('/users/login', {
      email: testUser.email,
      password: 'WrongPassword@99',
    });

    await assertErrorResponse(invalidResponse, [400, 401, 422]);
    const body = await parseJson(invalidResponse);
    expect(body.access_token).toBeFalsy();

    const unregisteredResponse = await authApi.post('/users/login', {
      email: `missing_${Date.now()}@example.com`,
      password: testUser.password,
    });
    await assertErrorResponse(unregisteredResponse, [400, 401, 422]);
    expect((await parseJson(unregisteredResponse)).access_token).toBeFalsy();
  });

  test('TC-API-09 @Regression @negative Protected endpoints reject missing authentication token', async ({
    authApi,
    invoiceApi,
    cartApi,
    testUser,
  }) => {
    await registerUser(authApi, testUser);
    await loginUser(authApi, testUser);

    authApi.clearToken();
    invoiceApi.clearToken();
    cartApi.clearToken();

    await assertUnauthorized(await authApi.getProfile());
    await assertUnauthorized(await invoiceApi.getInvoices());
    await assertUnauthorized(await invoiceApi.createInvoice(createBillingAddress('no-token-cart')));
  });

  test('TC-API-10 @Regression @negative Invalid resource IDs return not found errors', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
    testUser,
  }) => {
    await registerUser(authApi, testUser);
    await loginUser(authApi, testUser);
    productApi.setToken(authApi.token);
    cartApi.setToken(authApi.token);
    invoiceApi.setToken(authApi.token);

    const invalidId = getInvalidResourceId();

    await assertNotFound(await productApi.getProduct(invalidId));
    await assertNotFound(await cartApi.getCart(invalidId));
    await assertNotFound(await invoiceApi.getInvoice(invalidId));

    const validCartId = await createShoppingCart(cartApi);
    const addResponse = await cartApi.addProduct(validCartId, invalidId, 1);
    await assertErrorResponse(addResponse, [404, 422], /not found|requested item|invalid/i);
  });

  test('TC-API-11 @Regression @negative Invalid request payloads return validation errors', async ({
    authApi,
    cartApi,
    invoiceApi,
    testUser,
  }) => {
    const weakPasswordUser = {
      ...createUser(),
      password: 'weakpass',
    };
    const registerResponse = await authApi.register(weakPasswordUser);
    await assertValidationError(registerResponse);

    await registerUser(authApi, testUser);
    await loginUser(authApi, testUser);
    cartApi.setToken(authApi.token);
    invoiceApi.setToken(authApi.token);

    const cartId = await createShoppingCart(cartApi);

    const missingProductResponse = await cartApi.post(`/carts/${cartId}`, { quantity: 1 });
    await assertValidationError(missingProductResponse);

    const invalidQuantityResponse = await cartApi.post(`/carts/${cartId}`, {
      product_id: getInvalidResourceId(),
      quantity: 0,
    });
    await assertValidationError(invalidQuantityResponse);

    const incompleteInvoice = createBillingAddress(cartId);
    delete incompleteInvoice.billing_city;
    const invoiceResponse = await invoiceApi.createInvoice(incompleteInvoice);
    await assertValidationError(invoiceResponse);
  });
});
