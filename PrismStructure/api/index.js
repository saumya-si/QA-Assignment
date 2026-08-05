import { env } from '../config/env.config.js';

export class BaseApiClient {
  constructor(request) {
    this.request = request;
    this.apiBaseUrl = env.apiBaseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  headers(extra = {}) {
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json', ...extra };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get(path) {
    return this.request.get(`${this.apiBaseUrl}${path}`, { headers: this.headers() });
  }

  async post(path, data) {
    return this.request.post(`${this.apiBaseUrl}${path}`, { headers: this.headers(), data });
  }

  async put(path, data) {
    return this.request.put(`${this.apiBaseUrl}${path}`, { headers: this.headers(), data });
  }

  async delete(path) {
    return this.request.delete(`${this.apiBaseUrl}${path}`, { headers: this.headers() });
  }
}

export class AuthApiPage extends BaseApiClient {
  async register(user) {
    return this.post('/users/register', user);
  }

  async login(email, password) {
    const response = await this.post('/users/login', { email, password });
    if (response.ok()) {
      const body = await response.json();
      this.setToken(body.access_token);
    }
    return response;
  }

  async getProfile() {
    return this.get('/users/me');
  }
}

export class ProductApiPage extends BaseApiClient {
  async getProducts() {
    return this.get('/products');
  }

  async getProduct(productId) {
    return this.get(`/products/${productId}`);
  }

  async searchProducts(term) {
    return this.get(`/products/search?q=${encodeURIComponent(term)}`);
  }
}

export class CartApiPage extends BaseApiClient {
  async createCart() {
    return this.post('/carts', {});
  }

  async addProduct(cartId, productId, quantity = 1) {
    return this.post(`/carts/${cartId}`, { product_id: productId, quantity });
  }

  async updateQuantity(cartId, productId, quantity) {
    return this.put(`/carts/${cartId}/product/quantity`, { product_id: productId, quantity });
  }

  async getCart(cartId) {
    return this.get(`/carts/${cartId}`);
  }
}

export class InvoiceApiPage extends BaseApiClient {
  async createInvoice(billingPayload) {
    return this.post('/invoices', billingPayload);
  }

  async getInvoices(page) {
    const query = page != null ? `?page=${page}` : '';
    return this.get(`/invoices${query}`);
  }

  async getInvoice(invoiceId) {
    return this.get(`/invoices/${invoiceId}`);
  }
}
