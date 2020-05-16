const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHbs = require('express-handlebars')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path')

// create an express app
const app = express();
// set html templating framework
/*
 * Use the EJS templating engine
 */
app.set('view engine', 'ejs'); //use EJS engine to compile dynamic templates

app.set('views', 'views'); // where to find the html files (views is the default, but setting it anyway)

// add request parser (body-parser package)
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public'))); // add public path for static file access

app.use('/admin', adminRoutes); // register admin routes
app.use(shopRoutes); // register shop routes

// catch all route: if we made it through all the routes, return a 404 page not found
app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
})

app.listen(3000);