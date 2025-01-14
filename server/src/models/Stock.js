import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Calculate profit/loss
stockSchema.virtual('profitLoss').get(function() {
  return (this.currentPrice - this.purchasePrice) * this.quantity;
});

// Calculate profit/loss percentage
stockSchema.virtual('profitLossPercentage').get(function() {
  return ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
