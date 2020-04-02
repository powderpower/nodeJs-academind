const express   = require('express');
const path      = require('path');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.getProducts);

/** 
 * .use() используется для всех методов
 */
router.get('/add-product', adminController.indexAddProduct);
router.post('/add-product', adminController.addProduct);

router.get('/edit-product/:productId', adminController.indexEditProduct);
router.post('/edit-product', adminController.editProduct);

router.post('/delete-product', adminController.deleteProduct);

module.exports = router;