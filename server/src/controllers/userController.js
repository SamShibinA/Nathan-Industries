import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * @desc    Get all users (admin only, with search & role filter)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 100 } = req.query;

  const filter = {};

  if (role && role !== 'all') {
    filter.role = role;
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { companyName: searchRegex },
      { phone: searchRegex },
      { city: searchRegex },
      { state: searchRegex },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 100;
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: { users },
  });
});

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found with specified ID', 404));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * @desc    Update user role (customer <-> admin)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['admin', 'customer', 'guest'].includes(role)) {
    return next(new AppError('Invalid role specified. Allowed roles: admin, customer, guest', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found with specified ID', 404));
  }

  // Prevent admin from demoting themselves
  if (req.user._id.toString() === user._id.toString() && role !== 'admin') {
    return next(new AppError('You cannot demote your own administrator account', 400));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Role for ${user.name} successfully updated to ${role}`,
    data: { user },
  });
});

/**
 * @desc    Update user active status (activate / deactivate)
 * @route   PUT /api/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return next(new AppError('Please provide an isActive boolean flag', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found with specified ID', 404));
  }

  // Prevent admin from deactivating themselves
  if (req.user._id.toString() === user._id.toString() && !isActive) {
    return next(new AppError('You cannot deactivate your own administrator account', 400));
  }

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Account for ${user.name} has been ${isActive ? 'activated' : 'deactivated'}`,
    data: { user },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found with specified ID', 404));
  }

  // Prevent admin from deleting themselves
  if (req.user._id.toString() === user._id.toString()) {
    return next(new AppError('You cannot delete your own administrator account', 400));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `User ${user.name} (${user.email}) has been permanently deleted`,
  });
});
