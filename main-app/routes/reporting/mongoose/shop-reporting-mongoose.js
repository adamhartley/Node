const express = require('express');
const path = require('path');

const mongooseController = require('../../../controllers/reporting/mongoose/shop-reporting-mongoose');

const router = express.Router();

router.get('/products', mongooseController.getProducts);

router.get('/products/:productId', mongooseController.getProduct) // the colon tells Express to expect a dynamic segment in the request

router.get('/cart', mongooseController.getCart);

router.post('/cart', mongooseController.postCart);

router.post('/cart-delete-item', mongooseController.postCartDeleteProduct);

module.exports = router;