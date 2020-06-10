const express = require('express');
const path = require('path');

const shopReportingController = require('../../controllers/reporting/shop-reporting')
const isAuth = require('../../middleware/is-auth')

const router = express.Router();

// /reporting/products => GET
router.get('/products', shopReportingController.getProductsReporting);

router.get('/products/:productId', shopReportingController.getProduct) // the colon tells Express to expect a dynamic segment in the request

router.get('/cart', isAuth, shopReportingController.getCart);

router.post('/cart', isAuth, shopReportingController.postCart);

router.post('/cart-delete-item', isAuth, shopReportingController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopReportingController.postOrder);

router.get('/orders', isAuth, shopReportingController.getOrders);

module.exports = router;