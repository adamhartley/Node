const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user')

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .populate('creator')
                .sort({createdAt: -1}) // sort by createdAt descending, newest first
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200)
                .json({
                    message: 'Successfully fetched posts!',
                    posts: posts,
                    totalItems: totalItems
                })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createPost = (req, res, next) => {
    console.log('Creating post...');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, data entered is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided!');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    post.save()
        .then(result => {
            console.log(result);
            return User.findById(req.userId);
        })
        .then(user => {
            console.log('Setting user posts...')
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            // send new post to all users via websocket
            io.getIO().emit('posts', {
                action: 'create',
                post: {
                    ...post._doc,
                    creator: {
                        _id: req.userId,
                        name: creator.name
                    }
                }
            });

            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {_id: creator._id, name: creator.name}
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200)
                .json({
                    message: 'Post fetched.',
                    post: post
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, data entered is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    // check if the image is different than the image originally used, set path if it is a new image file
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file present!');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .populate('creator') // fetch all user data when querying post
        .then(post => {
            if (!post) {
                const error = new Error('No post found');
                error.statusCode = 404;
                throw error;
            }

            // check if creator id is the same as the logged in user
            if (post.creator._id.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            // if there is a new image in the update, delete the old one
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            // emit websocket event to update all clients
            io.getIO().emit('posts', {action: 'update', post: result});

            res.status(200)
                .json({
                    message: 'Post updated!',
                    post: result
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('No post found');
                error.statusCode = 404;
                throw error;
            }

            // check if creator id is the same as the logged in user
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error;
            }

            // check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            io.getIO().emit('posts', {action: 'delete', post: postId});

            res.status(200)
                .json({
                    message: 'Post deleted!'
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
}