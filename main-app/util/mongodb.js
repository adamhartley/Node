// ******** MongoDb config ************
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = () => {
    MongoClient.connect('mongodb://localhost:27017/test?retryWrites=true')
        .then(result => {
            console.log('Connected to MongoDB!!!');
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;