import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

/**
 * Protect routes - Verifies JWT Bearer Token and attaches user to req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in to access this resource.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Get user from database
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return next(new AppError('The user belonging to this authentication token no longer exists.', 401));
    }

    if (!currentUser.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact administrator.', 403));
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired authentication token. Please log in again.', 401));
  }
});

/**
 * Authorize role-based access - Restricts endpoint access to specific roles
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'customer')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized. Please log in.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden. Role '${req.user.role}' is not authorized to perform this action. Required: ${roles.join(', ')}`,
          403
        )
      );
    }

    next();
  };
};
