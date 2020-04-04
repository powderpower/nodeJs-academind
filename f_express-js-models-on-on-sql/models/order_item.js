const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const OrderItem = sequelize.define('order_item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = OrderItem;