exports.getPosts = (req, res) => {
    return res.json({
        posts: [{
            title: 'The First Post',
            content: 'This is the first post',
        }]
    });
};

exports.createPost = (req, res, next) => {
    return res.json({
        message: 'Post created successfully!',
        post: {
            id: new Date().toISOString(),
            title: req.body.title,
            content: req.body.content,
        }
    });
}

