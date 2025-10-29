import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authApi from '../api/authApi';

const AuthContext = createContext();

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Auth Context Provider
 * Manages authentication state and user sessions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authAnimationTrigger, setAuthAnimationTrigger] = useState(0);

  /**
   * Check if user is already authenticated on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authApi.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
      setIsGuest(response.data.isGuest);
    } catch (err) {
      // User not authenticated - that's okay
      setUser(null);
      setIsAuthenticated(false);
      setIsGuest(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(email, password);
      setUser(response.data);
      setIsAuthenticated(true);
      setIsGuest(false);
      // Trigger user menu animation instead of toast
      setAuthAnimationTrigger(prev => prev + 1);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup new user
   */
  const signup = async (email, password, name = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.signup(email, password, name);
      setUser(response.data);
      setIsAuthenticated(true);
      setIsGuest(false);
      // Trigger user menu animation instead of toast
      setAuthAnimationTrigger(prev => prev + 1);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Continue as guest
   */
  const continueAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.continueAsGuest();
      setUser(response.data);
      setIsAuthenticated(true);
      setIsGuest(true);
      // Trigger user menu animation instead of toast
      setAuthAnimationTrigger(prev => prev + 1);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Guest session failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      setIsGuest(false);
      
      // Clear all localStorage on logout
      localStorage.clear();
      
      // No toast for logout, silent action
    } catch (err) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isGuest,
    loading,
    error,
    authAnimationTrigger,
    login,
    signup,
    continueAsGuest,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

