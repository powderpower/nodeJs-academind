const express   = require('express');
const path      = require('path');

const productsController = require('../controllers/products');

const router = express.Router();

/** 
 * .use() используется для всех методов
 */
router.get('/add-product', productsController.indexAddProduct);

router.post('/add-product', productsController.addProduct);

module.exports = router;