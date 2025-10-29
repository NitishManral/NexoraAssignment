import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiShoppingCart } from 'react-icons/hi';
import { checkout } from '../api/cartApi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

/**
 * CheckoutForm Component
 * Glassmorphism checkout form with validation
 */
const CheckoutForm = ({ onCheckoutSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const { cartItems, clearCart } = useCart();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const response = await checkout(formData);
      
      // Clear form
      setFormData({ name: '', email: '' });
      
      // Clear cart in context
      clearCart();
      
      // Show receipt modal
      onCheckoutSuccess(response.data);
      
      toast.success('🎉 Order placed successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Checkout failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 sticky top-24"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">Checkout</h2>
        <p className="text-gray-600 text-sm">Complete your order details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <HiUser className="text-xl" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              className="input-glass pl-11"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <HiMail className="text-xl" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-glass pl-11"
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <HiShoppingCart className="text-xl" />
              <span>Place Order</span>
            </>
          )}
        </button>

        {cartItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Add items to your cart to checkout
          </p>
        )}

        {/* Security Note */}
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-gray-600">
            🔒 Secure checkout • Your information is protected
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
