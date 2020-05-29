const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

/* Routes */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const shopReportingRoutes = require('./routes/reporting/shop-reporting');
const shopReportingAdminRoutes = require('./routes/reporting/shop-reporting-admin')
/* Controllers */
const errorController = require('./controllers/error')
/* Util */
const rootDir = require('./util/path')
/* Database */
const sequelize = require('./util/mysql')
const mongoConnect = require('./util/mongodb').mongoConnect;
/* Models */
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')


// create an express app
const app = express();
/*
 * Use the EJS templating engine
 */
app.set('view engine', 'ejs'); //use EJS engine to compile dynamic templates
app.set('views', 'views'); // where to find the html files (views is the default, but setting it anyway)

app.use(bodyParser.urlencoded({extended: false})); // add request parser (body-parser package)
app.use(express.static(path.join(rootDir, 'public'))); // add public path for static file access

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

app.use('/admin', adminRoutes); // register admin routes
app.use(shopRoutes); // register shop routes
app.use('/reporting', shopReportingRoutes); // register reporting routes
app.use('/reporting/admin', shopReportingAdminRoutes); // register reporting admin routes

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
    .then(user => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// MongoDB Config
mongoConnect((client) => {
    console.log(client);
})
