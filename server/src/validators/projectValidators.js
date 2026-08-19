import { body } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Project title must be between 3 and 150 characters'),

  body('projectType')
    .trim()
    .notEmpty()
    .withMessage('Project type is required')
    .isIn([
      'railway-overbridge',
      'crusher-plant',
      'm-sand',
      'p-sand',
      'industrial-construction',
      'infrastructure',
    ])
    .withMessage('Invalid project type'),

  body('clientName')
    .trim()
    .notEmpty()
    .withMessage('Client / Authority name is required'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Project location is required'),

  body('projectCapacity')
    .trim()
    .notEmpty()
    .withMessage('Project capacity / output scale is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  validateRequest,
];
