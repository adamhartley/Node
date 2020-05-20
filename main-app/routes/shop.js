const express = require('express');
const path = require('path');

const shopController = require('../controllers/shop')

const router = express.Router();

// / => GET
router.get('/', shopController.getIndex);
// /products => GET
router.get('/products', shopController.getProducts);
// /products/{id} => GET
router.get('/products/:productId', shopController.getProduct) // the colon tells Express to expect a dynamic segment in the request
// /cart => GET
router.get('/cart', shopController.getCart);
// /orders => GET
router.get('/orders', shopController.getOrders);
// /checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;