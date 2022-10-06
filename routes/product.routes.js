const express = require('express');

//* Controllers
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controllers');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controllers');

//* Middlewares
const {
  productExists,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../middlewares/product.middlewares');
const {
  createCategoryValidator,
  updateCategyValidator,
  deleteCategoryValidator,
} = require('../middlewares/category.middlewares');
const { protectSesion } = require('../middlewares/auth.middlewares');

//* utils
const { multerUpload } = require('../utils/multer.utils');

const productsRoutes = express.Router();

//* Routes
productsRoutes.get('/categories', getAllCategories);
productsRoutes.get('/', getAllProducts);
productsRoutes.get('/:id', productExists, getProductById);

productsRoutes.use(protectSesion);
productsRoutes.post(
  '/',
  multerUpload.array('productImg', 5),
  createProductValidator,
  createProduct
);
productsRoutes.patch('/:id', updateProductValidator, updateProduct);
productsRoutes.delete('/:id', deleteProductValidator, deleteProduct);
//* Categories
productsRoutes.post('/categories', createCategoryValidator, createCategory);
productsRoutes.patch('/categories/:id', updateCategyValidator, updateCategory);
productsRoutes.delete(
  '/categories/:id',
  deleteCategoryValidator,
  deleteCategory
);

module.exports = { productsRoutes };
