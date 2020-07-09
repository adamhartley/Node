const express = require('express');
const path = require('path');

const commonController = require('../controllers/common')
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct) // the colon tells Express to expect a dynamic segment in the request

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, commonController.getInvoice)

router.get('/checkout', shopController.getCheckout);

module.exports = router;