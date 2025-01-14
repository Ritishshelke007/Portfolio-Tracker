const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stockRoutes = require('./routes/stockRoutes');
const marketRoutes = require('./routes/marketRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/market', marketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
