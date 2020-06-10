/**
 * User entity for use with Mongoose ODM
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectID,
                ref: 'Product', // relate to Product model in product.js
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
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
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    // set cart items array to updatedCartItems
    const updatedCart = {items: updatedCartItems};
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
};

module.exports = mongoose.model('User', userSchema);