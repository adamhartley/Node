const Product = require('../../../models/reporting/mongoose/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/reporting/mongoose/admin/add-product',
        editing: false,
        reporting: true,
        useMongoose: true
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const user = req.mongooseUser;
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
    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/reporting/mongoose/admin/edit-product',
                editing: editMode,
                product: product,
                reporting: true,
                useMongoose: true
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
            product.imageUrl = updatedImageUrl;
            return product.save()
                .then(result => {
                    console.log('Mongoose updated the product!!!');
                    res.redirect('/reporting/mongoose/admin/products');
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.mongooseUser._id})
        .then(() => {
            res.redirect('/reporting/mongoose/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}