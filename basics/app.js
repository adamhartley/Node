const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handler); // execute the function stored in routes for incoming requests

server.listen(3000);