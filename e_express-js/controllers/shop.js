const Product   = require('../models/product');
const Cart      = require('../models/cart');

exports.getProducts = (req, res) => {
    /**
     * path.join() - чтобы не париться с "/"" в линуксе или "\"" в винде
     */
    
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            activeProducts: true,
        });
    });
    
    /**
     * Отправка html файла
     * console.log(adminData.products);
     * res.sendFile(path.join(rootDir, 'views', 'shop.html'));
     */
};

exports.getIndex = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'My shop',
            activeShop: true,
        });
    });
};

exports.getCart = (req, res) => {
    res.render('shop/cart', {
        pageTitle: 'Your cart',
        activeCart: true,
    });
};

exports.addToCart = (req, res) => {
    const productId = req.body.product_id;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });

    res.redirect('/cart');
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Your orders',
        activeOrders:true,
    });
};

exports.getProduct = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId, (product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title + ' | Details of product',
            activeProducts: true,
        });
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true,
    });
};