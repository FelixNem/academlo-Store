const { body, validationResult } = require('express-validator');

//* Models
const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model');

//* Middlewares
const { protectUserProducts } = require('./auth.middlewares');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id } });

  if (!product) {
    return next('Product not found', 404);
  }

  req.product = product;
  next();
});

const isValidCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.body;

  const category = await Category.findOne({ where: { id: categoryId } });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  req.category = category;
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

const createProductValidator = [
  isValidCategory,
  body('title')
    .notEmpty()
    .withMessage('Title can not be empty')
    .isString()
    .withMessage('Title must be a String')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description can not be empty')
    .isString()
    .withMessage('Description must be a String')
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price can not be empty')
    .isInt()
    .withMessage('Price must be a Integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity can not be empty')
    .isInt()
    .withMessage('Quantity must be a Integer'),
  checkValidations,
];

const updateProductValidator = [
  productExists,
  body('title')
    .notEmpty()
    .withMessage('Title can not be empty')
    .isString()
    .withMessage('Title must be a String')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description can not be empty')
    .isString()
    .withMessage('Description must be a String')
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price can not be empty')
    .isInt()
    .withMessage('Price must be a Integer'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity can not be empty')
    .isInt()
    .withMessage('Quantity must be a Integer'),
  protectUserProducts,
  checkValidations,
];

const deleteProductValidator = [productExists, protectUserProducts];

module.exports = {
  productExists,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
