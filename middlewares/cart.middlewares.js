const { body, validationResult } = require('express-validator');

//* Models
const { ProductsInCart } = require('../models/productsInCart.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const cartExists = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!cart) {
    const newCart = await Cart.create({
      userId: sessionUser.id,
    });

    req.cart = newCart;
    return next();
  }

  req.cart = cart;
  next();
});

const isProductValid = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (!product) {
    return next(new AppError('Product not found', 403));
  }

  req.product = product;
  next();
});

const isProductValidId = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    where: { id: productId, status: 'active' },
  });

  if (!product) {
    return next(new AppError('Product not found', 403));
  }

  req.product = product;
  next();
});

const isStockEnought = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { quantity } = req.body;

  if (product.quantity < quantity) {
    return next(new AppError('not enught stock for product'));
  }

  next();
});

const isProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;

  const productAdded = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId: product.id },
  });

  if (!productAdded) {
    return next(new AppError('product is not in user Cart'));
  }

  req.productAdded = productAdded;
  next();
});

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join('. ');

    return next(new AppError(message, 400));
  }

  next();
};

const addProductValidator = [
  cartExists,
  body('productId')
    .notEmpty()
    .withMessage('product can not be empty')
    .isInt()
    .withMessage('product must be a Integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity can not be empty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a Integer'),
  isProductValid,
  isStockEnought,
  checkValidations,
];

const updateCartValidator = [
  cartExists,
  body('productId')
    .notEmpty()
    .withMessage('product can not be empty')
    .isInt()
    .withMessage('product must be a Integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity can not be empty')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a Integer'),
  isProductValid,
  isStockEnought,
  isProductInCart,
  checkValidations,
];

const deleteProductinVartValidator = [
  cartExists,
  isProductValidId,
  isProductInCart,
];

module.exports = {
  addProductValidator,
  updateCartValidator,
  deleteProductinVartValidator,
  cartExists,
};
