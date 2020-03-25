const fs = require('fs');

const requestHandler = (req, res) => {
    const
        url = req.url,
        method = req.method;

    console.log(url , method);
    
    if (method == 'POST') {
        switch (url) {
            case '/message':
                const body = [];
    
                req.on('data', (chunk) => {
                    console.log(chunk);
                    body.push(chunk);
                });
    
                return req.on('end', () => {
                    const
                        parsedBody = Buffer.concat(body).toString(),
                        message = parsedBody.split('=')[1];
    
                    console.log(parsedBody);
    
                    fs.writeFile('message.txt', message, (err) => {
                        res.statusCode = 302;
                        res.setHeader('Location', '/');
        
                        return res.end(); // отправляет ответ.
                    });
                });
        }
    }
    
    switch (url) {
        case '/':
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>My First PAge</title></head>');
            res.write(
                    '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
                );
            res.write('</html>');

            console.log('nodemon включает авторестарт');
    
            return res.end();
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First PAge</title></head>');
    res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    res.write('</html>');
    
    return res.end();
};

module.exports = {
    requestHandler: requestHandler,
    someText: 'Some hard coded text',
};