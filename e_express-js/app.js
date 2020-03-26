const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/**
 * Дока
 * https://expressjs.com
 */
const app = express();


/**
 * middleware.
 */
app.use((req, res, next) => {
    console.log('In the middleware');
    next();
});

/**
 * middleware с ответом.
 */
/*
app.use((req, res, next) => {
    console.log('In another middleware');

    // .send - express js метод
    res.send('<h1>Hello from express JS</h1>');
});
*/

/**
 * =====> routes.
 */

/**
 * Обработчик входящих данных.
 */
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Объявление папки,
 * которая отдаст статические файлы.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Группирование роутов.
 */
app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use((req, res) => {
    res.status(404)
        .sendFile(path.join(__dirname, '.', 'views', 'errors', '404.html'));
});

/** <===== */

/**
 * запуск сервера.
 */
app.listen(3000);