const express   = require('express');
const path      = require('path');

const rootDir   = require('../util/path');

const router = express.Router();

const products = [];

/** 
 * use используется для всех методов
 */
router.get('/add-product', (req, res) => {
    res.render('add-product', { pageTitle: 'Add product', path: 'add-product' });
    
    /*
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    */
});

router.post('/add-product', (req, res) => {
    console.log(req.body);

    /**
     * Объект удерживается в памяти, поэтому таким образом,
     * можно добавлять данные, и обмениваться объектами.
     * соответственно, распространяется для всех запросов,
     * пока память не будет очищена.
     */
    products.push({ title: req.body.title });
    res.redirect('/');
});

module.exports = {
    routes: router,
    products: products,
};