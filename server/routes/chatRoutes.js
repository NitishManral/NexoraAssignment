const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { sendMessage } = require('../controllers/chatController');

/**
 * Validation middleware for chat messages
 */
const validateMessage = [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
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

// @route   POST /api/chat
router.post('/', validateMessage, handleValidationErrors, sendMessage);

module.exports = router;

