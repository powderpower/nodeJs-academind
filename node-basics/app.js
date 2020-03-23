// если указать ./http - будет искать в папке,
// без этого ищет глобальный компонент ноды
const http = require('http');
const fs = require('fs');

// чтобы перезапускался сервер, нужно перезапускать выполнение кода.

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers); // информация о запросе.
    // process.exit(); выход из петли событий.

    const url = req.url,
    method = req.method;

    if (method == 'POST') {
        switch (url) {
            case '/message':
                const body = [];

                // евент, который срабатывает когда приходят данные.
                req.on('data', (chunk) => {
                    console.log(chunk);
                    body.push(chunk);
                });

                // евент, который срабатывает, когда данные обработаны.
                req.on('end', () => {
                    const parsedBody = Buffer.concat(body).toString();
                    console.log(parsedBody);
                    const message = parsedBody.split('=')[1];

                    fs.writeFileSync('message.txt', message);
                });
                
                res.setStatusCode = 302;
                res.setHeader('Location', '/');

                return res.end(); // отправляет ответ.
        }
    }
    
    switch (url) {
        case '/':
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>My First PAge</title></head>');
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
            res.write('</html>');

            return res.end(); // отправляет ответ.
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First PAge</title></head>');
    res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    res.write('</html>');
    res.end(); // отправляет ответ.

    // дальше выводить нельзя.
});

server.listen(3000);