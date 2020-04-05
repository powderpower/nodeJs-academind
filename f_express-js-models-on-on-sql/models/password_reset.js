const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

/**
 * Объявлять имя связи можно через camelCase
 */
const PasswordReset = sequelize.define('passwordReset', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    reset_token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    expiration_date: {
        type: Sequelize.DATE,
        allowNull: false,
    }
});

module.exports = PasswordReset;