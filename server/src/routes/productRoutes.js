import express from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { validateProduct } from '../validators/productValidators.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  uploadProductImages,
  processProductImages,
} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public Catalog Endpoints
router.get('/', getProducts);
router.get('/:slugOrId', getProductBySlugOrId);

// Protected Admin Management Endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadProductImages,
  processProductImages,
  validateProduct,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadProductImages,
  processProductImages,
  updateProduct
);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
