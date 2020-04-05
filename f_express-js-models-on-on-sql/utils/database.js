/**
 * Для работы sequelize
 * так же требуется mysql2
 */

 const Sequelize = require('sequelize');
 const db = require('../config/db');

 const sequelize = new Sequelize(
    db.config.database,
    db.config.user,
    db.config.password, {
        dialect: 'mysql',
        host: db.config.host,
        define: {
            underscored: true,
        },
        dialectOptions: {
            useUTC: false,
        },
        timezone: '+03:00',
 });

 module.exports = sequelize;