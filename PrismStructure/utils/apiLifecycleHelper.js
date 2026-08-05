import { expect } from '@playwright/test';
import {
  assertStatus,
  assertStatusIn,
  parseJson,
  extractPaginatedData,
  propagateToken,
} from './apiHelper.js';
import { createBillingAddress } from './testDataFactory.js';

/**
 * Registers a user and validates the 201 response body.
 */
export async function registerUser(authApi, user) {
  const response = await authApi.register(user);
  assertStatus(response, 201);
  const registered = await parseJson(response);
  expect(registered.id).toBeTruthy();
  expect(registered.email).toBe(user.email);
  expect(registered.first_name).toBe(user.first_name);
  expect(registered.last_name).toBe(user.last_name);
  return registered;
}

/**
 * Logs in and returns token payload; sets token on authApi.
 */
export async function loginUser(authApi, user) {
  const response = await authApi.login(user.email, user.password);
  assertStatus(response, 200);
  const tokenPayload = await parseJson(response);
  expect(tokenPayload.access_token).toBeTruthy();
  expect(tokenPayload.token_type?.toLowerCase()).toBe('bearer');
  expect(tokenPayload.expires_in).toBeGreaterThan(0);
  authApi.setToken(tokenPayload.access_token);
  return tokenPayload;
}

/**
 * Authenticates API clients for the purchase lifecycle.
 */
export async function authenticateForPurchase(authApi, user, ...clients) {
  await registerUser(authApi, user);
  const tokenPayload = await loginUser(authApi, user);
  propagateToken(tokenPayload.access_token, ...clients);

  const profileResponse = await authApi.getProfile();
  assertStatus(profileResponse, 200);
  const profile = await parseJson(profileResponse);
  expect(profile.email).toBe(user.email);

  return tokenPayload;
}

/**
 * Retrieves product list and returns in-stock products.
 */
export async function discoverInStockProducts(productApi, limit = 2) {
  const response = await productApi.getProducts();
  assertStatus(response, 200);
  const body = await parseJson(response);
  const products = extractPaginatedData(body).filter((product) => product.in_stock !== false);
  expect(products.length).toBeGreaterThanOrEqual(limit);
  return products.slice(0, limit);
}

/**
 * Fetches and validates a single product by ID.
 */
export async function retrieveProductDetails(productApi, productId) {
  const response = await productApi.getProduct(productId);
  assertStatus(response, 200);
  const product = await parseJson(response);
  expect(product.id).toBe(productId);
  expect(product.name).toBeTruthy();
  expect(typeof product.price).toBe('number');
  expect(product.in_stock).toBe(true);
  return product;
}

/**
 * Creates a new cart and returns its ID.
 */
export async function createShoppingCart(cartApi) {
  const response = await cartApi.createCart();
  assertStatus(response, 201);
  const body = await parseJson(response);
  expect(body.id).toBeTruthy();
  return body.id;
}

/**
 * Adds a product to the cart (documented: POST /carts/{id}).
 */
export async function addProductToCart(cartApi, cartId, productId, quantity = 1) {
  const response = await cartApi.addProduct(cartId, productId, quantity);
  assertStatus(response, 200);
  const body = await parseJson(response);
  expect(body.result).toMatch(/item added/i);
}

/**
 * Validates cart line items match expected product IDs and quantities.
 */
export async function validateCartContents(cartApi, cartId, expectedItems) {
  const response = await cartApi.getCart(cartId);
  assertStatus(response, 200);
  const cart = await parseJson(response);
  expect(cart.id).toBe(cartId);
  expect(Array.isArray(cart.cart_items)).toBe(true);
  expect(cart.cart_items.length).toBe(expectedItems.length);

  for (const expected of expectedItems) {
    const line = cart.cart_items.find((item) => item.product_id === expected.productId);
    expect(line, `cart missing product ${expected.productId}`).toBeTruthy();
    expect(line.quantity).toBe(expected.quantity);
    expect(line.product?.id).toBe(expected.productId);
    expect(line.product?.name).toBeTruthy();
  }

  return cart;
}

/**
 * Updates cart line quantity and validates via GET cart.
 */
export async function updateCartLineQuantity(cartApi, cartId, productId, quantity) {
  const response = await cartApi.updateQuantity(cartId, productId, quantity);
  assertStatus(response, 200);
  return validateCartContents(cartApi, cartId, [{ productId, quantity }]);
}

/**
 * Creates a COD invoice for the given cart.
 */
export async function generateInvoice(invoiceApi, cartId, billingOverrides = {}) {
  const payload = { ...createBillingAddress(cartId), ...billingOverrides };
  const response = await invoiceApi.createInvoice(payload);
  assertStatusIn(response, [200, 201]);
  let invoice = await parseJson(response);
  expect(invoice.id).toBeTruthy();
  expect(invoice.invoice_number).toMatch(/^INV-/);
  expect(invoice.total).toBeGreaterThan(0);

  if (!Array.isArray(invoice.invoicelines) || invoice.invoicelines.length === 0) {
    const detailResponse = await invoiceApi.getInvoice(invoice.id);
    assertStatus(detailResponse, 200);
    invoice = await parseJson(detailResponse);
  }

  expect(Array.isArray(invoice.invoicelines)).toBe(true);
  expect(invoice.invoicelines.length).toBeGreaterThan(0);
  return invoice;
}

/**
 * Asserts the invoice appears in the authenticated user's invoice list.
 */
export async function verifyInvoiceInList(invoiceApi, invoiceId) {
  const response = await invoiceApi.getInvoices();
  assertStatus(response, 200);
  const body = await parseJson(response);
  const invoices = extractPaginatedData(body);
  const match = invoices.find((invoice) => invoice.id === invoiceId);
  expect(match, `invoice ${invoiceId} not in list`).toBeTruthy();
  return match;
}

/**
 * Full API purchase lifecycle: register → login → products → cart → invoice.
 */
export async function runApiPurchaseLifecycle({
  authApi,
  productApi,
  cartApi,
  invoiceApi,
  testUser,
  productCount = 2,
  quantities = [1, 2],
}) {
  await authenticateForPurchase(authApi, testUser, productApi, cartApi, invoiceApi);

  const catalogProducts = await discoverInStockProducts(productApi, productCount);
  const productDetails = await Promise.all(
    catalogProducts.map((product) => retrieveProductDetails(productApi, product.id))
  );

  const cartId = await createShoppingCart(cartApi);
  const expectedItems = [];

  for (let index = 0; index < catalogProducts.length; index += 1) {
    const quantity = quantities[index] ?? 1;
    await addProductToCart(cartApi, cartId, catalogProducts[index].id, quantity);
    expectedItems.push({ productId: catalogProducts[index].id, quantity });
  }

  const cart = await validateCartContents(cartApi, cartId, expectedItems);
  const invoice = await generateInvoice(invoiceApi, cartId);
  const listedInvoice = await verifyInvoiceInList(invoiceApi, invoice.id);
  expect(listedInvoice.invoice_number).toBe(invoice.invoice_number);
  expect(listedInvoice.total).toBe(invoice.total);

  return {
    testUser,
    cartId,
    cart,
    invoice,
    products: productDetails,
    expectedItems,
  };
}
