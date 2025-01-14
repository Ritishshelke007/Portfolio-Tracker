import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Stock from '../models/Stock.js';

// Get stock price from Yahoo Finance API
const getStockPrice = async (symbol) => {
  try {
    // For Indian stocks, append .NS for NSE stocks
    const stockSymbol = symbol.includes('.NS') ? symbol : `${symbol}.NS`;
    console.log('Fetching price for:', stockSymbol);
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=1d`);
    
    if (!response.data.chart.result[0]?.meta?.regularMarketPrice) {
      throw new Error('No price data available');
    }
    
    return response.data.chart.result[0].meta.regularMarketPrice;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    throw new Error('Failed to fetch stock price');
  }
};

// Get all stocks
export const getStocks = asyncHandler(async (req, res) => {
  const stocks = await Stock.find();
  
  // Update current prices
  for (let stock of stocks) {
    try {
      stock.currentPrice = await getStockPrice(stock.symbol);
      await stock.save();
    } catch (error) {
      console.error(`Failed to update price for ${stock.symbol}`);
    }
  }
  
  res.json(stocks);
});

// Add new stock
export const addStock = asyncHandler(async (req, res) => {
  const { symbol, companyName, purchasePrice, quantity } = req.body;
  
  try {
    const currentPrice = await getStockPrice(symbol);
    
    const stock = await Stock.create({
      symbol,
      companyName,
      purchasePrice,
      currentPrice,
      quantity 
    });
    
    res.status(201).json(stock);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Update stock
export const updateStock = asyncHandler(async (req, res) => {
  const { symbol, companyName, purchasePrice, quantity } = req.body;
  const stock = await Stock.findById(req.params.id);
  
  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }
  
  try {
    stock.symbol = symbol || stock.symbol;
    stock.companyName = companyName || stock.companyName;
    stock.purchasePrice = purchasePrice || stock.purchasePrice;
    stock.currentPrice = await getStockPrice(stock.symbol);
    stock.quantity = quantity || stock.quantity;
    const updatedStock = await stock.save();
    res.json(updatedStock);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Delete stock
export const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);
  
  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }
  
  await stock.deleteOne();
  res.json({ message: 'Stock removed' });
});
