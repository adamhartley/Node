/*
 * The core Product entity
 */
const db = require('../util/database');
const rootDir = require('../util/path');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO node_webapp.Products(title, price, description, image_url) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]);
    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM node_webapp.Products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM node_webapp.Products WHERE id = ?', [id]);
    }
};