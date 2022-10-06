const { db, DataTypes } = require('../utils/database.utils');

const ProductsInCart = db.define('productsInCart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'removed', 'purchased'),
    defaultValue: 'active',
  },
});

module.exports = { ProductsInCart };
