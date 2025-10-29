import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import ProductList from '../components/ProductList';

/**
 * HomePage Component
 * Modern landing page with hero section and product catalog
 */
const HomePage = () => {
  return (
    <div className="container-custom">
      {/* Hero Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 md:py-16"
      >
        <div className="glass-card p-8 md:p-12 text-center bg-gradient-mesh">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <HiSparkles className="text-3xl text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4"
          >
            Welcome to ShopCart
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover amazing products at incredible prices.{' '}
            <span className="font-semibold text-primary-600">Premium quality</span> meets{' '}
            <span className="font-semibold text-primary-600">affordable shopping</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-8 flex-wrap"
          >
            <div className="glass-card px-6 py-3">
              <p className="text-2xl font-bold gradient-text">500+</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="glass-card px-6 py-3">
              <p className="text-2xl font-bold gradient-text">50K+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="glass-card px-6 py-3">
              <p className="text-2xl font-bold gradient-text">4.8★</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </motion.div>
        </div>
      </motion.div> */}

      {/* Products Section */}
      <div className="pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">Handpicked selection just for you</p>
        </motion.div>

        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;
