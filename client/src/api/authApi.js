import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_URL = `${API_BASE_URL}/api/auth`;

// Configure axios to send cookies
axios.defaults.withCredentials = true;

/**
 * Register new user
 * @param {string} email
 * @param {string} password
 * @param {string} name (optional)
 * @returns {Promise} User data
 */
export const signup = async (email, password, name = '') => {
  const response = await axios.post(`${API_URL}/signup`, { email, password, name });
  return response.data;
};

/**
 * Login existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise} User data
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

/**
 * Continue as guest
 * @returns {Promise} Guest user data
 */
export const continueAsGuest = async () => {
  const response = await axios.post(`${API_URL}/guest`);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise} Success message
 */
export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

/**
 * Get current user
 * @returns {Promise} User data
 */
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

