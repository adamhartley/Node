const express = require('express');
const path = require('path');

const shopReportingController = require('../../controllers/reporting/shop-reporting')

const router = express.Router();

// /reporting/products => GET
router.get('/products', shopReportingController.getProductsReporting);

router.get('/products/:productId', shopReportingController.getProduct) // the colon tells Express to expect a dynamic segment in the request

router.get('/cart', shopReportingController.getCart);

router.post('/cart', shopReportingController.postCart);

router.post('/cart-delete-item', shopReportingController.postCartDeleteProduct);

router.post('/create-order', shopReportingController.postOrder);

router.get('/orders', shopReportingController.getOrders);

module.exports = router;