import express from 'express';
import {
  createQuote,
  getMyQuotes,
  getQuotes,
  updateQuoteStatus,
  deleteQuote,
} from '../controllers/quoteController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated users can create & view their own quotes
router.post('/', protect, createQuote);
router.get('/my', protect, getMyQuotes);

// Admin-only: list, update, delete
router.get('/', protect, authorize('admin'), getQuotes);
router.put('/:id', protect, authorize('admin'), updateQuoteStatus);
router.delete('/:id', protect, authorize('admin'), deleteQuote);

export default router;
