const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set it as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User ID
 * @param {boolean} isGuest - Whether user is a guest
 */
const generateToken = (res, userId, isGuest = false) => {
  const token = jwt.sign(
    { userId, isGuest },
    process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);

  return token;
};

module.exports = generateToken;

