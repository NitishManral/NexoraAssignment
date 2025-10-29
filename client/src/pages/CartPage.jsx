import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiShoppingCart } from 'react-icons/hi';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import ReceiptModal from '../components/ReceiptModal';

/**
 * CartPage Component
 * Shopping cart with checkout and glassmorphism design
 */
const CartPage = () => {
  const [receipt, setReceipt] = useState(null);

  const handleCheckoutSuccess = (receiptData) => {
    setReceipt(receiptData);
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <HiShoppingCart className="text-2xl text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Shopping Cart</h1>
        </div>
        <p className="text-gray-600 ml-15">Review your items and checkout</p>
      </motion.div>
      
      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Cart />
        </motion.div>

        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <CheckoutForm onCheckoutSuccess={handleCheckoutSuccess} />
        </motion.div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />
      )}
    </div>
  );
};

export default CartPage;
