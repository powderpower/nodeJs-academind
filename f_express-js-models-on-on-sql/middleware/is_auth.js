const errorController   = require('../controllers/error');

module.exports = (req, res, next) => {
    if (! req.session.isLoggedIn) {
        return errorController.throwBadRequest(req, res);
    }

    return next();
}