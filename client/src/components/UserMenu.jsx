import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiLogout, HiLogin, HiUserAdd } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

/**
 * UserMenu Component
 * Dropdown menu showing user status and auth options
 */
const UserMenu = ({ onAuthClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isGuest, logout, authAnimationTrigger } = useAuth();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animation when user logs in/signs up/guest
  useEffect(() => {
    if (authAnimationTrigger > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [authAnimationTrigger]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const handleAuthClick = (tab) => {
    setIsOpen(false);
    onAuthClick(tab);
  };

  return (
    <div className="relative">
      {/* User Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-2xl border border-white/40
          hover:bg-white/40 transition-all"
        animate={shouldAnimate ? {
          scale: [1, 1.15, 0.95, 1.05, 1],
        } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center"
          animate={shouldAnimate ? {
            rotate: [0, -15, 15, -10, 10, 0],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <HiUser className="text-white" />
        </motion.div>
        <span className="hidden sm:block font-medium text-gray-700">
          {isAuthenticated
            ? isGuest
              ? 'Guest'
              : user?.name || 'User'
            : 'Account'}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 glass-card shadow-glass-lg py-2 z-50"
          >
            {isAuthenticated ? (
              <>
                {/* Authenticated User */}
                <div className="px-4 py-3 border-b border-white/20">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {isGuest ? 'Guest User' : user?.email}
                  </p>
                  {isGuest && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cart expires in 7 days
                    </p>
                  )}
                </div>

                {isGuest && (
                  <>
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <HiLogin className="text-primary-600" />
                      <span>Login to Account</span>
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <HiUserAdd className="text-primary-600" />
                      <span>Create Account</span>
                    </button>
                    <div className="border-t border-white/20 my-1"></div>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2 text-red-600"
                >
                  <HiLogout />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Not Authenticated */}
                <button
                  onClick={() => handleAuthClick('guest')}
                  className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <HiUser className="text-gray-600" />
                  <span>Continue as Guest</span>
                </button>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <HiLogin className="text-primary-600" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="w-full px-4 py-2 text-left hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <HiUserAdd className="text-primary-600" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;

