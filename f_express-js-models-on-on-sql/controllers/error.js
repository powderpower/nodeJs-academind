const path = require('path');

exports.throwNotFoud = (req, res) => {
    res.status(404)
        .render('errors/404', {
            pageTitle: 'Page not found',
        });
        
        /*
        .sendFile(path.join(__dirname, '.', 'views', 'errors', '404.html'));
        */
};

exports.throwBadRequest = (req, res) => {
    res.status(400)
        .render('errors/400', {
            pageTitle: 'Access denied',
        });
};