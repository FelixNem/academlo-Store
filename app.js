const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Routers
const { userRoutes } = require('./routes/user.routes');
const { productsRoutes } = require('./routes/product.routes');
const { cartRoutes } = require('./routes/cart.routes');

// Controller
const { globalErrorHandler } = require('./controllers/error.controllers');

//* Init express app
const app = express();
app.use(express.json());

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

//* Endpoints
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);

//! Global error handler
app.use(globalErrorHandler);

//! catch non-exitsing endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    messague: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
