const express = require('express');

// create an express app
const app = express();

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
    res.send('<h1>Add product page!!</h1>');
});

app.use('/', (req, res, next) => {
    console.log('In home page middleware!!!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);