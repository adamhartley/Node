/**
 * Product entity for use with NoSQL
 */
const mongodb = require('mongodb');
const getDb = require('../../util/mongodb').getDb;
const collection = 'products';

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
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

    static deleteById(prodId) {
        const db = getDb();
        const mongoProdId = mongodb.ObjectID(prodId);
        return db.collection(collection)
            .deleteOne({_id: mongoProdId})
            .then(result => {
                console.log('Deleted ' + mongoProdId);
            })
            .catch(err => {
                console.log(err)
            });
    }
}

module.exports = Product;