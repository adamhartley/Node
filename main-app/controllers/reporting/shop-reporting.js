/*
 * NoSQL Shop controller
 */

const ProductReporting = require('../../models/reporting/product')

exports.getProductsReporting = (req, res, next) => {
    ProductReporting.fetchAll()
        .then(products => {
            console.log('Fetched NoSQL Products');
            console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/reporting/products'
            })
        })
        .catch(err => {
            console.log(err);
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
                reporting: true
            })
        })
        .catch(err => {
            console.log(err)
        });
}