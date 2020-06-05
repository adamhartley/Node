const Product = require('../../../models/reporting/mongoose/product');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            console.log('Fetched Mongoose Products');
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Mongoose Products',
                path: '/reporting/mongoose/products',
                reporting: true,
                useMongoose: true
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: 'reporting/mongoose/products'
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
    console.log('posting to mongoose cart')
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.mongooseUser.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/reporting/mongoose/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCart = (req, res, next) => {
    console.log('mongoose controller getCart()');
    req.mongooseUser
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log('user.cart ' + user.cart)
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/reporting/mongoose/cart',
                pageTitle: 'Your Cart',
                products: products,
                reporting: true,
                useMongoose: true
            })
        })
        .catch(err => {
            console.log(err)
        });
}

/*
 * Deletes a product from the cart
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.mongooseUser
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/reporting/mongoose/cart');
        })
        .catch(err => {
            console.log(err)
        });
}