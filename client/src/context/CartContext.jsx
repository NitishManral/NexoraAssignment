import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as cartApi from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'shopcart_local_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartAnimationTrigger, setCartAnimationTrigger] = useState(0);
  const { isAuthenticated } = useAuth();

  // Load local cart from localStorage
  const loadLocalCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const localCart = JSON.parse(stored);
        setCartItems(localCart);
        calculateTotals(localCart);
      } else {
        // No cart in localStorage - clear cart state
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
      }
    } catch (err) {
      console.error('Error loading local cart:', err);
      // On error, clear cart
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  };

  // Save local cart to localStorage
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving local cart:', err);
    }
  };

  // Calculate totals from cart items
  const calculateTotals = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (item.productId?.price || item.price) * item.qty,
      0
    );
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    setCartTotal(total);
    setCartCount(count);
  };

  // Fetch cart from backend (authenticated users only)
  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.getCart();
      setCartItems(data.data);
      setCartTotal(data.total);
      setCartCount(data.count);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Merge local cart with backend (when user logs in)
  const mergeCartWithBackend = async () => {
    try {
      const localCartData = localStorage.getItem(CART_STORAGE_KEY);
      if (!localCartData) {
        // No local cart, just fetch backend cart
        await fetchBackendCart();
        return;
      }

      const localCart = JSON.parse(localCartData);
      if (localCart.length === 0) {
        await fetchBackendCart();
        return;
      }

      setLoading(true);

      // Convert local cart to format backend expects
      const localCartFormatted = localCart.map(item => ({
        productId: item.productId?._id || item.productId,
        qty: item.qty,
      }));

      // Send to backend to merge
      const data = await cartApi.mergeLocalCart(localCartFormatted);
      setCartItems(data.data);
      setCartTotal(data.total);
      setCartCount(data.count);

      // Clear local cart after successful merge
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Error merging cart:', err);
      toast.error('Failed to sync cart');
      // Fallback to just fetching backend cart
      await fetchBackendCart();
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, qty = 1, productData = null) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Backend cart
        await cartApi.addToCart(productId, qty);
        await fetchBackendCart();
      } else {
        // Local cart
        let localCart = [...cartItems];
        const existingIndex = localCart.findIndex(
          item => (item.productId?._id || item.productId) === productId
        );

        if (existingIndex >= 0) {
          // Update quantity
          localCart[existingIndex].qty += qty;
        } else {
          // Add new item
          localCart.push({
            _id: `local_${Date.now()}`,
            productId: productData || productId,
            qty,
          });
        }

        setCartItems(localCart);
        calculateTotals(localCart);
        saveLocalCart(localCart);
      }

      setCartAnimationTrigger(prev => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Backend cart
        await cartApi.removeFromCart(itemId);
        await fetchBackendCart();
      } else {
        // Local cart
        const localCart = cartItems.filter(item => item._id !== itemId);
        setCartItems(localCart);
        calculateTotals(localCart);
        saveLocalCart(localCart);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, productId, newQty) => {
    if (newQty < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Backend cart
        await cartApi.removeFromCart(itemId);
        await cartApi.addToCart(productId, newQty);
        await fetchBackendCart();
      } else {
        // Local cart
        const localCart = cartItems.map(item => {
          if (item._id === itemId) {
            return { ...item, qty: newQty };
          }
          return item;
        });
        setCartItems(localCart);
        calculateTotals(localCart);
        saveLocalCart(localCart);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // User just logged in/became guest - merge local cart with backend
      mergeCartWithBackend();
    } else {
      // User logged out or not authenticated - load local cart
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    error,
    cartAnimationTrigger,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart: isAuthenticated ? fetchBackendCart : loadLocalCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
