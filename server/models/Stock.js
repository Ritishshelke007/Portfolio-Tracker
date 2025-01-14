const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  strict: true
});

// Pre-save middleware
stockSchema.pre('save', function(next) {
  if (this.quantity) {
    this.quantity = Number(this.quantity);
  }
  if (this.purchasePrice) {
    this.purchasePrice = Number(this.purchasePrice);
  }
  next();
});

// Pre-update middleware
stockSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.quantity) {
    update.quantity = Number(update.quantity);
  }
  if (update.purchasePrice) {
    update.purchasePrice = Number(update.purchasePrice);
  }
  next();
});

module.exports = mongoose.model('Stock', stockSchema);
