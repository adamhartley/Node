const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session')
const MongoDbSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash')

/* Routes */
const authRoutes = require('./routes/auth');
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
// create an instance of mongoDb session store
const sessionStore = new MongoDbSessionStore({
    uri: mongodb.MONGO_URL,
    collection: 'sessions'
});
/*
 * Use the EJS templating engine
 */
app.set('view engine', 'ejs'); //use EJS engine to compile dynamic templates
app.set('views', 'views'); // where to find the html files (views is the default, but setting it anyway)

app.use(bodyParser.urlencoded({extended: false})); // add request parser (body-parser package)
app.use(express.static(path.join(rootDir, 'public'))); // add public path for static file access
app.use(session({ // configure session middleware
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
// Initialize connect-flash
app.use(flash());
// Initialize CSRF attack prevention package
const csrfProtection = csrf({});
app.use(csrfProtection);

/* Standard User */
app.use((req, res, next) => {
    if (!req.session.user) {
        console.log('MySQL session user not defined!')
        return next();
    }
    console.log('Fetching MySQL session data for user');
    User.findByPk(req.session.user)
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
    if (!req.session.reportingUser) {
        return next();
    }
    ReportingUser.findById(req.session.reportingUser._id)
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
    if (!req.session.mongooseUser) {
        return next();
    }
    MongooseUser.findById(req.session.mongooseUser._id)
        .then(user => {
            req.mongooseUser = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

// Utilize locals property to add params to all rendered views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes); // register admin routes
app.use(shopRoutes); // register shop routes
app.use('/reporting', shopReportingRoutes); // register reporting routes
app.use('/reporting/admin', shopReportingAdminRoutes); // register reporting admin routes
app.use('/reporting/mongoose', shopReportingMongooseRoutes); // register reporting mongoose routes
app.use('/reporting/mongoose/admin', shopReportingAdminMongooseRoutes); // register reporting admin mongoose routes
app.use(authRoutes);

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
    .then(() => {
        console.log('Sequelize has connected to MySQL!');
    })
    .catch(err => {
        console.log('Error connecting Sequelize to MySQL \n' + err);
    })

// MongoDB Config
mongoConnect((client) => {
    console.log('Conneted to MongoDB!!!');
})

// Mongoose connect
mongoose.connect(mongodb.MONGO_URL)
    .then(result => {
        console.log('Mongoose has connected to MongoDB!!!');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

