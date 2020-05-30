const express = require('express');
const path = require('path');

const shopReportingController = require('../../controllers/reporting/admin-reporting')

const router = express.Router();

router.get('/add-product', shopReportingController.getAddProduct);

router.post('/add-product', shopReportingController.postReportingAddProduct);

router.get('/products', shopReportingController.getProducts);

router.get('/edit-product/:productId', shopReportingController.getEditProduct);

router.post('/edit-product', shopReportingController.postEditProduct)

router.post('/delete-product', shopReportingController.postDeleteProduct)

module.exports = router;