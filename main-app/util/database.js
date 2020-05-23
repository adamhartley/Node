/*
 * Database connection configuration
 */

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'centosvm',
    user: 'node_user',
    database: 'node_webapp',
    password: 'node_user' //TODO: hide password
});

module.exports = pool.promise();