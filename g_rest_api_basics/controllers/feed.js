const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res) => {
    return res.json({
        posts: [{
            id: 1,
            title: 'The First Post',
            content: 'This is the first post',
            imageUrl:'images/duck.jpg',
            creator: {
                name: 'Andrey',
            },
            createdAt: new Date,
        }]
    });
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if (! errors.isEmpty()) {
        return res.status(422)
            .json({
                message: 'Validation failed',
                errors: errors.array(),
            });
    }

    const user = await User.findByPk(1);

    const title     = req.body.title;
    const image_url = req.body.imageUrl;
    const content   = req.body.content;

    const post = await user.createPost({
        title,
        image_url: '/dummy/pictutr.jpeg',
        content,
    });
    
    return res.json({
        message: 'Post created successfully!',
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            creator: {
                name: user.name,
            },
            createdAt: post.createdAt,
        }
    });
}

