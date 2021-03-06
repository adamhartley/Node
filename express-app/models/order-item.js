/*
 * The core Order-Item entity
 */
const Sequelize = require('sequelize');
const sequelize = require('../util/mysql');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})

module.exports = OrderItem;