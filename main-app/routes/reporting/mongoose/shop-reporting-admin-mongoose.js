const express = require('express');
const path = require('path');

const mongooseAdminController = require('../../../controllers/reporting/mongoose/admin-reporting-mongoose');

const router = express.Router();

router.get('/add-product', mongooseAdminController.getAddProduct);

router.post('/add-product', mongooseAdminController.postAddProduct);

router.get('/products', mongooseAdminController.getProducts);

router.get('/edit-product/:productId', mongooseAdminController.getEditProduct);

router.post('/edit-product', mongooseAdminController.postEditProduct);

router.post('/delete-product', mongooseAdminController.postDeleteProduct)

module.exports = router;