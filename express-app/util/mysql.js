/*
 * Database connection configuration
 */

// ******* MySQL config ************
// ********** Sequelize Config ************
const Sequelize = require('sequelize');

// Start docker container
const sequelize = new Sequelize('node_webapp', 'node_user', 'node_user', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
});
module.exports = sequelize;
