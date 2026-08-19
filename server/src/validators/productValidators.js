import { body } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Product name must be between 3 and 120 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'stone-crushers',
      'jaw-crushers',
      'cone-crushers',
      'sand-plants',
      'conveyors',
      'spare-parts',
    ])
    .withMessage('Invalid machinery category'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('capacity')
    .trim()
    .notEmpty()
    .withMessage('Capacity rating (TPH) is required'),

  body('power')
    .trim()
    .notEmpty()
    .withMessage('Power rating is required'),

  body('feedSize').optional().trim(),
  body('outputSize').optional().trim(),
  body('modelNumber').optional().trim(),

  validateRequest,
];
