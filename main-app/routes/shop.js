const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// / => GET
router.get('/', shopController.getIndex);
// /products => GET
router.get('/products', shopController.getProducts);
// /products/{id} => GET
router.get('/products/:productId', shopController.getProduct) // the colon tells Express to expect a dynamic segment in the request
// /cart => GET
router.get('/cart', isAuth, shopController.getCart);
// /cart => POST
router.post('/cart', isAuth, shopController.postCart);
// /cart-delete-item => POST
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
// /create-order => POST
router.post('/create-order', isAuth, shopController.postOrder);
// /orders => GET
router.get('/orders', isAuth, shopController.getOrders);
// /checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;