/*
 * NoSQL Shop controller
 */

const ProductReporting = require('../../models/reporting/product')
const {ITEMS_PER_PAGE} = require('../constants')

exports.getProductsReporting = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    ProductReporting.getCount()
        .then(count => {
            totalItems = count;
            return ProductReporting.fetchRange((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
        })
        .then(products => {
            console.log('Fetched NoSQL Products');
            console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/reporting/products',
                reporting: true,
                useMongoose: false,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    ProductReporting.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: 'reporting/products'
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

/*
 * Adds an product to the cart
 */
exports.postCart = (req, res, next) => {
    console.log('posting to reporting cart')
    const prodId = req.body.productId;
    ProductReporting.findById(prodId)
        .then(product => {
            return req.reportingUser.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/reporting/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getCart = (req, res, next) => {
    console.log('reporting controller getCart()');
    req.reportingUser.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/reporting/cart',
                pageTitle: 'Your Cart',
                products: products,
                reporting: true,
                useMongoose: false
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

/*
 * Deletes a product from the cart
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.reportingUser.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/reporting/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    console.log('Creating reporting order...')
    req.reportingUser.addOrder()
        .then(result => {
            res.redirect('/reporting/orders');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getOrders = (req, res, next) => {
    req.reportingUser.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/reporting/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                reporting: true,
                useMongoose: false
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}