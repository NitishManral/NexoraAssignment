import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChatAlt2, HiPaperAirplane, HiShoppingCart, HiCheck, HiPlus, HiMinus } from 'react-icons/hi';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * ChatBot Component
 * Floating AI assistant with glassmorphism design
 * Requires authentication (guest or logged in)
 */
const ChatBot = () => {
  const { messages, loading, isOpen, sendMessage, toggleChat, closeChat } = useChat();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [inputMessage, setInputMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const messagesEndRef = useRef(null);

  // Helper function to get cart item info
  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId._id === productId);
  };

  const getCartQuantity = (productId) => {
    const item = getCartItem(productId);
    return item ? item.qty : 0;
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    if (inputMessage.trim() && !loading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleToggleChat = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    toggleChat();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddToCart = async (productId, productData = null) => {
    setAddingToCart(productId);
    await addToCart(productId, 1, productData);
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 1500);
  };

  const handleIncrement = async (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      await updateQuantity(cartItem._id, productId, cartItem.qty + 1);
    }
  };

  const handleDecrement = async (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      if (cartItem.qty > 1) {
        await updateQuantity(cartItem._id, productId, cartItem.qty - 1);
      } else {
        // Remove from cart if quantity is 1
        await removeFromCart(cartItem._id);
      }
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] z-50"
          >
            <div className="glass-card h-full flex flex-col shadow-glass-lg">
              {/* Header */}
              <div className="bg-gradient-primary p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center">
                      <HiChatAlt2 className="text-white text-xl" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">ShopCart Assistant</h3>
                    <p className="text-xs text-white/80">Online • Powered by AI</p>
                  </div>
                </div>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <HiX className="text-white text-xl" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col gap-2 max-w-[90%]">
                      {/* Text Message */}
                      <div
                        className={
                          message.sender === 'user'
                            ? 'chat-bubble-user'
                            : 'chat-bubble-ai'
                        }
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </div>

                      {/* Product Suggestions */}
                      {message.products && message.products.length > 0 && (
                        <div className="space-y-2 mt-1">
                          {message.products.map((product) => (
                            <motion.div
                              key={product._id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-white/50 backdrop-blur-2xl rounded-xl p-3 border border-primary-200 shadow-md"
                            >
                              <div className="flex gap-3">
                                {/* Product Image */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/64x64/e5e7eb/667eea?text=Product';
                                    }}
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight break-words">
                                    {product.name}
                                  </h4>
                                  <p className="text-primary-600 font-bold text-lg mt-1 break-words">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </p>
                                </div>

                                {/* Add to Cart Button / Quantity Controls */}
                                <div className="flex-shrink-0">
                                  {(() => {
                                    const cartQty = getCartQuantity(product._id);
                                    const isAdding = addingToCart === product._id;
                                    
                                    if (isAdding) {
                                      return (
                                        <button
                                          disabled
                                          className="rounded-lg shadow-md bg-gradient-primary text-white px-3 py-2 opacity-50"
                                        >
                                          <HiCheck className="text-base" />
                                        </button>
                                      );
                                    }
                                    
                                    if (cartQty > 0) {
                                      // Show quantity controls inside green button (compact for chat)
                                      return (
                                        <div className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white 
                                          rounded-lg shadow-md px-2 py-1.5 transition-all">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDecrement(product._id);
                                            }}
                                            className="p-0.5 hover:bg-white/20 rounded transition-all active:scale-90"
                                          >
                                            <HiMinus className="text-sm" />
                                          </button>
                                          
                                          <span className="px-2 font-bold text-sm min-w-[1.5rem] text-center">
                                            {cartQty}
                                          </span>
                                          
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleIncrement(product._id);
                                            }}
                                            className="p-0.5 hover:bg-white/20 rounded transition-all active:scale-90"
                                          >
                                            <HiPlus className="text-sm" />
                                          </button>
                                        </div>
                                      );
                                    }
                                    
                                    // Show add to cart button
                                    return (
                                      <button
                                        onClick={() => handleAddToCart(product._id, product)}
                                        className="rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95
                                          transition-all duration-200 bg-gradient-primary text-white px-3 py-2"
                                        title="Add to cart"
                                      >
                                        <HiShoppingCart className="text-base" />
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-xs text-gray-500 px-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="chat-bubble-ai">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/25 backdrop-blur-2xl border border-white/40
                      focus:bg-white/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-200
                      placeholder:text-gray-400 outline-none text-sm"
                    maxLength={500}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="p-3 rounded-xl bg-gradient-primary text-white shadow-glow
                      hover:shadow-glow-lg hover:scale-105 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-all duration-200"
                  >
                    <HiPaperAirplane className="text-xl" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI can make mistakes. Verify important info.
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={handleToggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-primary 
          text-white shadow-glow-lg hover:shadow-glow flex items-center justify-center
          transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiX className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <HiChatAlt2 className="text-2xl" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default ChatBot;

