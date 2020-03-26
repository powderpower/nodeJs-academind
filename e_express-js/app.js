const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

/**
 * Дока
 * https://expressjs.com
 */
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

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
app.use('/admin', adminData.routes);

app.use(shopRoutes);

app.use((req, res) => {
    res.status(404)
        .render(path.join('errors', '404'), {pageTitle: 'Page not found'});
        
        /*
        .sendFile(path.join(__dirname, '.', 'views', 'errors', '404.html'));
        */
});

/** <===== */

/**
 * запуск сервера.
 */
app.listen(3000);