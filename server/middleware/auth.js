const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 * For routes that require authentication
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_change_in_production'
    );

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check if guest cart expired
    if (user.isGuest && user.isCartExpired()) {
      res.status(401);
      throw new Error('Guest session expired');
    }

    req.user = user;
    req.userId = user._id.toString();
    req.isGuest = user.isGuest;

    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

/**
 * Optional auth - Allow both guest and authenticated users
 * Populates req.user if token exists, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_change_in_production'
      );

      const user = await User.findById(decoded.userId).select('-password');

      if (user && (!user.isGuest || !user.isCartExpired())) {
        req.user = user;
        req.userId = user._id.toString();
        req.isGuest = user.isGuest;
      }
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};

module.exports = { protect, optionalAuth };

