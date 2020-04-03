const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');

const adminRoutes       = require('./routes/admin');
const shopRoutes        = require('./routes/shop');
const errorController   = require('./controllers/error');

const sequelize = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use((req, res, next) => {
    console.log('In the middleware');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    let query = User.findByPk(1);

    query
        .then(user => {
            /**
             * Добавляет модель юзера в запрос.
             */
            req.user = user;

            next();
        })
        .catch(x => console.log(x));
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.processNotFoudError);

/**
 * Models
 */
const Product   = require('./models/product');
const User      = require('./models/user');
const Cart      = require('./models/cart');
const CartItem  = require('./models/cart_item');

/**
 * Объявление релейшенов.
 */
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

let userIdentity = null;

/**
 * Создает таблицы из созданных моделей.
 */
sequelize
    /** { force: true } только для девелопа - продакш - миграции */
    .sync()
    .then(v => User.findByPk(1))
    .then(user => {
        if (! user) {
            user = User.create({
                name: 'admin',
                email: 'ace7upp@gmail.com',
                password: 'zqGML5g3JPpQZazx',
            });
        }

        userIdentity = user;

        return user;
    })
    .then(user => {
        return user.getCart();
    })
    .then(cart => {
        if (! cart && userIdentity) {
            userIdentity.createCart();
        }
    })
    .then(v => app.listen(3000))
    .catch(err => console.log(err));