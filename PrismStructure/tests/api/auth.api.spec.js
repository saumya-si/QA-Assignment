import { test, expect } from '../../fixtures/testFixtures.js';
import { assertStatus, parseJson } from '../../utils/apiHelper.js';
import { createUser, getCustomerCredentials } from '../../utils/testDataFactory.js';
import { assertErrorResponse } from '../../utils/apiNegativeHelper.js';

test.describe('Authentication API', () => {
  test('TC-API-01 @Smoke @Regression Register valid user and reject duplicate email', async ({ authApi }) => {
    const user = createUser();
    const registerResponse = await authApi.register(user);
    assertStatus(registerResponse, 201);

    const creds = getCustomerCredentials();
    const duplicateResponse = await authApi.register({ ...user, email: creds.email });
    await assertErrorResponse(duplicateResponse, [409, 422], /email|duplicate|already|taken/i);
  });

  test('TC-API-02 @Smoke @positive Valid login returns bearer token', async ({ authApi, testUser }) => {
    await authApi.register(testUser);

    const loginResponse = await authApi.login(testUser.email, testUser.password);
    assertStatus(loginResponse, 200);
    const body = await parseJson(loginResponse);
    expect(body.access_token).toBeTruthy();
    expect(body.token_type?.toLowerCase()).toBe('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });
});
