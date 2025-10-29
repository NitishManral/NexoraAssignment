const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  signup,
  login,
  continueAsGuest,
  logout,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * Validation middleware
 */
const validateSignup = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
];

const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation error handler
 */
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// @route   POST /api/auth/signup
router.post('/signup', validateSignup, handleValidationErrors, signup);

// @route   POST /api/auth/login
router.post('/login', validateLogin, handleValidationErrors, login);

// @route   POST /api/auth/guest
router.post('/guest', continueAsGuest);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   GET /api/auth/me
router.get('/me', protect, getCurrentUser);

module.exports = router;

