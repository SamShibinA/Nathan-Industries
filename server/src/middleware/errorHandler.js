import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose Bad ObjectId Cast Error
  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate value entered for ${field}. Please use another value.`;
    error.statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join('. ');
    error.statusCode = 400;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Authentication token expired. Please log in again.';
    error.statusCode = 401;
  }

  // Response payload
  res.status(error.statusCode).json({
    success: false,
    status: error.status || 'error',
    message: error.message,
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};
