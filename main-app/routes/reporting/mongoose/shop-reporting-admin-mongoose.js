const express = require('express');
const {body} = require('express-validator/check')
const path = require('path');

const mongooseAdminController = require('../../../controllers/reporting/mongoose/admin-reporting-mongoose');
const isAuth = require('../../../middleware/is-auth')

const router = express.Router();

router.get('/add-product', isAuth, mongooseAdminController.getAddProduct);

router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({min: 3})
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 5, max: 500})
            .trim()
    ],
    isAuth,
    mongooseAdminController.postAddProduct);

router.get('/products', isAuth, mongooseAdminController.getProducts);

router.get('/edit-product/:productId', isAuth, mongooseAdminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isAlphanumeric()
            .isLength({min: 3})
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 5, max: 500})
            .trim()
    ],
    isAuth,
    mongooseAdminController.postEditProduct);

router.post('/delete-product', isAuth, mongooseAdminController.postDeleteProduct)

module.exports = router;