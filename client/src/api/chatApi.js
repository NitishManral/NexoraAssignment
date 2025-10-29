import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_URL = `${API_BASE_URL}/api/chat`;

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

/**
 * Send message to AI chatbot
 * @param {string} message - User message
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message) => {
  const response = await axios.post(API_URL, { message }, {
    withCredentials: true,
  });
  return response.data;
};

