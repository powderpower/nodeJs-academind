const express   = require('express');
const { check } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post(
    '/posts',
    [
        check('title')
            .trim()
            .isLength({
                min: 5,
            }),

        check('content')
            .trim()
            .isLength({
                min: 5,
            }),
    ],
    feedController.createPost
);

module.exports = router;