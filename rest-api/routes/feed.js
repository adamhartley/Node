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