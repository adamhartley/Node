/*
 * Shop controller
 */
const Product = require('../models/product');
const ProductNoSQL = require('../models/reporting/product')

exports.getProducts = (req, res, next) => {
    console.log('getProducts')
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                reporting: false,
                useMongoose: false,
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
    console.log('getProduct');
    const prodId = req.params.productId;

    console.log('Request' + req.params.toString())
    console.log('prodId: ' + prodId)
    Product.findByPk(prodId)
        .then((product) => {
            console.log('product.title ' + product.title);
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                reporting: false,
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

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products,
                        reporting: false,
                        useMongoose: false
                    });
                })
                .catch(err => {
                    console.log(err)
                });
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
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            if (!cart) {
                console.log('cart did not exist, creating...')
                // if cart undefined, create a cart
                fetchedCart = req.user.createCart();
            } else {
                fetchedCart = cart;
            }
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            // adding a product already in cart, increment quantity
            if (product) {
                // get quantity
                const oldQuantity = product.cartItem.quantity;
                newQuantity += oldQuantity;
                return product;
            }
            // add a new product for the first time
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {quantity: newQuantity}
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

/*
 * Deletes a product from the cart
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}})
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        // get the item quantity from the cart
                        product.orderItem = {quantity: product.cartItem.quantity};
                        return product;
                    }));
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']}) // Sequelize eager loading - also fetch the products
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                reporting: false,
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

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}