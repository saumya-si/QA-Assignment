import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
import { env } from '../config/env.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDataPath = path.resolve(__dirname, '../../test-data/static-test-data.json');
const staticData = JSON.parse(fs.readFileSync(staticDataPath, 'utf-8'));

export function createBillingAddress(cartId) {
  return { ...staticData.billing, cart_id: cartId };
}

export function getSearchKeyword() {
  return staticData.search.validKeyword;
}

export function createUser(overrides = {}) {
  const timestamp = Date.now();
  const password = env.testUserPassword();
  const dob = faker.date.birthdate({ min: staticData.user.dobMinAge, max: staticData.user.dobMaxAge, mode: 'age' });
  const dobFormatted = dob.toISOString().split('T')[0];

  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: `testuser_${timestamp}@example.com`,
    password,
    dob: dobFormatted,
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      house_number: String(faker.number.int({ min: 1, max: 200 })),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'US',
      postal_code: faker.location.zipCode(),
    },
    ...overrides,
  };
}

export function getCustomerCredentials() {
  return {
    email: env.customerEmail(),
    password: env.customerPassword(),
  };
}

export async function getFirstInStockProductId(request) {
  const response = await request.get(`${env.apiBaseUrl}/products`);
  const body = await response.json();
  const products = body.data || body;
  const inStock = products.find((p) => p.in_stock !== false);
  if (!inStock) throw new Error('No in-stock product found');
  return inStock.id;
}

export { staticData };
