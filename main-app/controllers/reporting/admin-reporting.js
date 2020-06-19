/*
 * Reporting Admin controller middleware functions
 */
const mongodb = require('mongodb');
const {validationResult} = require('express-validator/check')
const ProductReporting = require('../../models/reporting/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/reporting/admin/add-product',
        editing: false,
        hasError: false,
        reporting: true,
        useMongoose: false,
        errorMessage: null,
        validationErrors: []
    });
}

exports.postReportingAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const user = req.reportingUser;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/reporting/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            reporting: true,
            useMongoose: false,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const productNoSql = new ProductReporting(title, price, description, imageUrl, null, user._id);
    console.log('Saving to MongoDB');

    productNoSql.save()
        .then(result => {
            console.log('Created reporting product!');
            return res.redirect('/reporting/products')
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    ProductReporting.fetchAllForUser(req.reportingUser._id)
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Product List',
                path: '/reporting/admin/products',
                reporting: true,
                useMongoose: false
            });
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    // only fetch products for the user currently logged in
    ProductReporting.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/reporting/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                reporting: true,
                useMongoose: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditProduct = (req, res, next) => {
    console.log('Reporting post edit product!!! ')
    // fetch the product info
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updateDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/reporting/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updateDescription,
                _id: prodId
            },
            reporting: true,
            useMongoose: false,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const prod = ProductReporting.findById(prodId);
    // check if current user owns product to be edited
    if (prod.userId.toString() !== req.reportingUser._id.toString()) {
        console.log('User attempting to edit product which they do not own!!!');
        return res.redirect('/');
    }

    // create a new product instance, and populate it with the updated info
    const updatedProduct = new ProductReporting(updatedTitle, updatedPrice, updateDescription, updatedImageUrl, mongodb.ObjectID(prodId));
    console.log(updatedProduct);

    updatedProduct.save()
        .then(result => {
            console.log('Updated product!!!');
            // save the updated product
            res.redirect('/reporting/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const userId = req.reportingUser._id;
    ProductReporting.deleteById(prodId, userId)
        .then(() => {
            res.redirect('/reporting/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}