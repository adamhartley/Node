const express = require('express');
const {body} = require('express-validator');

const feedContoller = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedContoller.getPosts);

router.post('/post',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
    ], feedContoller.createPost);

router.get('/post/:postId', feedContoller.getPost);

router.put('/post/:postId',
    isAuth,
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5}),
    feedContoller.updatePost
);

router.delete('/post/:postId', isAuth, feedContoller.deletePost)

module.exports = router;

/**
 * @swagger
 * paths:
 *  /feed/posts/:
 *    get:
 *      summary: Fetch a list of posts
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        "200":
 *          description: Successfully returned list of posts
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                      posts:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 *                      totalItems:
 *                          type: integer
 *
 *    post:
 *      summary: Create a new post and returns the new post object
 *      operationId: createPost
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/PostBody'
 *      responses:
 *          '201':
 *              description: Created
 *          '422':
 *              description: Validation error, incorrect data
 *          '500':
 *              description: Internal error
 *  /feed/posts/{postId}:
 *    get:
 *      summary: Fetch a post by id
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *        "200":
 *          description: Successfully returned post
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                      post:
 *                          $ref: '#/components/schemas/Post'
 *          '404':
 *              description: Post not found
 *          '500':
 *              description: Internal error
 *    put:
 *      summary: Update a post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/PostBody'
 *      responses:
 *        "200":
 *          description: Successfully updated post
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                      post:
 *                          $ref: '#/components/schemas/Post'
 *          '403':
 *              description: Not authorized to update post. Only authors of a post can update.
 *          '404':
 *              description: Post not found
 *          '500':
 *              description: Internal error
 *    delete:
 *      summary: Delete a post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          '200':
 *              description: Successfully deleted post
 *          '403':
 *              description: Not authorized to delete post. Must be author of post to delete.
 *          '404':
 *              description: No post found
 *          '500':
 *              description: Internal error
 * components:
 *      requestBodies:
 *          PostBody:
 *              description: A JSON object containing post information
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title:
 *                                  type: string
 *                              imageUrl:
 *                                  type: string
 *                                  format: uri
 *                              content:
 *                                  type: string
 *                          example:
 *                             title: Post Title
 *                             imageUrl: images/duck.jpeg
 *                             content: 'This is the post content'
 */