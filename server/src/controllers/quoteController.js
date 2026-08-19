import { Quote } from '../models/Quote.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * @desc    Create a new quote request (authenticated users)
 * @route   POST /api/quotes
 * @access  Private
 */
export const createQuote = asyncHandler(async (req, res) => {
  const { product, quantity, requirement, location, budget, timeline } = req.body;

  if (!product || !quantity || !requirement || !location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide product, quantity, requirement, and location.',
    });
  }

  const quote = await Quote.create({
    user: req.user._id,
    product,
    quantity,
    requirement,
    location,
    budget: budget || '',
    timeline: timeline || '',
  });

  res.status(201).json({
    success: true,
    message: `Quote request ${quote.quoteNumber} submitted successfully. Our sales team will review and respond.`,
    data: { quote },
  });
});

/**
 * @desc    Get logged-in user's own quote requests
 * @route   GET /api/quotes/my
 * @access  Private
 */
export const getMyQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { quotes },
  });
});

/**
 * @desc    Get all quotes (admin only, with search & filter)
 * @route   GET /api/quotes
 * @access  Private/Admin
 */
export const getQuotes = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { product: searchRegex },
      { quoteNumber: searchRegex },
      { location: searchRegex },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [quotes, total] = await Promise.all([
    Quote.find(filter)
      .populate('user', 'name email phone companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Quote.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      quotes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Update quote status and admin notes
 * @route   PUT /api/quotes/:id
 * @access  Private/Admin
 */
export const updateQuoteStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    return res.status(404).json({
      success: false,
      message: 'Quote not found.',
    });
  }

  if (status) quote.status = status;
  if (adminNotes !== undefined) quote.adminNotes = adminNotes;

  await quote.save();

  res.status(200).json({
    success: true,
    message: `Quote ${quote.quoteNumber} updated successfully.`,
    data: { quote },
  });
});

/**
 * @desc    Delete a quote
 * @route   DELETE /api/quotes/:id
 * @access  Private/Admin
 */
export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    return res.status(404).json({
      success: false,
      message: 'Quote not found.',
    });
  }

  await quote.deleteOne();

  res.status(200).json({
    success: true,
    message: `Quote ${quote.quoteNumber} deleted successfully.`,
  });
});
