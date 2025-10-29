const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Supports both registered users and guest users
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      sparse: true, // Allows null for guest users
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      trim: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestId: {
      type: String,
      unique: true,
      sparse: true, // Allows null for registered users
    },
    cartExpiresAt: {
      type: Date,
      // Guest carts expire after 7 days
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified and user is not a guest
  if (!this.isModified('password') || this.isGuest) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password method
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Check if cart is expired (for guest users)
 */
userSchema.methods.isCartExpired = function () {
  if (!this.isGuest || !this.cartExpiresAt) return false;
  return new Date() > this.cartExpiresAt;
};

module.exports = mongoose.model('User', userSchema);

