/*
 * Reporting Admin controller middleware functions
 */
const mongodb = require('mongodb');
const ProductReporting = require('../../models/reporting/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/reporting/admin/add-product',
        editing: false,
        reporting: true,
        useMongoose: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postReportingAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const user = req.reportingUser;

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
    ProductReporting.fetchAll()
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Product List',
                path: '/reporting/admin/products',
                reporting: true,
                isAuthenticated: req.session.isLoggedIn
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
                reporting: true,
                useMongoose: false,
                isAuthenticated: req.session.isLoggedIn
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
    ProductReporting.deleteById(prodId)
        .then(() => {
            res.redirect('/reporting/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}