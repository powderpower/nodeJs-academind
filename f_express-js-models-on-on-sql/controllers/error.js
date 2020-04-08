const logger = require('../utils/logger');

exports.throwNotFoud = (req, res) => {
    return res.status(404)
        .render('errors/404', {
            pageTitle: 'Page not found',
        });
};

exports.throwBadRequest = (req, res) => {
    return res.status(400)
        .render('errors/400', {
            pageTitle: 'Access denied',
        });
};

exports.throwInternalServerError = (err, req, res, next) => {
    logger.log('error', err.stack);
    
    return res.status(500)
        .render('errors/500', {
            pageTitle: '500 | Internal server error',
            errors: err.stack,
        });
}