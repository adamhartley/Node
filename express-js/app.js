const http = require('http');
const express = require('express');

// create an express app
const app = express();

/*
 * use() allows us to add other middleware frameworks to express
 * The function passed to use() will be executed for every incoming request
 *
 * req - request
 * res - response
 * next - function that is passed along to the next middleware in line
 */
app.use((req, res, next) => {
    console.log('In the middleware!!!');
    next(); // allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
    console.log('In another middleware!!!');
    res.send('<h1>Hello from Express!</h1>');
});

const server = http.createServer(app);

server.listen(3000);