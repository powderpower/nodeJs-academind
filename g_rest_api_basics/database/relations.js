const Post = require('../models/post');
const User = require('../models/user');

exports.defineRelations = () => {
    Post.belongsTo(User, {
        constraints: true,
        onDelete: 'SET NULL',
    });

    User.hasMany(Post);

    return true;
}