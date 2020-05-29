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