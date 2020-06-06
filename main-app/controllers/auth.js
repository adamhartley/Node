/*
 * Authorization controller
 */

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
    MongooseUser.findById('5ed7d6456c2aaa3c4b541005')
        .then(user => {
            req.session.mongooseUser = user;
        })
        .catch(err => {
            console.log(err);
        })

    ReportingUser.findById('5ed2c9f6838f3220325b0bb0')
        .then(user => {
            /* create and adding the user to the request object allows us to call ReportingUser methods
               on the object being passed around (e.g. see controllers/reporting/shop-reporting/postCart()) */
            req.session.reportingUser = new ReportingUser(user.name, user.email, user.cart, user._id);
            req.session.isLoggedIn = true;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });

        })
        .catch(err => {
            console.log(err);
        })

    // User.findByPk(1)
    //     .then(user => {
    //         req.session.user = user; // store Sequelize object for use elsewhere in the app
    //         req.session.isLoggedIn = true;
    //         req.session.save(err => {
    //             console.log(err);
    //             res.redirect('/');
    //         });
    //     })
    //     .catch(err => {console.log(err)})
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}