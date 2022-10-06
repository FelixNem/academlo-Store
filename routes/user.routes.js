const express = require('express');

//* Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderbyId,
  login,
} = require('../controllers/user.controllers');

//* Middlewares
const {
  createUserValidator,
  updateUserValidator,
  deleteUservalidator,
  orderExists,
} = require('../middlewares/user.middlewares');
const { protectSesion } = require('../middlewares/auth.middlewares');

const userRoutes = express.Router();

//* Routes
userRoutes.get('/', getAllUsers);
userRoutes.post('/', createUserValidator, createUser);
userRoutes.post('/login', login);

userRoutes.use(protectSesion);
userRoutes.patch('/:id', updateUserValidator, updateUser);
userRoutes.delete('/:id', deleteUservalidator, deleteUser);
userRoutes.get('/orders', getAllOrders);
userRoutes.get('/orders/:id', orderExists, getOrderbyId);

module.exports = { userRoutes };
