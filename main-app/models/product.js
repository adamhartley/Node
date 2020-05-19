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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            // append product to array of products
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log('Error writing products file ' + err);
            });
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
};