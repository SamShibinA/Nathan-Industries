import express from 'express';
import {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { validateProject } from '../validators/projectValidators.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  uploadProjectFiles,
  processProjectFiles,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public Catalog Endpoints
router.get('/', getProjects);
router.get('/:slugOrId', getProjectBySlugOrId);

// Protected Admin Management Endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadProjectFiles,
  processProjectFiles,
  validateProject,
  createProject
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadProjectFiles,
  processProjectFiles,
  updateProject
);

router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
