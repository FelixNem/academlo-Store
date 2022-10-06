//* Models
const { ProductsInCart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');

//* utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const getAllCart = catchAsync(async (req, res, next) => {
  const { cart } = req;

  const productsinCart = await ProductsInCart.findAll({
    where: { cartId: cart.id },
  });

  res.status(200).json({
    status: 'Success',
    data: { productsinCart },
  });
});

const addProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;
  const { quantity } = req.body;

  const productAdded = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId: product.id },
  });

  if (!productAdded) {
    const newProductAdded = await ProductsInCart.create({
      cartId: cart.id,
      productId: product.id,
      quantity,
    });

    return res.status(200).json({
      status: 'success',
      data: { newProductAdded },
    });
  }

  if (productAdded.status === 'active') {
    return next(new AppError('Product is Already in Cart', 403));
  }

  await productAdded.update({
    status: 'active',
    quantity,
  });

  res.status(200).json({
    status: 'success',
    data: { productAdded },
  });
});

const updateCart = catchAsync(async (req, res, next) => {
  const { productAdded } = req;
  const { quantity } = req.body;

  if (quantity === 0) {
    await productAdded.update({
      status: 'removed',
      quantity: quantity,
    });

    return res.status(204).json({
      status: 'Success',
      mensague: 'Product In cart updated',
    });
  }

  await productAdded.update({
    status: 'active',
    quantity: quantity,
  });

  res.status(204).json({
    status: 'Success',
    mensague: 'Product In cart Updated!!!',
  });
});

const deleteProductinCart = catchAsync(async (req, res, next) => {
  const { productAdded } = req;

  await productAdded.update({
    status: 'removed',
    quantity: 0,
  });

  res.status(204).json({
    status: 'Success',
    mensague: 'Product In cart Deleted!!!',
  });
});

const purchaseCart = catchAsync(async (req, res, next) => {
  const { cart, sessionUser } = req;

  const productsinCart = await ProductsInCart.findAll({
    where: { cartId: cart.id, status: 'active' },
  });

  let totalPrice = 0;

  await Promise.all(
    productsinCart.map(async (productCart) => {
      const product = await Product.findOne({
        where: { id: productCart.productId },
      });
      const newQty = product.quantity - productCart.quantity;

      await product.update({
        quantity: newQty,
      });

      totalPrice += productCart.quantity * product.price;

      productCart.update({
        status: 'purchased',
      });
    })
  );

  await cart.update({
    status: 'purchased',
  });

  const newOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      newOrder,
    },
  });
});

module.exports = {
  getAllCart,
  addProductInCart,
  updateCart,
  deleteProductinCart,
  purchaseCart,
};
