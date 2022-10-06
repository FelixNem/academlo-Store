const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//* Models
const { Product } = require('../models/product.model');
const { ProductImgs } = require('../models/productImg.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { storage } = require('../utils/firebase.utils');

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    attributes: ['id', 'title', 'description', 'quantity', 'price'],
    include: {
      model: ProductImgs,
      attributes: ['imgUrl'],
    },
  });

  const productsWithImgs = products.map(async (product) => {
    const productImgsPromises = product.productImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);

      postImg.imgUrl = imgUrl;
      return postImg;
    });

    const productImgs = await Promise.all(productImgsPromises);

    product.productImgs = productImgs;
    return product;
  });

  const productImgs = await Promise.all(productsWithImgs);

  res.status(200).json({
    status: 'Success',
    data: { products: productImgs },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'Success',
    data: { product },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { category, sessionUser } = req;
  const { title, description, quantity, price } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId: category.id,
    userId: sessionUser.id,
  });

  const [name, ext] = req.file.originalname.split('.');

  const filename = `products/${newProduct.id}/${name}-${Date.now()}.${ext}`;
  const imgRef = ref(storage, filename);

  //* Upload img firebase
  const resolve = await uploadBytes(imgRef, req.file.buffer);

  await ProductImgs.create({
    imgUrl: resolve.metadata.fullPath,
    productId: newProduct.id,
  });

  res.status(201).json({
    status: 'Success',
    data: { newProduct },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  product.update({
    title,
    description,
    quantity,
    price,
  });

  res.status(204).json({
    messague: 'Your Product is Updated!!!',
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  product.update({
    status: 'inative',
  });

  res.status(204).json({
    messague: 'Your Product is Deleted!!!',
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
