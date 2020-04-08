const express = require('express');
const bodyParser = require('body-parser');

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
});

app.use(feedRoutes);

app.listen(8080);