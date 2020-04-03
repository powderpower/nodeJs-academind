const Product   = require('../models/product');
const Cart      = require('../models/cart');

exports.getProducts = (req, res) => {
    let query = Product.findAll();
    
    return query
        .then(products =>  {
                res.render('shop/product-list', {
                    prods: products,
                    pageTitle: 'All Products',
                    activeProducts: true,
                });
            })
        .catch(x => console.log(x));
};

exports.getIndex = (req, res) => {
    let query = Product.findAll();
    
    return query
        .then(products =>  {
                res.render('shop/index', {
                    prods: products,
                    pageTitle: 'My shop',
                    activeShop: true,
                });
            })
        .catch(x => console.log(x));
};

exports.getCart = (req, res) => {
    let query = req.user.getCart();

    return query
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            return res.render('shop/cart', {
                pageTitle: 'Your cart',
                activeCart: true,
                cartProducts: products,
            });
        })
        .catch(x => console.log(x));
};

exports.addToCart = (req, res) => {
    let query   = req.user.getCart(),
    productId   = req.body.product_id,
    newQty      = 1,
    fetchedCart = null;

    return query
        .then(cart => {
            fetchedCart = cart;
            
            return cart.getProducts({
                where: {
                    id: productId,
                }
            });
        })
        .then(products => {
            let product;
            if (products.length) {
                product = products[0];
            }

            if (product) {
                newQty = product.cart_item.quantity + 1;

                return product;
            }

            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQty,
                }
            });
        })
        .then(v => res.redirect('/cart'))
        .catch(x => console.log(x));
};

exports.deleteFromCart = (req, res) => {
    const productId = req.body.product_id;

    let query = req.user.getCart();

    return query
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];

            return product.cart_item.destroy();
        })
        .then(v => res.redirect('/cart'))
        .catch(x => console.log(x));
};

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Your orders',
        activeOrders:true,
    });
};

exports.getProduct = (req, res) => {
    // findById deprecated => findByPk
    //let query = Product.findByPk(req.params.productId);
    // или через where
    let query = Product.findOne({
        where: {
            id: req.params.productId,
        },
    });
    
    return query
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title + ' | Details of product',
                activeProducts: true,
            });
        })
        .catch(x => console.log(x));
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true,
    });
};