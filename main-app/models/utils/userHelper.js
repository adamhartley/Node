const User = require('../user')
const ReportingUser = require('../reporting/user')
const MongooseUser = require('../reporting/mongoose/user')

exports.isValidSignupEmail = (email, cb) => {
    let isValid;
    return MongooseUser.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                console.log("Mongo user {} already exists", userDoc);
                isValid = false;
            } else {
                isValid = true;
            }
            // MySql user
            User.count({
                where: {email: email}
            })
                .then(count => {
                    if (count > 0) {
                        console.log("MySQL user already exists");
                        isValid = false;
                    }
                });
            return isValid;
        })
        .then(isValid => {
            return new Promise((resolve => {
                resolve(isValid);
            }))
        })
}