const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// create an express app
const app = express();

// add request parser (body-parser package)
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoutes); // register admin routes
app.use(shopRoutes); // register shop routes

// catch all route: if we made it through all the routes, return a 404 page not found
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000);