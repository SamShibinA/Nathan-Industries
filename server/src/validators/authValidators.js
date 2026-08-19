import { body } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Full Name must be between 2 and 60 characters'),

  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company / Quarry Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please enter a valid phone number'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('interestedProduct')
    .optional()
    .isIn([
      'stone-crushers',
      'jaw-crushers',
      'cone-crushers',
      'sand-plants',
      'conveyors',
      'spare-parts',
      'rob-infrastructure',
      'general',
    ])
    .withMessage('Invalid interested product selection'),

  body('city').optional().trim(),
  body('state').optional().trim(),
  body('gst').optional().trim().toUpperCase(),

  validateRequest,
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),

  validateRequest,
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  validateRequest,
];

export const validateResetPassword = [
  body('password')
    .notEmpty()
    .withMessage('New Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  validateRequest,
];
