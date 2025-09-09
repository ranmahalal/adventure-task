// Import required dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import exerciseRoutes from './routes/exercises.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Configure middleware
// CORS middleware - allows requests from React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Helmet middleware - adds security headers to protect against common vulnerabilities
app.use(helmet());

// Morgan middleware - HTTP request logger for development and debugging
app.use(morgan('combined'));

// JSON body parser middleware - parses incoming JSON payloads
app.use(express.json());

// Mount API routes
app.use('/api/exercises', exerciseRoutes);

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: "AI Exercise Generator API is running!" });
});

// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
