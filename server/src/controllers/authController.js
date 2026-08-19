import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

// Format user object for clean client responses
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    companyName: user.companyName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    state: user.state,
    gst: user.gst,
    interestedProduct: user.interestedProduct,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

/**
 * @desc    Register a new customer/quarry client account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    companyName,
    email,
    phone,
    city,
    state,
    gst,
    gstNumber,
    interestedProduct,
    password,
  } = req.body;

  // Validation
  if (!name || !companyName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full name, company name, email, phone, and password.',
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An enterprise account with this email address already exists.',
    });
  }

  // Create new user
  const user = await User.create({
    name,
    companyName,
    email: email.toLowerCase(),
    phone,
    city: city || '',
    state: state || '',
    gst: (gst || gstNumber || '').toUpperCase(),
    interestedProduct: interestedProduct || 'stone-crushers',
    password,
    role: 'customer',
  });

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Corporate account registered successfully.',
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

/**
 * @desc    Authenticate user & return JWT token + profile
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email address and password.',
    });
  }

  // Find user and include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your email and password.',
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact NathanIndustries administrative desk.',
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your email and password.',
    });
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User record not found.',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(user),
    },
  });
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile or PUT /api/auth/me
 * @access  Private
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, companyName, phone, city, state, gst, interestedProduct } = req.body;

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (companyName) fieldsToUpdate.companyName = companyName;
  if (phone) fieldsToUpdate.phone = phone;
  if (city !== undefined) fieldsToUpdate.city = city;
  if (state !== undefined) fieldsToUpdate.state = state;
  if (gst !== undefined) fieldsToUpdate.gst = gst.toUpperCase();
  if (interestedProduct) fieldsToUpdate.interestedProduct = interestedProduct;

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile details updated successfully.',
    data: {
      user: formatUserResponse(user),
    },
  });
});

export const updateProfile = updateMe;

/**
 * @desc    Forgot Password - Generate reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid registered email address.',
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been dispatched.',
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully.',
    data: {
      resetUrl,
      resetToken,
    },
  });
});

/**
 * @desc    Reset Password using token
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a new password of at least 6 characters.',
    });
  }

  const crypto = await import('crypto');
  const hashedToken = crypto.default
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Password reset link is invalid or has expired.',
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You are now authenticated.',
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

/**
 * @desc    Change password (authenticated user)
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both current password and new password.',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long.',
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect current password. Please try again.',
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
  });
});

/**
 * Auto-Seed Administrator Accounts on startup
 */
export const seedAdminUser = async () => {
  try {
    const defaultAdmins = [
      {
        name: 'Sam Shibin',
        companyName: 'NathanIndustries Executive',
        email: 'samshibin1125@gmail.com',
        phone: '+91 98765 43210',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        gst: '33AAACN1234F1Z5',
        interestedProduct: 'stone-crushers',
        password: 'admin@123',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Nathan Executive Administrator',
        companyName: 'NathanIndustries Ltd.',
        email: 'admin@nathanindustries.com',
        phone: '+91 98765 43210',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        gst: '33AAACN1234F1Z5',
        interestedProduct: 'stone-crushers',
        password: 'Admin@Nathan2026!',
        role: 'admin',
        isActive: true,
      },
    ];

    for (const adm of defaultAdmins) {
      const existing = await User.findOne({ email: adm.email });
      if (!existing) {
        await User.create(adm);
        console.log(`🔑 [Seed] Created admin account: ${adm.email}`);
      } else if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`🔑 [Seed] Updated role to admin for: ${adm.email}`);
      }
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed admin users:', error.message);
  }
};
