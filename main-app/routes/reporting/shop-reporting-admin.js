const express = require('express');
const path = require('path');

const shopReportingController = require('../../controllers/reporting/admin-reporting')
const isAuth = require('../../middleware/is-auth')

const router = express.Router();

router.get('/add-product', isAuth, shopReportingController.getAddProduct)

router.post('/add-product', isAuth, shopReportingController.postReportingAddProduct)

router.get('/products', isAuth, shopReportingController.getProducts)

router.get('/edit-product/:productId', isAuth, shopReportingController.getEditProduct)

router.post('/edit-product', isAuth, shopReportingController.postEditProduct)

router.post('/delete-product', isAuth, shopReportingController.postDeleteProduct)

module.exports = router;