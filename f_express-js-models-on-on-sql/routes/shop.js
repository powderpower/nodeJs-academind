const path      = require('path');
const express   = require('express');

const shopController = require('../controllers/shop');

const authMiddleware = require('../middleware/is_auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', authMiddleware, shopController.getCart);

router.post('/cart-delete-item', authMiddleware, shopController.deleteFromCart);

router.post('/create-order', authMiddleware, shopController.createOrder);

router.post('/add-to-cart', authMiddleware, shopController.addToCart);

router.get('/orders', authMiddleware, shopController.getOrders);

router.get('/checkout', authMiddleware, shopController.getCheckout);

module.exports = router;