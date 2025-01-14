const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new stock
router.post('/', async (req, res) => {
  const stock = new Stock({
    symbol: req.body.symbol,
    companyName: req.body.companyName,
    quantity: req.body.quantity,
    purchasePrice: req.body.purchasePrice,
    currentPrice: req.body.currentPrice
  });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update quantity only
router.patch('/:id/quantity', async (req, res) => {
  try {
    const { quantity } = req.body;
    console.log('Updating quantity for stock:', req.params.id);
    console.log('New quantity:', quantity);

    const result = await Stock.updateOne(
      { _id: req.params.id },
      { quantity: quantity }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Stock not found or quantity not modified' });
    }

    // Fetch and return the updated stock
    const updatedStock = await Stock.findById(req.params.id);
    res.json(updatedStock);
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update full stock
router.put('/:id', async (req, res) => {
  try {
    const { quantity, purchasePrice } = req.body;
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      { quantity, purchasePrice },
      { new: true }
    );
    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a stock
router.delete('/:id', async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
