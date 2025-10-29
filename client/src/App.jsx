import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShoppingBag, HiShoppingCart, HiSparkles } from 'react-icons/hi';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ChatBot from './components/ChatBot';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';

/**
 * Navigation Component
 * Glassmorphism header with blur effect and cart badge
 */
const Navigation = ({ onAuthClick }) => {
  const { cartCount, cartAnimationTrigger } = useCart();
  const location = useLocation();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animation when cart is updated
  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartAnimationTrigger]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow"
            >
              <HiShoppingBag className="text-white text-xl md:text-2xl" />
            </motion.div>
            <div>
              <span className="text-2xl md:text-3xl font-bold gradient-text">
                ShopCart
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <HiSparkles className="text-yellow-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isActive('/')
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-gray-700 hover:bg-white/60'
              }`}
            >
              <HiShoppingBag className="text-lg" />
              <span>Products</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all relative ${
                isActive('/cart')
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-gray-700 hover:bg-white/60'
              }`}
            >
              <motion.div
                animate={shouldAnimate ? {
                  scale: [1, 1.3, 0.9, 1.1, 1],
                  rotate: [0, -10, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <HiShoppingCart className="text-lg md:text-xl" />
              </motion.div>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={shouldAnimate ? {
                    scale: [0, 1.4, 1],
                  } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="badge"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            <UserMenu onAuthClick={onAuthClick} />
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Main App Component
 * Wraps everything with providers and glassmorphism design
 */
function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('guest');

  const handleAuthClick = (tab = 'guest') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ChatProvider>
            <div className="min-h-screen">
              <Navigation onAuthClick={handleAuthClick} />
              
              {/* Main Content */}
              <main className="pt-4">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Routes>
              </main>

              {/* AI ChatBot */}
              <ChatBot />

              {/* Auth Modal */}
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                defaultTab={authModalTab}
              />

            {/* Footer */}
            <footer className="mt-12 py-8 glass-card mx-4 mb-4 rounded-2xl">
              <div className="container-custom">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <HiShoppingBag className="text-primary-500 text-2xl" />
                    <span className="font-bold gradient-text text-xl">ShopCart</span>
                  </div>
                  <p className="text-gray-600 text-sm text-center">
                    © 2024 ShopCart E-Commerce. Premium shopping experience.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <HiSparkles className="text-yellow-500" />
                    <span>Powered by AI</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
