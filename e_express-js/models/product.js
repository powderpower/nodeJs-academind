const fs    = require('fs');
const path  = require('path');
const rootDir = require('../utils/path');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    productsData()
    {
        return path.join(rootDir, 'data', 'products.json');
    }

    save()
    {
       const filePath = this.productsData();

       fs.readFile(filePath, (err, fileContent) => {
            if (! err) {
                return false;
            }
        
            let products = [];
        
            if (! err) {
                products = JSON.parse(fileContent);
            }
        
        console.log(fileContent);
       });

        return this;
    }

    static fetchAll()
    {
        return products;
    }
}