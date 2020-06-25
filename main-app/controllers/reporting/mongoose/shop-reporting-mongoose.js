/*
 * Mongoose ODM Shop controller
 */

const Product = require('../../../models/reporting/mongoose/product');
const Order = require('../../../models/reporting/mongoose/order');

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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
    req.mongooseUser
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/reporting/mongoose/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    console.log('Creating mongoose order...');

    req.mongooseUser
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            // fetch all the products in the user's cart
            const products = user.cart.items.map(item => {
                return {quantity: item.quantity, product: {...item.productId._doc}};
            });

            // create a new order, add products collected from cart
            const order = new Order({
                user: {
                    email: req.mongooseUser.email,
                    userId: req.mongooseUser
                },
                items: products
            });

            return order.save();
        })
        .then(() => {
            return req.mongooseUser.clearCart();
        })
        .then(() => {
            res.redirect('/reporting/mongoose/orders');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getOrders = (req, res, next) => {
    console.log('Getting mongoose orders...')
    Order.find({'user.userId': req.mongooseUser._id})
        .then(orders => {
            console.log('found orders....rendering...' + orders.size)
            res.render('shop/orders', {
                path: '/reporting/mongoose/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                reporting: true,
                useMongoose: true
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}