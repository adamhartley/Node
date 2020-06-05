// ******** MongoDb config ************
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const MONGO_URL = 'mongodb://node_user:node_user@localhost:27017/node_webapp?retryWrites=true&authSource=admin';

let _db;

const mongoConnect = () => {
    MongoClient.connect(MONGO_URL)
        .then(client => {
            console.log('Connected to MongoDB!!!');
            _db = client.db();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.MONGO_URL = MONGO_URL;