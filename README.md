# ShopCart E-Commerce Application

A modern full-stack e-commerce shopping cart application built with React, Node.js, Express, and MongoDB.

## Features

- **Product Catalog** - Browse products with image, price (₹), and add-to-cart functionality
- **Shopping Cart** - Add items without login, update quantities (integrated +/- controls), and remove items
- **Local Cart Storage** - Cart persists in browser localStorage when not logged in
- **Smart Cart Sync** - Local cart automatically merges with backend when logging in or becoming guest
- **Cart Auto-Clear** - All localStorage (including cart) clears on logout for fresh session
- **User Authentication** - Guest mode, login, and signup with JWT
- **AI Chatbot** - Customer service assistant with product recommendations
- **Checkout** - Complete orders with form validation
- **Responsive Design** - Mobile-friendly glassmorphism UI with smooth animations
- **Real-time Updates** - Global state management with React Context

## Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Axios for API calls
- Framer Motion for animations
- React Router for navigation

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Express Validator
- Groq SDK for AI chatbot

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NitishManral/NexoraAssignment.git
cd NexoraAssignment
```

2. **Backend Setup**
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/mockEcom
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:3000
```

3. **Frontend Setup**
```bash
cd client
npm install
```

Create `client/.env` (optional):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Running the Application

**Start Backend:**
```bash
cd server
npm start
```
Server runs on http://localhost:5000

**Start Frontend:**
```bash
cd client
npm run dev
```
Client runs on http://localhost:3000

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart (Protected)
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/checkout` - Process checkout

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Continue as guest
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Send message to AI chatbot

## Project Structure

```
NexoraAssignment/
├── client/                # React frontend
│   ├── src/
│   │   ├── api/          # API service layer
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   └── styles/       # CSS files
│   └── package.json
│
├── server/               # Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper functions
│   └── package.json
│
└── README.md
```

## Database Schema

**Product**
```javascript
{
  name: String,
  price: Number,
  image: String
}
```

**CartItem**
```javascript
{
  productId: ObjectId (ref: Product),
  qty: Number,
  userId: String
}
```

**User**
```javascript
{
  name: String,
  email: String,
  password: String,
  isGuest: Boolean,
  guestExpiresAt: Date
}
```

## License

This project is for demonstration use only.
