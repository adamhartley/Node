/**
 * Product entity for use with Mongoose ODM
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectID,
        ref: 'User', // relates to the model name in user.js
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);