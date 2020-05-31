/**
 * User entity for use with NoSQL
 */
const mongodb = require('mongodb');
const getDb = require('../../util/mongodb').getDb;
const collection = 'users';

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; // cart is an object which contains an array of items
        this._id = id ? mongodb.ObjectID(id) : null;
    }

    save() {
        const db = getDb(); // get db connection
        let dbOperation;
        if (this._id) {
            // update the product
            dbOperation = db.collection(collection).updateOne({_id: this._id}, {$set: this});
        } else {
            // insert new product
            dbOperation = db.collection(collection).insertOne(this);
        }
        return dbOperation
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err)
            })
    }

    static findById(userId) {
        const db = getDb();
        return db.collection(collection)
            .find({_id: mongodb.ObjectID(userId)})
            .next()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err)
            })
    }

    addToCart(product) {
        // check if product already exists in the cart
        const cartProductIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === product._id.toString(); // ensure that we are comparing objects of the same type
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items]; // create new array with all the items in the cart

        if (cartProductIndex >= 0) { // item exists in the cart, update the quantity
            newQuantity += this.cart.items[cartProductIndex].quantity;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else { // item did not exist in the cart, add it to the cart array
            updatedCartItems.push({productId: mongodb.ObjectID(product._id), quantity: newQuantity})
        }

        // set cart items array to updatedCartItems
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users')
            .updateOne({_id: mongodb.ObjectID(this._id)},
                {$set: {cart: updatedCart}}) // update the cart only
    }

    getCart() {
        console.log('Getting cart...')
        const db = getDb();
        const productIds = this.cart.items.map(item => {
            return item.productId;
        })
        return db.collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).quantity
                    }
                })
            })

    }
}

module.exports = User;