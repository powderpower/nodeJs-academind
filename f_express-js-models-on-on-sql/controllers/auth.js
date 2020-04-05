const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        activeLogin: true,
        isAuthenticated: false,
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        activeSignup: true,
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const query = User.findByPk(1);

    let userIdentity = null;

    return query
        .then(user => {
            if (! user) {
                let query = User.create({
                    name: 'admin',
                    email: 'ace7upp@gmail.com',
                    password: 'zqGML5g3JPpQZazx',
                });

                return query
                    .then(newUser => {
                        userIdentity = newUser;

                        return userIdentity;
                    });
            }

            return user;
        })
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            
            /**
             * Действия на которые влияют данные сессии
             * лучше выполнять, когда сессия записана.
             */
            return req.session.save(() => {
                return user.getCart();
            });
        })
        .then(cart => {
            if (! cart && userIdentity) {
                userIdentity.createCart();
            }
        })
        .then(v => res.redirect('/'))
        .catch(x => console.log(x));
};

exports.postSignup = (req, res, next) => {
    res.redirect('/');
};

exports.postLogout = (req, res, next) => {
    req.session
        .destroy(v => res.redirect('/'));
};
