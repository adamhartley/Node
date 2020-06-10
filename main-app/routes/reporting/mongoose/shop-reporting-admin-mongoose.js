const express = require('express');
const path = require('path');

const mongooseAdminController = require('../../../controllers/reporting/mongoose/admin-reporting-mongoose');
const isAuth = require('../../../middleware/is-auth')

const router = express.Router();

router.get('/add-product', isAuth, mongooseAdminController.getAddProduct);

router.post('/add-product', isAuth, mongooseAdminController.postAddProduct);

router.get('/products', isAuth, mongooseAdminController.getProducts);

router.get('/edit-product/:productId', isAuth, mongooseAdminController.getEditProduct);

router.post('/edit-product', isAuth, mongooseAdminController.postEditProduct);

router.post('/delete-product', isAuth, mongooseAdminController.postDeleteProduct)

module.exports = router;