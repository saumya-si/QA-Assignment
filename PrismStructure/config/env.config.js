import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and set values.`);
  }
  return value;
}

function optionalEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

export const env = {
  baseUrl: optionalEnv('BASE_URL', 'https://practicesoftwaretesting.com'),
  apiBaseUrl: optionalEnv('API_BASE_URL', 'https://api.practicesoftwaretesting.com'),
  testUserPassword: () => requireEnv('TEST_USER_PASSWORD'),
  customerEmail: () => optionalEnv('TEST_CUSTOMER_EMAIL', 'customer@practicesoftwaretesting.com'),
  customerPassword: () => requireEnv('TEST_CUSTOMER_PASSWORD'),
};

export default env;
