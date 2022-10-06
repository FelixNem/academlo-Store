const { db, DataTypes } = require('../utils/database.utils');

const Cart = db.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'purchased'),
    defaultValue: 'active',
  },
});

module.exports = { Cart };
