const fs    = require('fs');
const path  = require('path');
const rootDir = require('../utils/path');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    static productsData()
    {
        return path.join(rootDir, 'data', 'products.json');
    }

    save()
    {
       const filePath = Product.productsData();

       fs.readFile(filePath, (err, fileContent) => {
            let products = [];
        
            if (! err) {
                products = JSON.parse(fileContent);
            }
        
            products.push(this);

            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
       });

        return this;
    }

    static fetchAll(callback)
    {
        const filePath = this.productsData();
        
        fs.readFile(filePath, (err, fileContent) => {
            if (err) {
                callback([]);
            }

            callback(JSON.parse(fileContent));
        });
    }
}