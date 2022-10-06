const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

//* Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

dotEnv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: ['id', 'username', 'email', 'role'],
  });

  res.status(200).json({
    status: 'Success',
    data: { users },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hasedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hasedPassword,
  });

  newUser.password = undefined;
  res.status(201).json({
    status: 'Success',
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({
    username,
    email,
  });

  res.status(204).json({
    messague: 'Your user is Updated!!!',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({
    status: 'inactive',
  });

  res.status(204).json({
    messague: 'Your user is Deleted!!!',
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    attributes: ['id', 'cartId', 'totalPrice'],
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

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

const getOrderbyId = catchAsync(async (req, res, next) => {
  const { order } = req;

  res.status(200).json({
    status: 'Success',
    data: { order },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('wrong credentials', 404));
  }

  //* remove password from response
  user.password = undefined;

  //* Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.ultraSecretKey, {
    expiresIn: '1d',
  });

  res.status(200).json({
    status: 'Success',
    messague: 'You are logged',
    data: { user, token },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderbyId,
  login,
};
