/*
 * Authorization controller
 */

const bcrypt = require('bcryptjs')

const User = require('../models/user')
const ReportingUser = require('../models/reporting/user')
const MongooseUser = require('../models/reporting/mongoose/user')

exports.getLogin = (req, res, next) => {
    console.log('Cookie ' + req.get('Cookie'))
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    })
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
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: false
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