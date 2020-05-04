const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);

    // set response header
    res.setHeader('Content-Type', 'text/html');
    // write data to the response
    res.write('<html>');
    res.write('<head><title>MyFirstPage</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    res.write('</html>');
    res.end(); // call end once response finished writing
});

server.listen(3000);
