import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a signed JWT token for a user
 * @param {string} id - User Mongoose ObjectID
 * @param {string} role - User role (guest, customer, admin)
 * @returns {string} Signed JWT token string
 */
export const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
