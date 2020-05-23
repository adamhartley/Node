/*
 * The core Product entity
 */
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(
    rootDir,
    'data',
    'products.json'
);
const Cart = require('./cart');

// Helper function to read products from the file
const getProductsFromFile = callback => {
    // Read the products.json file into memory. There are more efficient ways (e.g. createReadStream), but this is a small dataset.
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]); // no products found, return empty array
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            // check if product already exists, if it does we update, otherwise we create a new one
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this; // replace old product with updated product
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log('Error writing products file ' + err);
                });
            } else {
                this.id = Math.random().toString(); // dummy id value, random enough for this example
                // append product to array of products
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log('Error writing products file ' + err);
                    }
                });
            }
        })
    }

    static deleteById(id) {
        // get products
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            // keep all products where the product id doesn't match the id passed in
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price)
                } else {
                    console.log('Error writing products file ' + err);
                }
            });
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        })
    }
};