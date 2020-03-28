const express   = require('express');
const path      = require('path');

const adminController = require('../controllers/admin');

const router = express.Router();

/** 
 * .use() используется для всех методов
 */
router.get('/add-product', adminController.indexAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.addProduct);

module.exports = router;