const groq = require('../utils/groqClient');
const Product = require('../models/Product');

/**
 * System prompt for AI customer service agent
 */
const getSystemPrompt = (products) => {
  const productList = products.map(p => 
    `- ${p.name}: ₹${p.price.toLocaleString('en-IN')}`
  ).join('\n');

  return `You are a friendly and professional customer service AI assistant for ShopCart E-Commerce.

YOUR ROLE:
You help customers with product information, purchasing decisions, and company policies.

PRODUCTS WE SELL (All prices in Indian Rupees - ₹):
${productList}

YOUR RESPONSIBILITIES:
1. Answer questions about our products (features, prices, availability)
2. Provide product recommendations based on customer needs and budget
3. Explain our refund and return policies
4. Greet customers warmly and professionally
5. Help with general shopping inquiries

IMPORTANT: When recommending products, ALWAYS mention the EXACT product name from the list above so customers can see product details with images and add them to cart easily.

COMPANY POLICIES:

REFUND POLICY:
- 30-day money-back guarantee on all products
- Products must be unused and in original packaging
- Refund processed within 5-7 business days after we receive the item
- Original shipping costs are non-refundable
- Customer pays return shipping unless item is defective

SHIPPING:
- Free shipping on all orders
- Standard shipping: 3-5 business days
- Express shipping: 1-2 business days (additional fee)

PAYMENT:
- We accept all major credit cards, PayPal, and Apple Pay
- Secure checkout with SSL encryption

STRICT RULES:
❌ ONLY answer questions about our products, services, and company policies
❌ If asked about topics unrelated to our business (weather, politics, cooking, jokes, etc.), politely respond: "I can't answer that. I'm here to help with our products and services. How can I assist you with shopping today?"
❌ Never make up product information - only use the products listed above
❌ Don't provide medical, legal, or financial advice
❌ Be concise but helpful - keep responses under 150 words
❌ If you don't know something specific, admit it and offer to help with something else

TONE:
- Friendly, professional, and helpful
- Use a conversational but respectful tone
- Show enthusiasm about our products
- Be patient and understanding

Remember: You're here to help customers shop and answer their questions about ShopCart!`;
};

/**
 * @desc    Send message to AI chatbot
 * @route   POST /api/chat
 * @access  Public
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      res.status(400);
      throw new Error('Message is required');
    }

    if (message.length > 500) {
      res.status(400);
      throw new Error('Message is too long (max 500 characters)');
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      res.status(500);
      throw new Error('AI service is not configured');
    }

    // Fetch current products for context
    const products = await Product.find({}).select('name price image');

    // Get system prompt with product context
    const systemPrompt = getSystemPrompt(products);

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Latest fast and capable model
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
      stream: false,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 
      "I'm having trouble responding right now. Please try again.";

    // Check if AI is recommending products and include product data
    const recommendedProducts = [];
    
    // Extract product mentions from AI response
    for (const product of products) {
      const productNameLower = product.name.toLowerCase();
      const messageLower = message.toLowerCase();
      const responseLower = aiResponse.toLowerCase();
      
      // If user asked about or AI mentioned this product
      if (messageLower.includes(productNameLower) || responseLower.includes(productNameLower)) {
        recommendedProducts.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date().toISOString(),
        products: recommendedProducts.length > 0 ? recommendedProducts : null,
      },
    });

  } catch (error) {
    // Handle Groq API specific errors
    if (error.message?.includes('API key')) {
      res.status(500);
      error.message = 'AI service configuration error';
    } else if (error.status === 429) {
      res.status(429);
      error.message = 'Too many requests. Please wait a moment.';
    }
    
    next(error);
  }
};

module.exports = {
  sendMessage,
};
