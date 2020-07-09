const mongooseOrder = require('../reporting/mongoose/order');
const reportingUser = require('../reporting/user');
const mySqlOrder = require('../order');

const getMongooseOrder = (orderId) => {
    return mongooseOrder.findById(orderId)
        .then(order => {
            return order;
        })
}

const getMySqlOrder = (orderId) => {
    return mySqlOrder.find({
        where: {
            id: orderId
        }
    })
}

exports.getOrder = (orderId, baseUrl) => {
    if (baseUrl === '/reporting/mongoose') {
        // fetch using mongoose
        console.log('Fetching mongoose order...');
        return getMongooseOrder(orderId);
    } else if (baseUrl === '/reporting') {
        // fetch using mongodb
        console.log('Fetching mongo order...');
        return reportingUser.getOrderById(orderId);
    } else {
        console.log('Fetching MySQL order...');
        // fetch using MySQL
        return getMySqlOrder(orderId);
    }
}