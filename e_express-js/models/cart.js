const fs        = require('fs');
const path      = require('path');
const rootDir   = require('../utils/path');

module.exports = class Cart
{
    static productsData()
    {
        return path.join(rootDir, 'data', 'cart.json');
    }

    static addProduct(id, productPrice)
    {
        fs.readFile(Cart.productsData(), (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0,
            };

            if (! err) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex((product) => {
                return product.id == id;
            });

            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;

            if (existingProduct) {
                updatedProduct = { ...existingProduct };

                updatedProduct.qty++;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            // кострукция +variable - конвертирует строку в число.
            cart.totalPrice += +productPrice;
            fs.writeFile(Cart.productsData(), JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }
} 