import { test } from '../../fixtures/testFixtures.js';
import { assertStatus } from '../../utils/apiHelper.js';
import { createUser } from '../../utils/testDataFactory.js';
import {
  authenticateForPurchase,
  createShoppingCart,
  addProductToCart,
  validateCartContents,
  discoverInStockProducts,
  updateCartLineQuantity,
} from '../../utils/apiLifecycleHelper.js';

test.describe('Cart API', () => {
  test('TC-API-03 @Smoke @positive Create cart add product and verify contents', async ({
    authApi,
    productApi,
    cartApi,
    testUser,
  }) => {
    await authenticateForPurchase(authApi, testUser, productApi, cartApi);
    const [product] = await discoverInStockProducts(productApi, 1);

    const cartId = await createShoppingCart(cartApi);
    await addProductToCart(cartApi, cartId, product.id, 1);
    await validateCartContents(cartApi, cartId, [{ productId: product.id, quantity: 1 }]);
  });

  test('TC-API-04 @Regression @positive Update product quantity and verify cart', async ({
    authApi,
    productApi,
    cartApi,
    testUser,
  }) => {
    await authenticateForPurchase(authApi, testUser, productApi, cartApi);
    const [product] = await discoverInStockProducts(productApi, 1);

    const cartId = await createShoppingCart(cartApi);
    await addProductToCart(cartApi, cartId, product.id, 1);
    await updateCartLineQuantity(cartApi, cartId, product.id, 2);
  });
});
