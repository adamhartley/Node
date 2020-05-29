/**
 * Product entity for use with NoSQL
 */
const mongodb = require('mongodb');
const getDb = require('../../util/mongodb').getDb;
const collection = 'products';

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb(); // get db connection
        return db.collection(collection).insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err)
            })
    }

    static fetchAll() {
        const db = getDb();
        return db.collection(collection)
            .find()
            .toArray() // TODO: replace toArray with pagination
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err)
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection(collection)
            .find({_id: mongodb.ObjectID(prodId)})
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = Product;