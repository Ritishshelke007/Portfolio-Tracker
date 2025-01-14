const express = require('express');
const router = express.Router();
const axios = require('axios');

// Cache market data to avoid rate limits
const cache = {
  data: {},
  timestamp: {}
};

const CACHE_DURATION = 60000; // 1 minute

// Get real-time quote for a market index
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Check cache first
    if (
      cache.data[symbol] &&
      cache.timestamp[symbol] &&
      Date.now() - cache.timestamp[symbol] < CACHE_DURATION
    ) {
      return res.json(cache.data[symbol]);
    }

    // Fetch from Yahoo Finance API
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      params: {
        range: '1d',
        interval: '1m'
      }
    });

    const result = response.data.chart.result[0];
    const quote = result.meta;
    const lastPrice = result.indicators.quote[0].close.slice(-1)[0] || quote.regularMarketPrice;
    const previousClose = quote.previousClose;
    
    const marketData = {
      symbol: symbol,
      price: lastPrice,
      previousClose: previousClose,
      change: lastPrice - previousClose,
      changePercent: ((lastPrice - previousClose) / previousClose) * 100
    };

    // Update cache
    cache.data[symbol] = marketData;
    cache.timestamp[symbol] = Date.now();

    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

module.exports = router;
