/**
 * Для работы sequelize
 * так же требуется mysql2
 */

 const Sequelize = require('sequelize');

 const sequelize = new Sequelize('node_shop', 'node_shop', 'node_shop', {
    dialect: 'mysql',
    host: '192.168.10.170',
    define: {
        underscored: true,
    }
 });

 module.exports = sequelize;