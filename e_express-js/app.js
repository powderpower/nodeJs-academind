const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');

const adminRoutes       = require('./routes/admin');
const shopRoutes        = require('./routes/shop');
const errorController   = require('./controllers/error');

/**
 * Дока
 * https://expressjs.com
 */
const app = express();

/**
 * так пожно прикручивать pug,
 * потому-что он имеет резервированный
 * функционал в express
 */

//app.set('view engine', 'pug');
//app.set('views', path.join('views', 'pug'));

/**
 * прикручивание express-handlebars.
 */
/*
const expressHbs    = require('express-handlebars');
app.engine(
    'hbs', // указывает расширение для файлов
    expressHbs({
        layoutsDir: path.join(__dirname, 'views', 'handlebars', 'layouts'),
        defaultLayout: 'main-layout',
        extname: 'hbs', // указывает расширение для лайаута (оч странно)
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views', 'handlebars'));
*/

/**
 * прикручивание ejs.
 */
app.set('view engine', 'ejs');
app.set('views', path.join('views', 'ejs'));

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

app.use(errorController.processNotFoudError);

/** <===== */

/**
 * запуск сервера.
 */
app.listen(3000);