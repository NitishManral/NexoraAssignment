const mongoose = require('mongoose');

/**
 * CartItem Schema
 * Stores cart items with product reference and quantity
 * Supports both guest and registered user carts via userId field
 */
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CartItem', cartItemSchema);

