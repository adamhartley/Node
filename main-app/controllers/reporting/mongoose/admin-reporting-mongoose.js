const {validationResult} = require('express-validator/check')
const Product = require('../../../models/reporting/mongoose/product');
const fileHelper = require('../../../util/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/reporting/mongoose/admin/add-product',
        editing: false,
        hasError: false,
        reporting: true,
        useMongoose: true,
        errorMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {

    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const user = req.mongooseUser;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/reporting/mongoose/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            reporting: true,
            useMongoose: true,
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/reporting/mongoose/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            reporting: true,
            useMongoose: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: user
    });
    product
        .save()
        .then(result => {
            console.log('Mongoose created a product!!!');
            res.redirect('/reporting/mongoose/admin/products');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.mongooseUser._id})  // only fetch products for editing which were created by the logged in user
        //.populate('userId') // fetches the entire User object, not just the id
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Mongoose Admin Product List',
                path: '/reporting/mongoose/admin/products',
                reporting: true,
                useMongoose: true
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    // only fetch products for the user currently logged in
    Product.findById(prodId)
        .then(product => {
            return res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/reporting/mongoose/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                reporting: true,
                useMongoose: true,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    // fetch the product info
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updateDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/reporting/mongoose/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updateDescription,
                _id: prodId

            },
            reporting: true,
            useMongoose: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    // create a new product instance, and populate it with the updated info
    Product.findById(prodId)
        .then(product => {
            // confirm that product belongs to user
            if (product.userId.toString() !== req.mongooseUser._id.toString()) {
                console.log('User attempting to edit product which they do not own!!!');
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updateDescription;
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }
            return product.save()
                .then(result => {
                    console.log('Mongoose updated the product!!!');
                    res.redirect('/reporting/mongoose/admin/products');
                });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({_id: prodId, userId: req.mongooseUser._id});
        })
        .then(() => {
            res.status(200).json({message: 'Successfully deleted product!'})
        })
        .catch(err => {
            res.status(500).json({message: 'Deleting product failed!'});
        })
}