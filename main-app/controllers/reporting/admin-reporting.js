/*
 * Reporting Admin controller middleware functions
 */

const ProductReporting = require('../../models/reporting/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/reporting/admin/add-product',
        editing: false
    });
}

exports.postReportingAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const productNoSql = new ProductReporting(title, price, description, imageUrl);
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