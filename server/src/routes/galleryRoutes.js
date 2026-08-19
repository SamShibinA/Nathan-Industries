import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  uploadGalleryImage,
  processGalleryImages,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public Gallery Feed
router.get('/', getGalleryItems);

// Protected Admin Management Endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadGalleryImage,
  processGalleryImages,
  createGalleryItem
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadGalleryImage,
  processGalleryImages,
  updateGalleryItem
);

router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

export default router;
