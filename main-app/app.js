const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

/* Routes */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const shopReportingRoutes = require('./routes/reporting/shop-reporting');
const shopReportingAdminRoutes = require('./routes/reporting/shop-reporting-admin')
const shopReportingMongooseRoutes = require('./routes/reporting/mongoose/shop-reporting-mongoose')
const shopReportingAdminMongooseRoutes = require('./routes/reporting/mongoose/shop-reporting-admin-mongoose')
/* Controllers */
const errorController = require('./controllers/error')
/* Util */
const rootDir = require('./util/path')
/* Database */
const sequelize = require('./util/mysql')
const mongoConnect = require('./util/mongodb').mongoConnect;
const mongodb = require('./util/mongodb');
const mongoose = require('mongoose');
/* Models */
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')
/* Reporting Models */
const ReportingUser = require('./models/reporting/user')
/* Mongoose Models */
const MongooseUser = require('./models/reporting/mongoose/user')

// create an express app
const app = express();
/*
 * Use the EJS templating engine
 */
app.set('view engine', 'ejs'); //use EJS engine to compile dynamic templates
app.set('views', 'views'); // where to find the html files (views is the default, but setting it anyway)

app.use(bodyParser.urlencoded({extended: false})); // add request parser (body-parser package)
app.use(express.static(path.join(rootDir, 'public'))); // add public path for static file access

/* Standard User */
app.use((req, res, next) => { // TODO: clean up
    User.findByPk(1)
        .then(user => {
            req.user = user; // store Sequelize object for use elsewhere in the app
            next();
        })
        .catch(err => {
            console.log(err)
        })
})

/* Reporting User */
app.use((req, res, next) => {
    ReportingUser.findById('5ed2c9f6838f3220325b0bb0')
        .then(user => {
            /* create and adding the user to the request object allows us to call ReportingUser methods
               on the object being passed around (e.g. see controllers/reporting/shop-reporting/postCart()) */
            req.reportingUser = new ReportingUser(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

/* Mongoose User */
app.use((req, res, next) => {
    MongooseUser.findById('5ed7d6456c2aaa3c4b541005')
        .then(user => {
            req.mongooseUser = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

app.use('/admin', adminRoutes); // register admin routes
app.use(shopRoutes); // register shop routes
app.use('/reporting', shopReportingRoutes); // register reporting routes
app.use('/reporting/admin', shopReportingAdminRoutes); // register reporting admin routes
app.use('/reporting/mongoose', shopReportingMongooseRoutes); // register reporting mongoose routes
app.use('/reporting/mongoose/admin', shopReportingAdminMongooseRoutes); // register reporting admin mongoose routes

// catch all route: if we made it through all the routes, return a 404 page not found
app.use(errorController.get404)

/*
 * Configure database associations
 */
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem}); // many-to-many association
Product.belongsToMany(Cart, {through: CartItem}); // many-to-many association
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem}); // many-to-many association
Product.belongsToMany(Order, {through: OrderItem}); // many-to-many association


// MySql Seuelize Config
sequelize.sync() // tell Sequelize to create tables if they don't exist
    .then(result => {
        User.findByPk(1); // TODO: remove after authentication is configured

    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Test', email: 'testUser@test.com'})
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .catch(err => {
        console.log(err);
    });

// MongoDB Config
mongoConnect((client) => {
    console.log('Conneted to MongoDB!!!');
})

// Mongoose connect
mongoose.connect(mongodb.MONGO_URL)
    .then(result => {
        console.log('Mongoose has connected to MongoDB!!!');

        // check if a user exists, create one if none are found
        MongooseUser.findOne()
            .then(user => {
                if (!user) {
                    // create a new user if
                    const user = new MongooseUser({
                        name: 'MongooseTestUser',
                        email: 'mongooseUser@test.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

