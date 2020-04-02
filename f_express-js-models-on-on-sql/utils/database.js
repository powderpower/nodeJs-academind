const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.168.10.170',
    database: 'node_shop',
    user: 'node_shop',
    password: 'node_shop',
});

module.exports = pool.promise();