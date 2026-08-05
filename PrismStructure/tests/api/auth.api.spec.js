import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson } from '../../utils/apiHelper.js';
import { createUser, getCustomerCredentials } from '../../utils/testDataFactory.js';

test.describe('Authentication API', () => {
  test('TC-API-01 @Smoke @Regression Register valid user and reject duplicate email', async ({ authApi }) => {
    const user = createUser();
    const registerResponse = await authApi.register(user);
    assertStatus(registerResponse, 201);

    const creds = getCustomerCredentials();
    const duplicateResponse = await authApi.register({ ...user, email: creds.email });
    expect([409, 422]).toContain(duplicateResponse.status());
  });

  test('TC-API-02 @Smoke @Regression Login valid returns token and invalid credentials rejected', async ({ authApi }) => {
    const user = createUser();
    await authApi.register(user);

    const loginResponse = await authApi.login(user.email, user.password);
    assertStatus(loginResponse, 200);
    const body = await parseJson(loginResponse);
    expect(body.access_token).toBeTruthy();

    const invalidResponse = await authApi.post('/users/login', {
      email: user.email,
      password: 'WrongPassword@99',
    });
    expect(invalidResponse.status()).toBeGreaterThanOrEqual(400);
  });
});
