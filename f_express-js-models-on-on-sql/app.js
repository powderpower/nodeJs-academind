const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');
const session       = require('express-session');

/** (session) - с каким пакетом объединить */
const MySQLStore    = require('express-mysql-session') (session);
const db            = require('./config/db');
const sequelize     = require('./utils/database');

const adminRoutes       = require('./routes/admin');
const shopRoutes        = require('./routes/shop');
const errorController   = require('./controllers/error');
const authRoutes        = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

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
 * Флэш-уведомления.
 */
const flash = require('connect-flash');
app.use(flash());

/**
 * Объявление middleware
 */
const authMiddleware    = require('./middleware/is_auth');

const csrf              = require('csurf');
const csrfProtection    = csrf();

/**
 * csrf проверка отрабаытвает
 * для всех не GET запросов.
 */
app.use(csrfProtection);

/**
 * Раздать переменные на все вью
 * НО - csrfToken нужно прописать в формы.
 */
app.use((req, res, next) => {
    res.locals.isAuthenticated      = req.session.isLoggedIn;
    res.locals.csrfToken            = req.csrfToken();
    res.locals.oldInput             = req.session.oldInput || {};
    res.locals.validationErrors    = req.session.validation_errors || [];

    req.session.oldInput = {};
    req.session.validation_errors = [];

    next();
})

app.use((req, res, next) => {
    console.log('\x1b[33m%s\x1b[0m', 'In the middleware. Token: ' + req.csrfToken());
    next();
});

/**
 * Объявление использования роутов.
 */
app.use('/admin', authMiddleware, adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorController.throwNotFoud);
app.use(errorController.throwInternalServerError);

/**
 * Models
 */
const Product       = require('./models/product');
const User          = require('./models/user');
const Cart          = require('./models/cart');
const CartItem      = require('./models/cart_item');
const Order         = require('./models/order');
const OrderItem     = require('./models/order_item');
const PasswordReset = require('./models/password_reset');

/**
 * Объявление релейшенов.
 */
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'SET NULL',
});

PasswordReset.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);
User.hasOne(PasswordReset);

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
    .sync()
    .then(v => app.listen(3000))
    .catch(err => console.log(err));