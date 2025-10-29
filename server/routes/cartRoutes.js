const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addToCart,
  getCart,
  removeFromCart,
  checkout,
  mergeLocalCart,
} = require('../controllers/cartController');
const { protect, optionalAuth } = require('../middleware/auth');

/**
 * Validation middleware
 */
const validateAddToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid Product ID'),
  body('qty')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

const validateCheckout = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
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

// @route   POST /api/cart (Protected - requires auth)
router.post('/', protect, validateAddToCart, handleValidationErrors, addToCart);

// @route   GET /api/cart (Protected - requires auth)
router.get('/', protect, getCart);

// @route   DELETE /api/cart/:id (Protected - requires auth)
router.delete('/:id', protect, removeFromCart);

// @route   POST /api/cart/merge (Protected - merge local cart with backend)
router.post('/merge', protect, mergeLocalCart);

// @route   POST /api/checkout (Protected - requires auth)
router.post('/checkout', protect, validateCheckout, handleValidationErrors, checkout);

module.exports = router;

