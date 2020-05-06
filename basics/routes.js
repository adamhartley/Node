const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    /*
       * On the homepage, the user will see a form to enter data, and an input button.
       * The input data will be saved in a file on the server.
     */
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end(); // exit function
    }

    /*
     * Redirect the user back to the home page after the form is submitted and store the file
     */
    if (url === '/message' && method === 'POST') {
        const body = [];
        // adding listener for data event, which is fired whenever a new chunk is ready to be read
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        // register end listener, which is executed when the incoming request data has finished being parsed
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(parsedBody);

            // Asynchronously write file with data from request body
            fs.writeFile('message.txt', message, (err) => {
                res.statusCode = 302; // 302 - redirect status code
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    // set response header
    res.setHeader('Content-Type', 'text/html');
    // write data to the response
    res.write('<html>');
    res.write('<head><title>MyFirstPage</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
    res.write('</html>');
    res.end(); // call end once response finished writing
};

// export the request handler function for use in other files
module.exports = {
    handler: requestHandler
};

// // Other syntax options for exporting:
// module.exports = requestHandler;
// // or
// module.exports.handler = requestHandler;
// // or
// exports.handler = requestHandler; // node shortcut: module reference is not required

