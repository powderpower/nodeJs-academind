const bcrypt                = require('bcryptjs');
const crypto                = require('crypto');
const { Op }                = require('sequelize');
const { validationResult }  = require('express-validator');

const User          = require('../models/user');
const PasswordReset = require('../models/password_reset');

/**
 * Пакеты для отправки почты.
 */
const nodeMailer        = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodeMailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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',
    },
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        activeLogin: true,
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        activeSignup: true,
    });
};

exports.getReset = (req, res, next) => {
    return res.render('auth/reset', {
        pageTitle: 'Reset password',
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    let query = PasswordReset.findOne({
        where: {
            reset_token: token,
            expiration_date: {
                [Op.gt]: Date.now(),
            },
        }
    });

    return query
        .then(passwordReset => {
            if (! passwordReset) {
                req.flash('error', 'Ivalid Token');

                return res.redirect('/login');
            }
            
            return res.render('auth/new_password', {
                pageTitle: 'New password',
                passwordToken: token,
            });
        })
        .catch(x => console.log(x));
}

/**
 * async пишется перед фугкцией,
 * в которой планируется использование await
 * await пишется перед функцией которая вернет промис.
 */
exports.postLogin = async (req, res, next) => {
    const email     = req.body.email;
    const password  = req.body.password;
    
    const errors = validationResult(req);

    if (! errors.isEmpty()) {
        req.session.validation_errors = errors.array();

        req.session.oldInput = {
            email,
            password,
        };
        
        return res.status(422)
            .redirect('/login');
    }

    const user = await User.findOne({
        where: {
            email: email,
        }
    });

    req.session.user = user;
    req.session.isLoggedIn = true;

    return req.session.save(() => {
        return res.redirect('/');
    });
};

exports.postSignup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    const errors = validationResult(req);

    if (! errors.isEmpty()) {
        req.session.validation_errors = errors.array();

        req.session.oldInput = {
            name,
            email,
            password,
            confirm_password,
        };
        
        return res.status(422)
            .redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = await User.create({
        name: req.body.name,
        email: email,
        password: hashedPassword,
    });

    user.createCart();

    transporter.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup Succeeded',
        html: '<h1>You successfully signed up to node shop!</h1>',
    })
    .then(v => console.log("\x1b[32m", 'SendGrid response: ' + v.message))
    .catch(err => console.log(err));

    return res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    return req.session
        .destroy(err => {
            return res.redirect('/');
        });
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;

    let query = User.findOne({
        where: {
            email: email,
        },
    });

    return query
        .then(user => {
            if (! user) {
                req.flash('error', 'User with that email not found.');

                return res.redirect('/reset');
            }

            return crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    return res.redirect('/reset');
                }

                const token = buffer.toLocaleString('hex');

                return user.getPasswordReset()
                    .then(passwordReset => {
                        if (passwordReset) {
                            passwordReset.destroy();
                        }

                        return passwordReset;
                    })
                    .then(v => user.createPasswordReset({
                        reset_token: token,
                        expiration_date: Date.now() + 36e5,
                    }))
                    .then(v => {
                        /**
                         * `` - дают возможность писать
                         * в несколько строк
                         */
                        res.redirect('/');

                        transporter.sendMail({
                            to: email,
                            from: 'shop@node-complete.com',
                            subject: 'Password Reset',
                            html: `
                                <p>You requested a password reset</p>
                                <p>Click <a href="http://localhost:3000/reset/${token}">this link</a> to set a new password</p>
                            `,
                        });
                    })
                    .catch(x => console.log(x));
            });
        })
        .catch(x => console.log(x));
}

exports.postNewPassword = (req, res, next) => {
    const newPassword   = req.body.password;
    const passwordToken = req.body.password_token;
    
    let userOnReset = null;

    let query = PasswordReset.findOne({
        where: {
            reset_token: passwordToken,
        }
    });

    return query
        .then(passwordReset => {
            if (! passwordReset) {
                req.flash('error', 'Invalid token.');
                
                return res.redirect('/login');
            }
            
            return passwordReset.getUser()
                .then(user => {
                    if (! user) {
                        req.flash('error', 'User not found.');
                
                        return res.redirect('/login');
                    }

                    userOnReset = user;

                    console.log('here');

                    return bcrypt.hash(newPassword, 12)
                        .then(hashedPassword => {
                            userOnReset.password = hashedPassword;
                            
                            return userOnReset.save();
                        })
                        .then(user => {
                            return user.getPasswordReset();
                        })
                        .then(passwordReset => passwordReset.destroy())
                        .then(v => res.redirect('/login'))
                        .catch(x => console.log(x));
                })
                .catch(x => console.log(x));
        })
        .catch(x => console.log(x));
}
