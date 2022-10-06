//* Model
const { Category } = require('../models/category.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    where: { status: 'active' },
    attributes: ['id', 'name'],
  });

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name,
  });

  res.status(201).json({
    status: 'success',
    data: { newCategory },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  category.update({
    name,
  });

  res.status(204).json({
    messague: 'Your Category is Updated!!!',
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  category.update({
    status: 'inactive',
  });

  res.status(204).json({
    messague: 'Your Category is Deleted!!!',
  });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
