const express   = require('express');
const path      = require('path');

const rootDir   = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
    // path.join() - чтобы не париться с "/"" в линуксе или "\"" в винде
    
    const products = adminData.products;
    res.render('shop', {
        prods: products,
        pageTitle: 'My shop',
        path: 'shop',
        hasProducts: products.length,
        activeShop: true,
        productCSS: true,
    });
    
    /* Отправка html файла
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    */
});

module.exports = router;