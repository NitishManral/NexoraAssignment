import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { sendChatMessage } from '../api/chatApi';

const ChatContext = createContext();

/**
 * Custom hook to use Chat Context
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

/**
 * Chat Context Provider
 * Manages chat conversation state and AI interactions
 */
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! Welcome to ShopCart. How can I help you today?',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      products: null,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Send message to AI
   */
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      products: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendChatMessage(text);
      
      // Add AI response with optional product suggestions
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.message,
        sender: 'ai',
        timestamp: response.data.timestamp,
        products: response.data.products || null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: error.response?.data?.message || 'Sorry, I\'m having trouble responding right now. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        products: null,
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle chat window
   */
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Close chat window
   */
  const closeChat = () => {
    setIsOpen(false);
  };

  /**
   * Clear conversation
   */
  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! Welcome to ShopCart. How can I help you today?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        products: null,
      },
    ]);
  };

  const value = {
    messages,
    loading,
    isOpen,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

