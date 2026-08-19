import express from 'express';
import {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated users can create & view their own inquiries
router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);

// Admin-only: list, update, delete
router.get('/', protect, authorize('admin'), getInquiries);
router.put('/:id', protect, authorize('admin'), updateInquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);

export default router;
