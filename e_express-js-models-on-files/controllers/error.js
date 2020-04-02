const path = require('path');

exports.processNotFoudError = (req, res) => {
    res.status(404)
        .render(path.join('errors', '404'), { pageTitle: 'Page not found' });
        
        /*
        .sendFile(path.join(__dirname, '.', 'views', 'errors', '404.html'));
        */
};