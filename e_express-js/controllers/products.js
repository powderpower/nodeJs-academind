/** для обработки без моделей.
 * const products = [];
 */

const Product = require('../models/product');

exports.indexAddProduct = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add product',
        path: 'add-product',
        formCSS: true,
        productCss:true,
        activeAddProduct: true,
    });

    /*
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    */
}

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
    const product = new Product(req.body.title);
    product.save();
    
    res.redirect('/');
}

exports.getProducts = (req, res) => {
    /**
     * path.join() - чтобы не париться с "/"" в линуксе или "\"" в винде
     */
    const products = Product.fetchAll();

    res.render('shop', {
        prods: products,
        pageTitle: 'My shop',
        path: 'shop',
        hasProducts: products.length,
        activeShop: true,
        productCSS: true,
    });
    
    /**
     * Отправка html файла
     * console.log(adminData.products);
     * res.sendFile(path.join(rootDir, 'views', 'shop.html'));
     */
}