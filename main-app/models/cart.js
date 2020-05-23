/*
 * The core Cart entity
 *
 * Rather than using a constructor to create an instance of the Cart,
 * we only need static methods to add/subtract items from the Cart.
 */
const fs = require('fs')
const path = require('path')
const rootDir = require('../util/path');
const p = path.join(
    rootDir,
    'data',
    'cart.json'
);

module.exports = class Cart {
    /*
     * Add product to cart, update quantity and total cart price
     */
    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyze cart => find existing products
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id); // we need the index for cases where we update the qty, and not add a brand new item
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // add new product / increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct; // replace the existing cart item with the updated cart item
            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            // add item price to cart total price
            cart.totalPrice = cart.totalPrice + +productPrice; // adding the + in front of the productPrice returns the numeric representation of the variable
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }

    /*
     * Remove item from cart, and update cart total price
     */
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return; // no cart found, nothing to delete
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                if (err) {
                    console.log(err);
                }
            })
        })
    }
}