const express = require('express');
const bodyParser = require('body-parser');

// create an express app
const app = express();

// add request parser (body-parser package)
app.use(bodyParser.urlencoded({extended: false}));

/*
 * use() mounts the specified middleware function or functions at the specified path: the middleware
 * function is executed when the base of the requested path matches path.
 *
 * req - request
 * res - response
 * next - function that is passed along to the next middleware in line
 */
app.use('/', (req, res, next) => {
    console.log('This always runs');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In add-product middleware!!!');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Producct</button></form>');
});

app.use('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
})

app.use('/', (req, res, next) => {
    console.log('In home page middleware!!!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);