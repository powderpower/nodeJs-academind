const fs    = require('fs');
const path  = require('path');
const rootDir = require('../utils/path');

const Cart = require('./cart');

const getDataFromFile = (filePAth, callBack) => {
    fs.readFile(filePAth, (err, fileContent) => {
        if (err) {
            callBack([]);

            return this;
        }

        callBack(JSON.parse(fileContent));

        return this;
    });
}
module.exports = class Product
{
    constructor(title, imageUrl, price, description, id = null)
    {
        this.id             = id;
        this.title          = title;
        this.image_url      = imageUrl;
        this.price          = price;
        this.description    = description;
    }

    static productsData()
    {
        return path.join(rootDir, 'data', 'products.json');
    }

    save()
    {
        getDataFromFile(Product.productsData(), (products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex((prod) => {
                    return prod.id === this.id;
                });

                products[existingProductIndex] = this;
            } else {
                this.id = Math.random().toString();
                products.push(this);
            }

            fs.writeFile(Product.productsData(), JSON.stringify(products), (err) => {
                console.log(err);
            });
        });

        return this;
    }

    static deleteById(id)
    {
        getDataFromFile(Product.productsData(), (products) => {
            const product = products.find((item) => {
                return item.id === id;
            });
            
            const updatedProducts = products.filter((item) => {
                return item.id !== id;
            });

            fs.writeFile(Product.productsData(), JSON.stringify(updatedProducts), (err) => {
                if (! err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(callback)
    {
        getDataFromFile(Product.productsData(), callback);

        return this;
    }

    static findById(id, callBack)
    {
        getDataFromFile(Product.productsData(), (products) => {
            const product = products.find((item) => {
                return item.id == id;
            });

            callBack(product);
        });
    }
}