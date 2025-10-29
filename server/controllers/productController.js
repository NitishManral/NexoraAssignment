const Product = require('../models/Product');
const axios = require('axios');

/**
 * Mock products as fallback if Fake Store API fails
 * Prices in Indian Rupees (INR)
 */
const mockProducts = [
  {
    name: 'Wireless Headphones',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    name: 'Smart Watch',
    price: 16499,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    name: 'Laptop Backpack',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
  },
  {
    name: 'Coffee Maker',
    price: 7499,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
  },
  {
    name: 'Gaming Mouse',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
  },
  {
    name: 'Bluetooth Speaker',
    price: 10499,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  },
  {
    name: 'Fitness Tracker',
    price: 8299,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
  },
  {
    name: 'Desk Lamp',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
  },
];

/**
 * Seed products from Fake Store API or fallback to mock data
 */
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('📦 Products already seeded');
      return;
    }

    let productsToSeed = [];

    // Try to fetch from Fake Store API
    try {
      console.log('🌐 Fetching products from Fake Store API...');
      const response = await axios.get('https://fakestoreapi.com/products?limit=10');
      
      // Convert USD prices to INR (1 USD ≈ 83 INR)
      productsToSeed = response.data.map(product => ({
        name: product.title,
        price: Math.round(product.price * 83), // Convert to INR
        image: product.image,
      }));
      
      console.log('✅ Successfully fetched products from Fake Store API');
    } catch (apiError) {
      console.log('⚠️  Fake Store API unavailable, using mock data');
      productsToSeed = mockProducts;
    }

    // Insert products into database
    await Product.insertMany(productsToSeed);
    console.log(`✅ Seeded ${productsToSeed.length} products to database`);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  getProducts,
  seedProducts,
};

