const express   = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post(
    '/login',
    [
        check('email')
        .custom(async (value, {req}) => {
            const password  = req.body.password;
            
            if (! value.length) {
                throw new Error('email is required');
            }
            
            const user = await User.findOne({
                where: {
                    email: value,
                }
            });
        
            if (! user) {
                throw new Error('user with that email not found');
            }
        
            const isOnMatch = await bcrypt
                .compare(
                        password,
                        user.password
                    );
        
            if (! isOnMatch) {
                throw new Error('invalid password');
            }
        })
        .normalizeEmail(),

        check('password')
            .isLength({ min: 5 })
            .withMessage('password must be at least 5 chars long')
            .trim(),
    ],
    authController.postLogin);

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
        })
        .normalizeEmail(),

        check('name')
            .isLength({min: 5})
            .withMessage('name must be at least 5 chars long')
            .isAlphanumeric()
            .withMessage('name must contain only numbers and text'),

        check('password')
            .isLength({min: 5})
            .withMessage('password must be at least 5 chars long')
            .isAlphanumeric()
            .withMessage('password must contain only numbers and text')
            .trim(),

        check('confirm_password')
            .custom((value, { req }) => {
                
                if (value == req.body.password) {
                    return true;
                }

                throw new Error('passwords have to match');
            })
            .trim(),
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;