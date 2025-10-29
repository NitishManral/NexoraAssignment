import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiX, HiShoppingBag } from 'react-icons/hi';

/**
 * ReceiptModal Component
 * Glassmorphism receipt modal with confetti effect
 */
const ReceiptModal = ({ receipt, onClose }) => {
  const navigate = useNavigate();

  if (!receipt) return null;

  const handleReturnHome = () => {
    onClose();
    navigate('/');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-glass-lg"
      >
        <div className="p-8">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center mb-6"
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-4 shadow-glow">
              <HiCheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-600">
              Thank you for your purchase, <span className="font-semibold">{receipt.name}</span>
            </p>
          </motion.div>

          {/* Receipt Details */}
          <div className="glass-card p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Receipt ID</p>
                <p className="font-mono text-sm font-semibold bg-white/50 px-3 py-1 rounded-lg inline-block">
                  {receipt.receiptId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="text-sm font-semibold">{formatDate(receipt.timestamp)}</p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="text-sm text-gray-500 mb-1">Email Confirmation</p>
              <p className="text-sm font-semibold flex items-center gap-2">
                <HiShoppingBag className="text-primary-500" />
                {receipt.email}
              </p>
            </div>
          </div>

          {/* Items List */}
          {receipt.items && receipt.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HiShoppingBag className="text-primary-500" />
                Order Items
              </h3>
              <div className="space-y-2">
                {receipt.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="glass-card p-4 flex justify-between items-center"
                  >
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-gray-900 text-sm break-words">{item.product}</p>
                      <p className="text-xs text-gray-500 break-words">
                        ₹{item.price.toLocaleString('en-IN')} × {item.qty}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 break-words">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card bg-gradient-to-br from-primary-50/80 to-purple-50/80 p-6 mb-6 border-2 border-primary-200/50"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Paid</span>
              <span className="text-4xl font-bold gradient-text">
                ₹{receipt.total.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Confirmation Message */}
          <div className="glass-card bg-blue-50/50 border border-blue-200/50 p-4 mb-6">
            <p className="text-sm text-blue-800 text-center">
              📧 A confirmation email has been sent to <strong>{receipt.email}</strong>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReturnHome}
              className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
            >
              <HiShoppingBag />
              <span>Continue Shopping</span>
            </button>
            <button
              onClick={onClose}
              className="btn-glass px-6 flex items-center justify-center"
            >
              <HiX className="text-xl" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceiptModal;
