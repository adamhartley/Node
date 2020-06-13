/*
 * Authorization controller
 */

const crypto = require('crypto')
const bcrypt = require('bcryptjs')

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
        errorMessage: errorMessage
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

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
        })

    MongooseUser.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('mongoUserError', 'Invalid email or password.');
                return res.redirect('/login');
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
                    req.flash('mongoUserError', 'Invalid email or password.');
                    res.redirect('/login');
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
        errorMessage: errorMessage
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    MongooseUser.findOne({email: email})
        .then(userDoc => {
            if (userDoc) { // if user exists, redirect to /signup TODO: improve error message if user found
                console.log("Mongo user {} already exists", userDoc);
                req.flash('mongoUserError', 'E-mail address already exists');
                return;
                // return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new MongooseUser({
                        email: email,
                        password: hashedPassword,
                        cart: {item: []}
                    });
                    return user.save();
                });
        })
        .catch(err => {
            console.log(err);
        });

    // MySql user
    User.count({
        where: {email: email}
    })
        .then(count => {
            if (count > 0) {
                console.log("MySQL user already exists"); // TODO: improve error message if user found
                // return res.redirect('/login');
                return res.redirect('/login');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    return User.create({
                        email: email,
                        password: hashedPassword
                    });
                })
                .then(() => {
                    return res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('mongoUserError');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');

        console.log('email : ' + req.body.email);
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
                    // send token reset email, faking with log message
                    console.log('Dear user, a password reset email has been requested, click this link to reset: http://localhost:3000/reset/' + token);
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
                mongooseUserId: user._id.toString()
            });
        })
        .catch(err => {
            console.log(err);
        })
}