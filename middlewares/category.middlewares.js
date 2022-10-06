const { body, validationResult } = require('express-validator');

//* Models
const { Category } = require('../models/category.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const categoryExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ where: { id } });

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

const createCategoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isString()
    .withMessage('Name must be String')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  checkValidations,
];

const updateCategyValidator = [
  categoryExists,
  body('name')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isString()
    .withMessage('Name must be String')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  checkValidations,
];

const deleteCategoryValidator = [categoryExists];

module.exports = {
  createCategoryValidator,
  updateCategyValidator,
  deleteCategoryValidator,
};
