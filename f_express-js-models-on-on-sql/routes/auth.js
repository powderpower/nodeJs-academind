const express   = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);

router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .withMessage('e-mail is not valid')
        .custom(async (value, {req}) => {
            if (value == 'test@test.com') {
                throw new Error('This email address is forbidden');
            }

            const existingUser = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });
        
            if (existingUser) {
                throw new Error('email exists already');
            }
        }),
        check('name')
            .isLength({min: 5})
            .withMessage('name min length is 5')
            .isAlphanumeric()
            .withMessage('name must contain only numbers and text'),
        check('password')
            .isLength({min: 5})
            .withMessage('password min length is 5')
            .isAlphanumeric()
            .withMessage('password must contain only numbers and text'),
        check('confirm_password')
            .custom((value, { req }) => {
                
                if (value == req.body.password) {
                    return true;
                }

                throw new Error('passwords have to match');
            }),
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;