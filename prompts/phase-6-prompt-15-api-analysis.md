# Phase 6 — Prompt 15: API Analysis

**Prompt:** Review the available API documentation and identify available endpoints, authentication mechanism, request/response structure, and expected HTTP status codes. Base the analysis **only** on documented API specifications.

**Source:** [Toolshop API documentation](https://api.practicesoftwaretesting.com/api/documentation)  
**OpenAPI spec:** OpenAPI **3.2.0**, title **Toolshop API**, version **5.0.0**  
**Base URL (deployed):** `https://api.practicesoftwaretesting.com`

---

## 1. Authentication Mechanism

Documented in `components.securitySchemes.apiAuth`:

| Property | Documented value |
|----------|------------------|
| Type | `http` |
| Scheme | `bearer` |
| Bearer format | `JWT` |
| Description | *"Login with email and password to get the authentication token"* |

### Token acquisition

**`POST /users/login`** (no `security` requirement on this operation)

**Request body** (`AccountRequest`):

| Field | Type | Required |
|-------|------|----------|
| `email` | string | yes |
| `password` | string | yes |

**Success response `200`** (`TokenResponse`):

| Field | Type | Example |
|-------|------|---------|
| `access_token` | string | `super-secret-token` |
| `token_type` | string | `Bearer` |
| `expires_in` | number | `120` |

### Authenticated requests

Operations that declare `security: [{ apiAuth: [] }]` expect:

```
Authorization: Bearer <access_token>
```

Documented token lifecycle endpoints:

| Method | Path | Purpose | Documented success codes |
|--------|------|---------|--------------------------|
| GET | `/users/me` | Current customer profile | 200 |
| GET | `/users/refresh` | Refreshed token | 200 |
| GET | `/users/logout` | Invalidate token | 200 |

---

## 2. Available Endpoints (Documented)

All paths and methods below are taken directly from the OpenAPI `paths` object. **🔒** = operation declares `security: [{ apiAuth: [] }]`.

### Brand

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/brands` | Retrieve all brands | 200, 404, 405 |
| POST | `/brands` | Store new brand | 201, 404, 405, 409, 422 |
| GET | `/brands/search` | Search brands | 200, 404, 405 |
| QUERY | `/brands/search` | Search brands (HTTP QUERY) | 200, 415 |
| GET | `/brands/{brandId}` | Retrieve specific brand | 200, 404, 405 |
| PUT | `/brands/{brandId}` | Update specific brand | 200, 404, 405, 409, 422 |
| PATCH | `/brands/{brandId}` | Partially update brand | 200, 404, 405, 409, 422 |
| DELETE | `/brands/{brandId}` | Delete brand (admin required per description) | 204, 401, 404, 409, 405, 422 |

### Cart

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| POST | `/carts` | Create a new cart | 201, 404, 405, 422 |
| POST | `/carts/{id}` | Add item to cart | 200, 404, 405, 422 |
| GET | `/carts/{cartId}` | Retrieve specific cart | 200, 404, 405 |
| DELETE | `/carts/{cartId}` | Delete cart | 204, 401, 404, 409, 405, 422 |
| PUT | `/carts/{cartId}/product/quantity` | Update item quantity | 200, 404, 405, 422 |
| DELETE | `/carts/{cartId}/product/{productId}` | Remove product from cart | 204, 401, 404, 409, 405, 422 |

### Category

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/categories` | Retrieve all categories | 200, 404, 405 |
| POST | `/categories` | Store new category | 201, 404, 405, 409, 422 |
| GET | `/categories/search` | Search categories | 200, 404, 405 |
| QUERY | `/categories/search` | Search categories (HTTP QUERY) | 200, 415 |
| GET | `/categories/tree` | Categories including subcategories | 200, 404, 405 |
| QUERY | `/categories/tree` | Category tree (HTTP QUERY) | 200, 415 |
| GET | `/categories/tree/{categoryId}` | Specific category tree | 200, 404, 405 |
| PUT | `/categories/{categoryId}` | Update category | 200, 404, 405, 409, 422 |
| PATCH | `/categories/{categoryId}` | Partial update category | 200, 404, 405, 409, 422 |
| DELETE | `/categories/{categoryId}` | Delete category | 204, 401, 404, 409, 405, 422 |

### Contact (messages)

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/messages` | Retrieve messages | 200, 401, 404, 405 🔒 |
| POST | `/messages` | Send contact message | 200, 404, 405 |
| GET | `/messages/{messageId}` | Retrieve message | 200, 401, 404, 405 🔒 |
| POST | `/messages/{messageId}/attach-file` | Attach file | 200, 404, 405 |
| POST | `/messages/{messageId}/reply` | Reply to message | 200, 401, 404, 405 🔒 |
| PUT | `/messages/{messageId}/status` | Set message status | 200, 401, 404, 405 🔒 |

### Favorite

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/favorites` | Retrieve all favorites | 200, 401, 404, 405 🔒 |
| POST | `/favorites` | Store favorite | 200, 401, 404, 405, 409, 422 🔒 |
| GET | `/favorites/{favoriteId}` | Retrieve favorite | 200, 401, 404, 405 🔒 |
| DELETE | `/favorites/{favoriteId}` | Delete favorite | 204, 401, 404, 409, 405, 422 🔒 |

### Image

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/images` | Retrieve all images | 200, 404, 405 |

### Invoice

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/invoices` | List invoices (admin: all; user: own) | 200, 401, 404, 405 🔒 |
| POST | `/invoices` | Store new invoice | 200, 401, 404, 405, 422 🔒 |
| POST | `/invoices/guest` | Guest checkout invoice | 200, 422 |
| GET | `/invoices/search` | Search invoices | 200, 401, 404, 405 🔒 |
| QUERY | `/invoices/search` | Search invoices (HTTP QUERY) | 200, 401, 415 🔒 |
| GET | `/invoices/{invoiceId}` | Retrieve invoice | 200, 401, 404, 405 🔒 |
| PUT | `/invoices/{invoiceId}` | Update invoice | 200, 401, 404, 405, 422 🔒 |
| PATCH | `/invoices/{invoiceId}` | Partial update invoice | 200, 401, 404, 405, 422 🔒 |
| PUT | `/invoices/{invoiceId}/status` | Update invoice status | 200, 401, 404, 405, 422 🔒 |
| GET | `/invoices/{invoice_number}/download-pdf` | Download invoice PDF | 200, 401, 404, 405 🔒 |
| GET | `/invoices/{invoice_number}/download-pdf-status` | PDF generation status | 200, 401, 404, 405 🔒 |

### Payment

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| POST | `/payment/check` | Check payment | 200 |

### Postcode

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/postcode-lookup` | Lookup address by postcode | 200, 422, 502 |

### Product

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/products` | Retrieve all products | 200, 404, 405 |
| POST | `/products` | Store new product | 200, 404, 405, 422 |
| QUERY | `/products` | Filter products (HTTP QUERY) | 200, 415 |
| GET | `/products/search` | Search products (`name` column) | 200, 404, 405 |
| QUERY | `/products/search` | Search products (HTTP QUERY) | 200, 415 |
| GET | `/products/{productId}` | Retrieve product | 200, 404, 405 |
| PUT | `/products/{productId}` | Update product | 200, 404, 405, 422 |
| PATCH | `/products/{productId}` | Partial update product | 200, 404, 405, 422 |
| DELETE | `/products/{productId}` | Delete product | 204, 401, 404, 409, 405, 422 |
| GET | `/products/{productId}/related` | Related products | 200, 404, 405 |

**GET `/products` query parameters (documented):** `by_brand`, `by_category`, `is_rental`, `between`, `sort`, `page`

**GET `/products/search` query parameters:** `q` (required), `page`

### Product Spec

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/product-specs/names` | Distinct spec names/values | 200 |
| GET | `/products/{productId}/specs` | Specs for product | 200 |
| POST | `/products/{productId}/specs` | Add spec | 201, 401, 422 🔒 |
| GET | `/products/{productId}/specs/{specId}` | Specific spec | 200 |
| PUT | `/products/{productId}/specs/{specId}` | Update spec | 200, 401 🔒 |
| DELETE | `/products/{productId}/specs/{specId}` | Delete spec | 204, 401 🔒 |

### Report

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/reports/total-sales-per-country` | Total sales per country | 200, 401, 404 🔒 |
| GET | `/reports/top10-purchased-products` | Top 10 purchased products | 200, 401, 404 🔒 |
| GET | `/reports/top10-best-selling-categories` | Top 10 categories | 200, 401, 404 🔒 |
| GET | `/reports/total-sales-of-years` | Total sales by year | 200, 401, 404 🔒 |
| GET | `/reports/average-sales-per-month` | Avg sales per month | 200, 401, 404 🔒 |
| GET | `/reports/average-sales-per-week` | Avg sales per week | 200, 401, 404 🔒 |
| GET | `/reports/customers-by-country` | Customers by country | 200, 401, 404 🔒 |

### TOTP

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| POST | `/totp/setup` | Setup TOTP | 200, 400 🔒 |
| POST | `/totp/verify` | Verify TOTP code | 200, 400 🔒 |

### User

| Method | Path | Summary | Status codes |
|--------|------|---------|--------------|
| GET | `/users` | Retrieve all users (paginated) | 200, 400, 401 🔒 |
| POST | `/users/register` | Register new user | 201, 400, 401, 409, 403 |
| POST | `/users/login` | Login customer | **200 only** |
| POST | `/users/forgot-password` | Request password reset | 200, 401, 400, 403 |
| POST | `/users/change-password` | Change password | 200, 401 🔒 |
| GET | `/users/me` | Current customer info | 200, 401 🔒 |
| GET | `/users/logout` | Logout | 200, 400, 401 🔒 |
| GET | `/users/refresh` | Refresh token | 200, 400, 401 🔒 |
| GET | `/users/search` | Search users | 200, 401, 404 🔒 |
| QUERY | `/users/search` | Search users (HTTP QUERY) | 200, 401, 415 🔒 |
| GET | `/users/{userId}` | Retrieve user | 200, 401, 404, 405 🔒 |
| PUT | `/users/{userId}` | Update user | 200, 401, 405, 409, 422, 403 🔒 |
| PATCH | `/users/{userId}` | Partial update user | 200, 401, 405, 409, 422, 403 🔒 |
| DELETE | `/users/{userId}` | Delete user | 204, 401, 404, 409, 405, 403 🔒 |

---

## 3. Request & Response Structures (Assessment-Critical)

### `POST /users/register` → `UserRequest` / `UserResponse`

**Required fields:** `first_name`, `last_name`, `email`, `password`

| Field | Constraints (documented) |
|-------|--------------------------|
| `first_name` | string, maxLength 40 |
| `last_name` | string, maxLength 20 |
| `email` | string (email), maxLength 256 |
| `password` | string, minLength 8; description: uppercase, lowercase, number, symbol |
| `dob` | string (date); valid date between 18 and 75 years ago |
| `phone` | string, maxLength 24 |
| `address` | object: `street` (70), `house_number` (10), `city` (40), `state` (40), `country` (40), `postal_code` (10) |

**Success `201`:** `UserResponse` (includes `id`, `first_name`, `last_name`, `email`, `address`, `phone`, `dob`, `enabled`, `created_at`, etc.)

### `POST /users/login` → `TokenResponse`

See §1.

### `POST /carts` → `CartCreatedResponse`

**Success `201`:**

```json
{ "id": "1234" }
```

### `POST /carts/{id}` — Add item

**Required body:**

```json
{
  "product_id": "01HHJC7RERZ0M3VDGS6X9HM33A",
  "quantity": 1
}
```

**Success `200` (`CartItemAddedResponse`):**

```json
{ "result": "item added or updated" }
```

### `PUT /carts/{cartId}/product/quantity`

**Required body:** same as add-item (`product_id`, `quantity`)

**Success `200`:** `UpdateResponse` → `{ "success": true }`

### `GET /carts/{cartId}` → `CartResponse`

Documented properties: `id` (string). *(Full cart line items are not expanded in the `CartResponse` schema definition.)*

### `GET /products` → `PaginatedProductResponse`

```json
{
  "current_page": 1,
  "data": [ /* ProductResponse[] */ ],
  "from": 1,
  "last_page": 1,
  "per_page": 1,
  "to": 1,
  "total": 1
}
```

**`ProductResponse` fields (documented):** `id`, `name`, `description`, `price`, `is_location_offer`, `is_rental`, `in_stock`, `co2_rating`, `is_eco_friendly`, `brand`, `category`, `product_image`

### `POST /invoices` → `InvoiceRequest` / `InvoiceResponse`

**Required fields:** `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `payment_method`, `payment_details`, `cart_id`

**`payment_method` enum:** `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card`

**`payment_details`:** object with `oneOf` schemas — `BankTransferDetails`, `CreditCardDetails`, `GiftCardDetails`, `BuyNowPayLaterDetails`, or empty `CashOnDeliveryDetails` object

**Success `200` (`InvoiceResponse`):** `id`, `user_id`, `invoice_date`, `invoice_number`, billing fields, `subtotal`, `total`, `status`, `invoicelines[]`, `created_at`

### `GET /invoices` → `PaginatedInvoiceResponse`

Same pagination shape as products; `data` is `InvoiceResponse[]`.

### `POST /invoices/guest`

Extends `InvoiceRequest` with optional `guest_email`, `guest_first_name`, `guest_last_name`.

---

## 4. Documented HTTP Status Codes (Shared Responses)

Reusable response components in `components.responses`:

| Code | Component | Description (documented) | Body shape |
|------|-----------|--------------------------|------------|
| **200** | — | Successful operation (per endpoint) | Varies by schema |
| **201** | — | Created (register, cart, category, brand, product spec) | Varies |
| **204** | — | Successful, no content (deletes) | — |
| **400** | — | Bad Request (some user endpoints) | — |
| **401** | `UnauthorizedResponse` | User not authenticated | `{ "message": "Unauthorized" }` |
| **403** | — | Forbidden (register, user update/delete) | — |
| **404** | `ItemNotFoundResponse` / `ResourceNotFoundResponse` | Resource not found | `{ "message": "Requested item not found" }` or `{ "message": "Resource not found" }` |
| **405** | `MethodNotAllowedResponse` | Method not allowed | `{ "message": "Method is not allowed for the requested route" }` |
| **409** | `DuplicateConflictResponse` / `ConflictResponse` | Duplicate or conflict | Field-level MessageBag or single message (409); conflict description only (409 alt) |
| **415** | — | Unsupported Media Type (HTTP QUERY endpoints) | Criteria must be `application/json` |
| **422** | `UnprocessableEntityResponse` | Server unable to process content | — |
| **502** | — | Bad gateway (`/postcode-lookup` only) | — |

### Notable spec gaps (documented only)

- **`POST /users/login`** documents **only `200`** — no error status codes are listed for invalid credentials.
- **`GET /products`**, **`POST /carts`**, and **`POST /carts/{id}`** have **no `security`** requirement in the spec (public per documentation).
- **`POST /invoices`** documents success as **`200`**, not `201`.

---

## 5. Assessment API Flow Mapping (Documented Endpoints Only)

| Assessment AC step | Documented endpoint(s) |
|--------------------|----------------------|
| Register via API | `POST /users/register` |
| Login + bearer token | `POST /users/login` |
| Verify profile | `GET /users/me` 🔒 |
| Create cart | `POST /carts` |
| Retrieve products | `GET /products` or `GET /products/search?q=` |
| Add to cart | `POST /carts/{id}` |
| Update quantity | `PUT /carts/{cartId}/product/quantity` |
| Verify cart | `GET /carts/{cartId}` |
| Generate invoice (COD) | `POST /invoices` 🔒 with `payment_method: "cash-on-delivery"` |
| List invoices | `GET /invoices` 🔒 |

---

## AI Response Summary

Reviewed Toolshop API **v5.0.0** OpenAPI specification. Identified **14 resource tags**, **~90 documented operations** (including HTTP QUERY variants), **Bearer JWT (`apiAuth`)** authentication obtained via `POST /users/login`, detailed request/response schemas for user registration, cart lifecycle, product listing, and invoice creation, and per-endpoint documented status codes including shared 401/404/409/422 response components. Analysis strictly reflects published spec content with no undocumented assumptions.
