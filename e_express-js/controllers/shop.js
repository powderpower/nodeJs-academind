const Product = require('../models/product');

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
        pageTitle: 'Your Cart',
        activeCart: true,
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true,
    });
};