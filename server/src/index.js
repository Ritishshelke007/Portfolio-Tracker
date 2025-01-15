import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import stockRoutes from './routes/stockRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import config from './config/config.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://portfolio-tracker-three-beta.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Portfolio Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(config.mongodb_uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
