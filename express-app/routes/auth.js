const express = require('express');
const {check, body} = require('express-validator/check') // use ES6 destructuring to unpack specific function
const path = require('path');

const authController = require('../controllers/auth')
const MongooseUser = require('../models/reporting/mongoose/user')
const User = require('../models/user')
const userHelper = require('../models/utils/userHelper')

const router = express.Router();

router.get('/login', authController.getLogin)

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),
        body('password')
            .trim()
    ],
    authController.postLogin);

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post(
    '/signup',
    [
        check('email') // could have used body() instead of check(), but demonstrating use of other functions
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req}) => {

                return userHelper.isValidSignupEmail(value)
                    .then(isValid => {
                        console.log('isValidEmail: ' + isValid);
                        if (isValid) {
                            return isValid;
                        } else {
                            return Promise.reject('Email address already in use');
                        }
                    });
            })
            .normalizeEmail(),
        body('password',
            'Please enter a password using letters and numbers, with a length of at least four characters.')
            .isLength({min: 4})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match!');
                }
                return true;
            })
    ],
    authController.postSignup
)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;