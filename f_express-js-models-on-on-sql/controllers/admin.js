const Product = require('../models/product');

exports.indexAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add product',
        activeAddProduct: true,
        product: new Product,
    });
};

exports.addProduct = (req, res) => {
    /**
     * Создание через hasMany
     */
    let query = req.user.createProduct({
        title:          req.body.title,
        image_url:      req.body.image_url,
        price:          req.body.price,
        description:    req.body.description,
        userId:         req.user.id,
    });
    
    /**
     * Cосздание модели и строки
    let query = Product.create({
        title:          req.body.title,
        image_url:      req.body.image_url,
        price:          req.body.price,
        description:    req.body.description,
        userId:         req.user.id,
    });
    */

    return query
        .then(v => res.redirect('/admin/products'))
        .catch(x => console.log(x));
};

exports.indexEditProduct = (req, res) => {
    
    /** let query = Product.findByPk(req.params.productId); **/

    let query = req.user.getProducts({
        where: {
            id: req.params.productId,
        },
    });
    
    return query
        .then( products => {
            if (! products.length) {
                return res.redirect('/not-found');
            }

            let product = products[0];
            
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                activeAdminProducts: true,
                product: product,
            });
        })
        .catch(x => console.log(x));
};

exports.editProduct = (req, res) => {
    let query = Product.findByPk(req.body.id);

    return query
        .then(product => {
            if (product.userId != req.user.id) {
                return res.redirect('/admin/products');
            }
            
            product.title       = req.body.title;
            product.image_url   = req.body.image_url;
            product.price       = req.body.price;
            product.description = req.body.description;

            return product.save()
                .then(v => res.redirect('/admin/products'));
        })
        .catch(x => console.log(x));
};

exports.deleteProduct = (req, res) => {
    let query = Product.destroy({
        where: {
            id: req.body.id,
            user_id: req.user.id,
        }
    });

    return query.then(v => res.redirect('/admin/products'));
};

exports.getProducts = (req, res) => {
    /** let query = Product.findAll(); */

    let query = req.user.getProducts();
    
    return query.then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            activeAdminProducts: true,
        });
    })
    .catch(x => console.log(x));
};