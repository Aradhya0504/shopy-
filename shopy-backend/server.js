const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🛍️ Shopy API is running...' });
});

// ── Routes (uncomment as we build them) ──────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart',       require('./routes/cartRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/wishlist',   require('./routes/wishlistRoutes'));
app.use('/api/reviews',    require('./routes/reviewRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Copy this token — you'll need it for TEST 3 and 4: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjgyNjhkYzVkYTY1ODVmNTk2ODI4YSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc3MzY3NjE3MywiZXhwIjoxNzc0MjgwOTczfQ.qtYqIv7r1Q1YwdpnG28vKUUoJru0HpmHIOf-5ZBBXXM
