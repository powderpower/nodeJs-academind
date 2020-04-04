const Product   = require('../models/product');

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
    let query = req.user.getOrders({ include: ['products'] /** аналог with в ларавеле */ });

    return query
        .then(orders => res.render('shop/orders', {
            pageTitle: 'Your orders',
            activeOrders:true,
            orders: orders,
        }))
        .catch(x => console.log(x));
    

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

exports.createOrder = (req, res, next) => {
    let query = req.user.getCart(),
    cartProducts = [],
    fetchedCart = [];

    return query
        .then(cart => {
            fetchedCart = cart;

            return cart.getProducts();
        })
        .then(products => {
            cartProducts = products;

            return req.user.createOrder();
        })
        .then(order => {
            order.addProducts(cartProducts.map(product => {
                product.order_item = {
                    quantity: product.cart_item.quantity,
                };

                return product;
            }));
        })
        .then(v => fetchedCart.setProducts(null))
        .then(v => res.redirect('/orders'))
        .catch(x => console.log(x));
};