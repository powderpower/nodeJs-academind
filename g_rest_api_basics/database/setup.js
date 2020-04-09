const Sequelize = require('sequelize');
const db        = require('../config/db');

const sequelize = new Sequelize(
   db.config.database,
   db.config.user,
   db.config.password, {
       dialect: 'mysql',
       host: db.config.host,
       define: {
           underscored: true,
       },
       timezone: '+03:00',
});

module.exports = sequelize;