import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_URL = `${API_BASE_URL}/api/cart`;

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

/**
 * Add item to cart
 */
export const addToCart = async (productId, qty = 1) => {
  const response = await axios.post(API_URL, { productId, qty });
  return response.data;
};

/**
 * Get all cart items
 */
export const getCart = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId) => {
  const response = await axios.delete(`${API_URL}/${itemId}`);
  return response.data;
};

/**
 * Merge local cart with backend cart
 */
export const mergeLocalCart = async (localCart) => {
  const response = await axios.post(`${API_URL}/merge`, { localCart });
  return response.data;
};

/**
 * Process checkout
 */
export const checkout = async (checkoutData) => {
  const response = await axios.post(`${API_URL}/checkout`, checkoutData);
  return response.data;
};