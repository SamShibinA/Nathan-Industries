import { Inquiry } from '../models/Inquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * @desc    Create a new contact inquiry (authenticated users)
 * @route   POST /api/inquiries
 * @access  Private
 */
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, company, interest, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, phone, and message.',
    });
  }

  const inquiry = await Inquiry.create({
    user: req.user._id,
    name,
    email,
    phone,
    company: company || '',
    interest: interest || 'general',
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been submitted successfully. Our engineering team will respond shortly.',
    data: { inquiry },
  });
});

/**
 * @desc    Get logged-in user's own inquiries
 * @route   GET /api/inquiries/my
 * @access  Private
 */
export const getMyInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { inquiries },
  });
});

/**
 * @desc    Get all inquiries (admin only, with search & filter)
 * @route   GET /api/inquiries
 * @access  Private/Admin
 */
export const getInquiries = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { company: searchRegex },
      { inquiryNumber: searchRegex },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Inquiry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      inquiries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Update inquiry status and admin notes
 * @route   PUT /api/inquiries/:id
 * @access  Private/Admin
 */
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found.',
    });
  }

  if (status) inquiry.status = status;
  if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;

  await inquiry.save();

  res.status(200).json({
    success: true,
    message: `Inquiry ${inquiry.inquiryNumber} updated successfully.`,
    data: { inquiry },
  });
});

/**
 * @desc    Delete an inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private/Admin
 */
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found.',
    });
  }

  await inquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: `Inquiry ${inquiry.inquiryNumber} deleted successfully.`,
  });
});
