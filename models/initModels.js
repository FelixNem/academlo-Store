//* Models
const { User } = require('./user.model');
const { Product } = require('./product.model');
const { Category } = require('./category.model');
const { Order } = require('./order.model');
const { Cart } = require('./cart.model');
const { ProductsInCart } = require('./productsInCart.model');
const { ProductImgs } = require('./productImg.model');

const initModels = () => {
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);

  User.hasOne(Cart);
  Cart.belongsTo(User);

  Cart.hasOne(Order);
  Order.belongsTo(Cart);

  Cart.hasMany(ProductsInCart, { foreignKey: 'cartId' });
  ProductsInCart.belongsTo(Cart);

  User.hasMany(Product, { foreignKey: 'userId' });
  Product.belongsTo(User);

  Product.hasMany(ProductImgs, { foreignKey: 'productId' });
  ProductImgs.belongsTo(Product);

  Product.hasOne(ProductsInCart, { foreignKey: 'productId' });
  ProductsInCart.belongsTo(Product);

  Category.hasOne(Product);
  Product.belongsTo(Category);
};

module.exports = { initModels };
