const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Security Headers ──────────────────────────────────
app.use(helmet());

// ── CORS — only allow your frontend ──────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────
// Global: 100 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { message: '❌ Too many requests, please try again later' },
});

// Auth: 10 attempts per 15 min (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: '❌ Too many login attempts, please try again later' },
});

app.use(globalLimiter);

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🛍️ Shopy API is running...' });
});

// ── Routes ────────────────────────────────────────────
app.use('/api/auth',       authLimiter, require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart',       require('./routes/cartRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/wishlist',   require('./routes/wishlistRoutes'));
app.use('/api/reviews',    require('./routes/reviewRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/payment',    require('./routes/paymentRoutes'));

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
