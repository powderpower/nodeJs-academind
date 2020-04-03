const db = require('../utils/database');

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

    save()
    {
        return db.execute('INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)',
            [
                this.title,
                this.price,
                this.image_url,
                this.description,
            ]);
    }

    static deleteById(id)
    {

    }

    static fetchAll()
    {
        return db.execute('SELECT * FROM products');
    }

    static findById(id)
    {
        return db.execute('SELECT * FROM products where id=?', [id]);
    }
}