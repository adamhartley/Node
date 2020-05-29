/*
 * Admin controller middleware functions
 */

const Product = require('../models/product');
const ProductNoSql = require('../models/reporting/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const productNoSql = new ProductNoSql(title, price, description, imageUrl);


    req.user.createProduct({ // Sequelize method available as association was configured in app.js
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
        .then(result => {
            console.log('Saving to MongoDB');
            return productNoSql.save();
        })
        .then(result => {
            console.log(result);
            return res.redirect('/')
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    // only fetch products for the user currently logged in
    req.user.getProducts({where: {id: prodId}}) //utilizing Sequelize dynamic method as association defined in app.js
        .then(products => {
            const product = products[0]; // returns an array, but we know there is only one product
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditProduct = (req, res, next) => {
    // fetch the product info
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    // create a new product instance, and populate it with the updated info
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updateDescription, updatedPrice);

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updateDescription;
            return product.save(); // return to avoid nested promise
        })
        .then(result => {
            console.log('Updated product!!!');
            // save the updated product
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Product List',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Destroyed product!!')
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}