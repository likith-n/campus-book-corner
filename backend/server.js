import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? true : (process.env.FRONTEND_URL || 'http://localhost:8080'),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import requestsRoutes from './routes/requests.js';
import usersRoutes from './routes/users.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/users', usersRoutes);

// Root route - Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 BookShare API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      listings: '/api/listings',
      requests: '/api/requests',
      users: '/api/users'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Get configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_NAME = process.env.DB_NAME || 'bookshare';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Start server
testConnection().then((connected) => {
  if (!connected) {
    console.error('\n❌ Could not connect to MySQL database!');
    console.error('   DB_HOST:', process.env.DB_HOST);
    console.error('   DB_USER:', process.env.DB_USER);
    console.error('   DB_NAME:', process.env.DB_NAME);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('\n🚀 BookShare API Server Started');
    console.log('================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`💾 Database: ${DB_NAME}`);
    console.log(`🔗 Frontend: ${FRONTEND_URL}`);
    console.log('================================\n');
  });
});

export default app;
