const { body, validationResult } = require('express-validator');

//* Model
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');

//* Middleware
const { protectUserAccount } = require('./auth.middlewares');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next('User not found', 404);
  }

  req.user = user;
  next();
});

const orderExists = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    attributes: ['id', 'cartId', 'userId', 'totalPrice'],
    include: {
      model: Cart,
      attributes: ['userId', 'status'],
      include: {
        model: ProductsInCart,
        attributes: ['cartId', 'status', 'quantity', 'productId'],
        include: {
          model: Product,
          attributes: ['title', 'price', 'description', 'quantity'],
        },
      },
    },
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You are not the owner of that Order', 403));
  }

  req.order = order;
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

const createUserValidator = [
  body('username')
    .isString()
    .withMessage('Username must be a String')
    .notEmpty()
    .withMessage('Username can not be empty')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a String')
    .notEmpty()
    .withMessage('Password can not be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  checkValidations,
];

const updateUserValidator = [
  userExists,
  body('username')
    .isString()
    .withMessage('Username must be a String')
    .notEmpty()
    .withMessage('Username can not be empty')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  protectUserAccount,
  checkValidations,
];

const deleteUservalidator = [userExists, protectUserAccount];

module.exports = {
  userExists,
  createUserValidator,
  updateUserValidator,
  deleteUservalidator,
  orderExists,
};
