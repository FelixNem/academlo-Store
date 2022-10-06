const express = require('express');

//* Controllers
const {
  getAllCart,
  addProductInCart,
  updateCart,
  deleteProductinCart,
  purchaseCart,
} = require('../controllers/cart.conrollers');

//* Middlewares
const {
  cartExists,
  addProductValidator,
  updateCartValidator,
  deleteProductinVartValidator,
} = require('../middlewares/cart.middlewares');
const { protectSesion } = require('../middlewares/auth.middlewares');

const cartRoutes = express.Router();

//* Routes
cartRoutes.use(protectSesion);
cartRoutes.get('/getCart', cartExists, getAllCart);
cartRoutes.post('/add-product', addProductValidator, addProductInCart);
cartRoutes.patch('/update-cart', updateCartValidator, updateCart);
cartRoutes.delete(
  '/:productId',
  deleteProductinVartValidator,
  deleteProductinCart
);
cartRoutes.post('/purchase', cartExists, purchaseCart);

module.exports = { cartRoutes };
