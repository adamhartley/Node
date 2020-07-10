const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps: true} // setting timestamps to true adds created and updated timestamps to the database
)

module.exports = mongoose.model('Post', postSchema);

/**
 * @swagger
 *  components:
 *    schemas:
 *      Post:
 *        type: object
 *        required:
 *          - title
 *          - imageUrl
 *          - content
 *          - creator
 *        properties:
 *          title:
 *            type: string
 *          imageUrl:
 *            type: string
 *            format: uri
 *            description: URL for the image.
 *          content:
 *              type: string
 *              description: Text content of the post.
 *          createdAt:
 *              type: string
 *              format: date-time
 *          updatedAt:
 *              type: string
 *              format: date-time
 *          creator:
 *              description: The author of the post.
 *              type: object
 *              $ref: '#/components/schemas/User'
 *        example:
 *           title: Post Title
 *           imageUrl: images/duck.jpeg
 *           content: 'This is the post content'
 *           createdAt: 2020-07-08T19:21:19.344Z
 *           updatedAt: 2020-07-09T14:55:16.548Z
 */