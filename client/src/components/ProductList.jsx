import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiCheck, HiPlus, HiMinus } from 'react-icons/hi';
import { fetchProducts } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * ProductList Component
 * Displays products in glassmorphism grid with animations
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Helper function to get cart item info
  const getCartItem = (productId) => {
    return cartItems.find(item => item.productId._id === productId);
  };

  const getCartQuantity = (productId) => {
    const item = getCartItem(productId);
    return item ? item.qty : 0;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart(productId);
    
    // Find product data for local cart
    const product = products.find(p => p._id === productId);
    const productData = product ? {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    } : null;
    
    await addToCart(productId, 1, productData);
    
    // Show success animation
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  const handleIncrement = async (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      await updateQuantity(cartItem._id, productId, cartItem.qty + 1);
    }
  };

  const handleDecrement = async (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      if (cartItem.qty > 1) {
        await updateQuantity(cartItem._id, productId, cartItem.qty - 1);
      } else {
        // Remove from cart if quantity is 1
        await removeFromCart(cartItem._id);
      }
    }
  };

  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-4">
            <div className="skeleton h-48 w-full"></div>
            <div className="skeleton h-6 w-3/4"></div>
            <div className="skeleton h-8 w-1/3"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="glass-card inline-block px-8 py-6">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button onClick={loadProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="product-grid"
    >
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -8 }}
          className="glass-card-hover group relative overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-xl bg-white/50 aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=Product';
              }}
            />
            
            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                {(() => {
                  const cartQty = getCartQuantity(product._id);
                  const isAdding = addingToCart === product._id;
                  
                  if (isAdding) {
                    return (
                      <button disabled className="w-full py-2 text-sm btn-primary">
                        <span className="flex items-center justify-center gap-2">
                          <HiCheck className="text-lg" />
                          Added!
                        </span>
                      </button>
                    );
                  }
                  
                  if (cartQty > 0) {
                    // Show quantity controls inside green button
                    return (
                      <div className="w-full py-2 bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-xl 
                        font-semibold transition-all flex items-center justify-between px-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDecrement(product._id);
                          }}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                        >
                          <HiMinus className="text-xl" />
                        </button>
                        
                        <span className="flex items-center gap-2 text-sm">
                          <HiShoppingCart className="text-lg" />
                          In Cart ({cartQty})
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleIncrement(product._id);
                          }}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-all active:scale-90"
                        >
                          <HiPlus className="text-xl" />
                        </button>
                      </div>
                    );
                  }
                  
                  // Show add to cart button
                  return (
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full py-2 text-sm btn-primary"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <HiShoppingCart className="text-lg" />
                        Quick Add
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <div className="price-tag">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] text-sm leading-tight break-words">
              {product.name}
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
