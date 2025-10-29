const User = require('../models/User');
const CartItem = require('../models/CartItem');
const generateToken = require('../utils/generateToken');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Check for guest cart
    const guestId = req.cookies.guestId;

    // Create user
    const user = await User.create({
      email,
      password,
      name: name || email.split('@')[0], // Use email prefix if no name provided
      isGuest: false,
    });

    // Merge guest cart if exists
    if (guestId) {
      await mergeGuestCart(guestId, user._id.toString());
    }

    // Generate token
    generateToken(res, user._id, false);

    // Clear guest cookie
    res.clearCookie('guestId');

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isGuest: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.isGuest) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check for guest cart
    const guestId = req.cookies.guestId;

    // Merge guest cart if exists
    if (guestId) {
      await mergeGuestCart(guestId, user._id.toString());
    }

    // Generate token
    generateToken(res, user._id, false);

    // Clear guest cookie
    res.clearCookie('guestId');

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isGuest: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Continue as guest
 * @route   POST /api/auth/guest
 * @access  Public
 */
const continueAsGuest = async (req, res, next) => {
  try {
    // Generate unique guest ID
    const guestId = `guest_${uuidv4()}`;

    // Create guest user
    const guestUser = await User.create({
      isGuest: true,
      guestId,
      cartExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Generate token
    generateToken(res, guestUser._id, true);

    // Also set guestId in cookie for cart merging
    res.cookie('guestId', guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Continuing as guest',
      data: {
        _id: guestUser._id,
        guestId: guestId,
        isGuest: true,
        expiresAt: guestUser.cartExpiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Clear token cookie
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    // Clear guest cookie if exists
    res.clearCookie('guestId');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isGuest: user.isGuest,
        guestId: user.guestId,
        expiresAt: user.cartExpiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to merge guest cart into user cart
 */
const mergeGuestCart = async (guestId, userId) => {
  try {
    // Find guest user
    const guestUser = await User.findOne({ guestId });
    if (!guestUser) return;

    const guestUserId = guestUser._id.toString();

    // Find guest cart items
    const guestCartItems = await CartItem.find({ userId: guestUserId });

    if (guestCartItems.length === 0) return;

    // Merge each item into user cart
    for (const guestItem of guestCartItems) {
      const existingItem = await CartItem.findOne({
        userId,
        productId: guestItem.productId,
      });

      if (existingItem) {
        // Add quantities
        existingItem.qty += guestItem.qty;
        await existingItem.save();
      } else {
        // Create new item for user
        await CartItem.create({
          userId,
          productId: guestItem.productId,
          qty: guestItem.qty,
        });
      }

      // Delete guest cart item
      await CartItem.deleteOne({ _id: guestItem._id });
    }

    console.log(`✅ Merged ${guestCartItems.length} items from guest cart to user cart`);
  } catch (error) {
    console.error('❌ Error merging guest cart:', error.message);
  }
};

module.exports = {
  signup,
  login,
  continueAsGuest,
  logout,
  getCurrentUser,
};

