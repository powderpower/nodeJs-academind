const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');
const session       = require('express-session');
/** (session) - с каким пакетом объединить */
const MySQLStore      = require('express-mysql-session') (session);

const db = require('./config/db');

const adminRoutes       = require('./routes/admin');
const shopRoutes        = require('./routes/shop');
const errorController   = require('./controllers/error');
const authRoutes        = require('./routes/auth');

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

const sessionStore = new MySQLStore({
    host: db.config.host,
    port: db.config.port,
    user: db.config.user,
    password: db.config.password,
    database: db.config.database,
});

const hour = 3600000;

app.use(session({
    secret: 'my secret', // для продакшна должен быть хэш
    resave: false, // не перезаписывать при каждом реквесте
    saveUninitialized: false, // не перезаписывать, если ничего не было изменено
    store: sessionStore,
    cookie: {
        maxAge: 14 * 24 * hour,
    },
}));

app.use((req, res, next) => {
    
    console.log(req.session.user);
    
    if (! req.session.user) {
        return next();
    }
    
    /** если записан в сессию - присвоить его в модель запроса
     * потому-что в сессию не пишется модель,
     * а только строка пользователя
    */

    let query = User.findByPk(req.session.user.id);

    return query
        .then(user => {
            /**
             * Добавляет модель юзера в запрос.
             */
            req.user = user;

            next();
        })
        .catch(x => console.log(x));
});

/**
 * Объявление использования роутов.
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.processNotFoudError);

/**
 * Models
 */
const Product   = require('./models/product');
const User      = require('./models/user');
const Cart      = require('./models/cart');
const CartItem  = require('./models/cart_item');
const Order     = require('./models/order');
const OrderItem = require('./models/order_item');

/**
 * Объявление релейшенов.
 */
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'SET NULL',
});

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Cart.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

Order.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsToMany(Product, { through: OrderItem });

/**
 * Создает таблицы из созданных моделей.
 */
sequelize
    /** { force: true } только для девелопа - продакш - миграции */
    .sync({ force: true })
    .then(v => app.listen(3000))
    .catch(err => console.log(err));