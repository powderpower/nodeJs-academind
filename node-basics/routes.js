const fs = require('fs');

const requestHandler = (req, res) => {
    const
        url = req.url, // получить ссылку.
        method = req.method; // получить метод запроса.

    console.log(url , method);
    
    if (method == 'POST') {
        switch (url) {
            case '/message':
                const body = [];
    
                // евент, который срабатывает когда приходят данные.
                req.on('data', (chunk) => {
                    console.log(chunk);
                    body.push(chunk);
                });
    
                /**
                 * евент, который срабатывает, когда данные обработаны.
                 * чтобы выполнить отправку загловков после обработки данных,
                 * необходимо вернуть евент.
                 */
                return req.on('end', () => {
                    const
                        parsedBody = Buffer.concat(body).toString(),
                        message = parsedBody.split('=')[1];
    
                    console.log(parsedBody);
    
                    /**
                     * .writeFileSync
                     * Sync - означает, что пока эта строчка кода не выполнится,
                     * остальные строчки не начнут выполняться.
                     * если будет много данных, серверв повиснет,
                     * так как нода обрабатывает все  одной петле событий.
                     * 
                     * Чтобы вернуть ответ по выполненю записи файла, необходимо
                     * коллбэком вернуть ответ.
                     * 
                     * Работа с нагруженными задачами отправляется в worker pool.
                     * Когда задача в worker pool-е выполняется,
                     * worker pool отправляет в петдю событий событие запуска callback.
                     */
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
    
            return res.end(); // отправляет ответ.
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First PAge</title></head>');
    res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    res.write('</html>');
    
    return res.end(); // отправляет ответ.
    
    // дальше выводить нельзя.
};

/**
 * module.export регистрирует глобально для проекта.
 * 
 * Объект выгружается только с правами read
 * модифицировать объект из клиентского кода не получится.
 */
/**
 * Выгрузка одного объекта.
 * module.exports = requestHandler;
 */

/**
 * Выгрузка множественных объектов.
 */
module.exports = {
    requestHandler: requestHandler,
    someText: 'Some hard coded text',
};

/**
 * или
 * module.exports.requestHandler = requestHandler;
 * module.exports.someText = 'Some hard coded text';
 * или
 * exports.requestHandler = requestHandler;
 * exports.someText = 'Some hard coded text';
 */