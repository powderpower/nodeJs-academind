/** для обработки без моделей.
 * const products = [];
 */

const Product = require('../models/product');

exports.indexAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add product',
        path: 'add-product',
        activeAddProduct: true,
    });

    /*
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    */
};

exports.addProduct = (req, res) => {
    console.log(req.body);
    /**
     * Объект удерживается в памяти, поэтому таким образом,
     * можно добавлять данные, и обмениваться объектами.
     * соответственно, распространяется для всех запросов,
     * пока память не будет очищена.
     */

    /** для обработки без моделей.
     * products.push({ title: req.body.title });
     */
    const title         = req.body.title;
    const imageUrl      = req.body.image_url;
    const price         = req.body.price;
    const description   = req.body.description;

    const product = new Product(title, imageUrl, price, description);
    product.save();
    
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            activeAdminProducts: true,
        });
    });
};