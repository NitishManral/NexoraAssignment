const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

/**
 * @desc    Add item to cart or update quantity
 * @route   POST /api/cart
 * @access  Private (requires auth or guest session)
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.userId; // From auth middleware

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if item already in cart
    const existingCartItem = await CartItem.findOne({ productId, userId });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.qty += qty;
      await existingCartItem.save();
      
      const populatedItem = await CartItem.findById(existingCartItem._id).populate('productId');
      
      res.json({
        success: true,
        message: 'Cart updated successfully',
        data: populatedItem,
      });
    } else {
      // Create new cart item
      const cartItem = await CartItem.create({
        productId,
        qty,
        userId,
      });
      
      const populatedItem = await CartItem.findById(cartItem._id).populate('productId');
      
      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: populatedItem,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get cart items with total
 * @route   GET /api/cart
 * @access  Private (requires auth or guest session)
 */
const getCart = async (req, res, next) => {
  try {
    const userId = req.userId; // From auth middleware

    const cartItems = await CartItem.find({ userId }).populate('productId');

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.qty);
    }, 0);

    res.json({
      success: true,
      count: cartItems.length,
      data: cartItems,
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private (requires auth or guest session)
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    const cartItem = await CartItem.findOne({ _id: id, userId });

    if (!cartItem) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    await CartItem.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process checkout
 * @route   POST /api/checkout
 * @access  Private (requires auth or guest session)
 */
const checkout = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.userId; // From auth middleware

    // Get cart items
    const cartItems = await CartItem.find({ userId }).populate('productId');

    if (cartItems.length === 0) {
      res.status(400);
      throw new Error('Cart is empty');
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.qty);
    }, 0);

    // Generate receipt
    const receipt = {
      receiptId: `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
      name,
      email,
      items: cartItems.map(item => ({
        product: item.productId.name,
        qty: item.qty,
        price: item.productId.price,
        subtotal: parseFloat((item.productId.price * item.qty).toFixed(2)),
      })),
    };

    // Clear cart after successful checkout
    await CartItem.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Checkout successful',
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Merge local cart with backend cart
 * @route   POST /api/cart/merge
 * @access  Private (requires auth or guest session)
 */
const mergeLocalCart = async (req, res, next) => {
  try {
    const { localCart } = req.body; // Array of {productId, qty}
    const userId = req.userId;

    if (!localCart || !Array.isArray(localCart) || localCart.length === 0) {
      return res.json({
        success: true,
        message: 'No local cart to merge',
      });
    }

    let mergedCount = 0;

    // Merge each local cart item with backend
    for (const item of localCart) {
      const { productId, qty } = item;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) continue;

      // Check if item already in backend cart
      const existingCartItem = await CartItem.findOne({ productId, userId });

      if (existingCartItem) {
        // Add quantities together
        existingCartItem.qty += qty;
        await existingCartItem.save();
      } else {
        // Create new cart item
        await CartItem.create({
          productId,
          qty,
          userId,
        });
      }
      mergedCount++;
    }

    // Return updated cart
    const cartItems = await CartItem.find({ userId }).populate('productId');
    const total = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.qty,
      0
    );
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);

    res.json({
      success: true,
      message: `Merged ${mergedCount} items from local cart`,
      data: cartItems,
      total,
      count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  checkout,
  mergeLocalCart,
};

