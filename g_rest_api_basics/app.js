const express       = require('express');
const bodyParser    = require('body-parser');

const sequelize = require('./database/setup');
const relations = require('./database/relations');

const feedRoutes = require('./routes/feed');

const app = express();

/**
 * Для парсинга входящего json.
 * 
 * Postman - программа для теста API.
 * https://www.postman.com/downloads
 */
app.use(bodyParser.json());

app.use((req, res, next) => {
    /**
     * Добавляет сайты, от которых можно получать
     * кросс-доменные запросы.
     * 
     * Перед тем как от клиента сходить по ссылке указаным методом,
     * сначала идет проверка доступности этого метода
     * методом OPTIONS
     */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

    console.log(req.url);
});

app.use('/feed', feedRoutes);

relations.defineRelations();

sequelize
    /** { force: true } только для девелопа - продакш - миграции */
    .sync()
    .then(v => app.listen(8080))
    .catch(err => console.log(err));