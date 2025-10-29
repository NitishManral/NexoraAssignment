import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_URL = `${API_BASE_URL}/api/products`;

/**
 * Fetch all products from the backend
 * @returns {Promise} Array of products
 */
export const fetchProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};