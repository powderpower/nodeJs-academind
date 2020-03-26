const express   = require('express');
const path      = require('path');

const rootDir   = require('../util/path');

const router = express.Router();

router.get('/', (req, res) => {
    // path.join() - чтобы не париться с "/"" в линуксе или "\"" в винде
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;