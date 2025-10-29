import { motion } from 'framer-motion';
import { HiPlus, HiMinus, HiTrash, HiShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

/**
 * Cart Component
 * Compact glassmorphism design with horizontal item cards
 */
const Cart = () => {
  const { cartItems, cartTotal, loading, removeFromCart, updateQuantity } = useCart();

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gradient-primary/10 flex items-center justify-center">
            <HiShoppingBag className="w-12 h-12 text-primary-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some amazing products to get started!</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleQuantityChange = async (item, change) => {
    const newQty = item.qty + change;
    await updateQuantity(item._id, item.productId._id, newQty);
  };

  return (
    <div className="space-y-4">
      {/* Cart Items */}
      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="glass-card-hover p-4"
          >
            <div className="flex items-center gap-4">
              {/* Product Image */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/50">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=Product';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 break-words">
                  {item.productId.name}
                </h3>
                <p className="text-lg font-bold gradient-text break-words">
                  ₹{item.productId.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 break-words">
                  Subtotal: ₹{(item.productId.price * item.qty).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 glass-card px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/40 active:scale-90 transition-all disabled:opacity-50"
                  >
                    <HiMinus className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  <span className="w-8 text-center font-bold text-gray-900">
                    {item.qty}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/40 active:scale-90 transition-all disabled:opacity-50"
                  >
                    <HiPlus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  disabled={loading}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 
                    hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                  title="Remove from cart"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card bg-gradient-to-br from-primary-50/80 to-purple-50/80 p-6 border-2 border-primary-200/50 sticky bottom-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Subtotal ({cartItems.length} items)</span>
          <span className="text-gray-900 font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 text-sm">Shipping</span>
          <span className="text-green-600 font-semibold text-sm">Free</span>
        </div>
        <div className="border-t border-primary-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold gradient-text">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
