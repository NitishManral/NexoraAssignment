import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMail, HiLockClosed, HiUser, HiSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

/**
 * AuthModal Component
 * Modal for Login, Signup, and Continue as Guest
 */
const AuthModal = ({ isOpen, onClose, defaultTab = 'guest' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const { login, signup, continueAsGuest, loading } = useAuth();

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
    });
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuestContinue = async () => {
    try {
      await continueAsGuest();
      clearForm();
      onClose();
    } catch (error) {
      // Error handled in context
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      clearForm();
      onClose();
    } catch (error) {
      // Error handled in context
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.email, formData.password, formData.name);
      clearForm();
      onClose();
    } catch (error) {
      // Error handled in context
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-card max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <HiX className="text-gray-600 text-xl" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HiSparkles className="text-primary-500 text-3xl" />
              <h2 className="text-3xl font-bold gradient-text">ShopCart</h2>
            </div>
            <p className="text-gray-600">Choose how you'd like to continue</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('guest')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'guest'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Guest Tab */}
            {activeTab === 'guest' && (
              <motion.div
                key="guest"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                    <HiUser className="text-white text-4xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Continue as Guest</h3>
                  <p className="text-gray-600 text-sm">
                    Shop without creating an account. Your cart will be saved for 7 days.
                  </p>
                  <ul className="text-left text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Quick checkout
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      No registration needed
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Create account anytime
                    </li>
                  </ul>
                  <button
                    onClick={handleGuestContinue}
                    disabled={loading}
                    className="btn-primary w-full py-3 text-lg"
                  >
                    {loading ? 'Please wait...' : 'Continue as Guest'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Login Tab */}
            {activeTab === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <HiMail className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-glass"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <HiLockClosed className="inline mr-1" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="input-glass"
                      placeholder="••••••"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* Signup Tab */}
            {activeTab === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <HiUser className="inline mr-1" />
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-glass"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">You can skip this</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <HiMail className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-glass"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <HiLockClosed className="inline mr-1" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="input-glass"
                      placeholder="At least 6 characters"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;

