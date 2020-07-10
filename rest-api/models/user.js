const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'NEW'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

module.exports = mongoose.model('User', userSchema);

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *          - name
 *          - status
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *              type: string
 *              format: password
 *              description: Password for the user, must be at least 5 characters
 *          status:
 *              type: string
 *              description: Status of the user, default is 'NEW'
 *          posts:
 *              description: An array of posts made by the user.
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Post'
 *        example:
 *          _id:
 *          status: NEW
 *          posts: ["5f061caf63f4c7bc44280d08"]
 *          email: test@test.com
 *          password:
 *          name: test
 */