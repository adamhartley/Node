/*
 * Database connection configuration
 */

// ******* MySQL config ************
// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//     host: 'centosvm',
//     user: 'node_user',
//     database: 'node_webapp',
//     password: 'node_user' //TODO: hide password
// });
//
// module.exports = pool.promise();


// ********** Sequelize Config ************
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_webapp', 'node_user', 'node_user', {
    dialect: 'mysql',
    host: 'centosvm'
});

module.exports = sequelize;