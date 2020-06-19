/*
 * Authorization controller
 */

const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check') // use ES6 destructuring to unpack check function

const User = require('../models/user')
const ReportingUser = require('../models/reporting/user')
const MongooseUser = require('../models/reporting/mongoose/user')

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('mongoUserError');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessage,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        })
    }
    // MySql user
    User.findAll({where: {email: email}})
        .then(users => {
            const user = users[0]; // sequelize findall() returns an array
            bcrypt.compare(password, user.password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        console.log('MySQL user passwords confirmed');
                        req.session.user = user.id;
                        return req.session.save(err => {
                            console.log('Saving MySQL user to session...');
                            console.log(err);
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        });

    MongooseUser.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                })
            }
            bcrypt.compare(password, user.password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        req.session.mongooseUser = user;
                        req.session.reportingUser = new ReportingUser(user.name, user.email, user.cart, user._id);
                        req.session.isLoggedIn = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('mongoUserError');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: errorMessage,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Sign Up',
            errorMessage: errors.array()[0].msg,
            oldInput: {email: email, password: password, confirmPassword: req.body.confirmPassword},
            validationErrors: errors.array()
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new MongooseUser({
                email: email,
                password: hashedPassword,
                cart: {item: []}
            });

            User.create({
                email: email,
                password: hashedPassword
            });

            return user.save();
        })
        .then(() => {
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('mongoUserError');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    let userMessage = req.flash('userMessage');

    if (userMessage.length > 0) {
        userMessage = userMessage[0];
    } else {
        userMessage = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errorMessage,
        userMessage: userMessage
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        // find user which we're trying to reset
        MongooseUser.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('mongoUserError', 'Unknown email address');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // expire in one hour from now
                return user.save();
            })
            .then(result => {
                if (result) {
                    req.flash('userMessage', 'Reset password link has been sent to your inbox');
                    // send token reset email, faking with log message
                    console.log('Dear user, a password reset email has been requested, click this link to reset: http://localhost:3000/reset/' + token);
                    return res.redirect('/reset');

                }
            })
            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    MongooseUser.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let errorMessage = req.flash('mongoUserError');

            if (errorMessage.length > 0) {
                errorMessage = errorMessage[0];
            } else {
                errorMessage = null;
            }

            console.log('Found a user ' + user);

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: errorMessage,
                passwordToken: token,
                mongooseUserId: user._id.toString()
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const mongooseUserId = req.body.mongooseUserId;
    const token = req.body.passwordToken;
    let mongooseUser;
    let hashedPassword

    MongooseUser.findOne({
        resetToken: token,
        resetTokenExpiration: {$gt: Date.now()},
        _id: mongooseUserId
    })
        .then(user => {
            mongooseUser = user;
            return bcrypt.hash(newPassword, 12)
                .then(pw => {
                    hashedPassword = pw;
                });
        })
        .then(() => {
            User.findAll({where: {email: mongooseUser.email}})
                .then(users => {
                    return users[0];
                })
                .then(user => {
                    console.log('Updating mySql user...');
                    user.password = hashedPassword;
                    return user.save();
                })
        })
        .then(() => {
            mongooseUser.password = hashedPassword;
            mongooseUser.resetToken = undefined;
            mongooseUser.resetTokenExpiration = undefined;
            console.log('Updating mongoUser...');
            return mongooseUser.save();
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}