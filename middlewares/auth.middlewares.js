const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

//* Models
const { User } = require('../models/user.model');

//* Utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

dotEnv.config({ path: './config.env' });

const protectSesion = catchAsync(async (req, res, next) => {
  //get token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //extract Token
    token = req.headers.authorization.split(' ')[1];
  }

  // check if the token was send or not
  if (!token) {
    return next('The token was invalid', 403);
  }

  const decoded = jwt.verify(token, process.env.ultraSecretKey);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of the session is no longer active', 403)
    );
  }

  req.sessionUser = user;

  // grant Access
  next();
});

const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You are not the owner of this account.', 403));
  }

  next();
};

const protectUserProducts = (req, res, next) => {
  const { sessionUser, product } = req;

  if (product.userId !== sessionUser.id) {
    return next(new AppError('You are not the owner of this product', 403));
  }

  next();
};

module.exports = {
  protectSesion,
  protectUserAccount,
  protectUserProducts,
};
