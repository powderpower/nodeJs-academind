const path = require('path');

exports.processNotFoudError = (req, res) => {
    res.status(404)
        .render('errors/404', {
            pageTitle: 'Page not found',
            isAuthenticated: req.session.isLoggedIn,
        });
        
        /*
        .sendFile(path.join(__dirname, '.', 'views', 'errors', '404.html'));
        */
};