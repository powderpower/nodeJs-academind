const fs    = require('fs');
const path  = require('path');
const rootDir = require('../utils/path');

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
    constructor(title, imageUrl, price, description) {
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
        this.id = Math.random().toString();
        
        getDataFromFile(Product.productsData(), (products) => {
            products.push(this);

            fs.writeFile(Product.productsData(), JSON.stringify(products), (err) => {
                console.log(err);
            });
        });

        return this;
    }

    static fetchAll(callback)
    {
        getDataFromFile(Product.productsData(), callback);

        return this;
    }

    static findById(id, callBack) {
        getDataFromFile(Product.productsData(), (products) => {
            const product = products.find((item) => {
                return item.id == id;
            });

            callBack(product);
        });
    }
}