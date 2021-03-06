/*
 * The core Cart entity
 */
const Sequelize = require('sequelize');
const sequelize = require('../util/mysql');

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Cart;