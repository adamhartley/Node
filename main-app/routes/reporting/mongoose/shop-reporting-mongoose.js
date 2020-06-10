const express = require('express');
const path = require('path');

const mongooseController = require('../../../controllers/reporting/mongoose/shop-reporting-mongoose');
const isAuth = require('../../../middleware/is-auth');

const router = express.Router();

router.get('/products', mongooseController.getProducts);

router.get('/products/:productId', mongooseController.getProduct) // the colon tells Express to expect a dynamic segment in the request

router.get('/cart', isAuth, mongooseController.getCart);

router.post('/cart', isAuth, mongooseController.postCart);

router.post('/cart-delete-item', isAuth, mongooseController.postCartDeleteProduct);

router.post('/create-order', isAuth, mongooseController.postOrder);

router.get('/orders', isAuth, mongooseController.getOrders);


module.exports = router;