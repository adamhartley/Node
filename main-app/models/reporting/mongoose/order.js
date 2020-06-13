/**
 * Order entity for use with Mongoose ODM
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [{
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectID,
            required: true,
            ref: 'User'
        }
    }
})

module.exports = mongoose.model('Order', orderSchema);