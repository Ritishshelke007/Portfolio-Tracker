import express from 'express';
import axios from 'axios';

const router = express.Router();

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
    console.log('Received request for symbol:', symbol);
    
    // Check cache first
    if (
      cache.data[symbol] &&
      cache.timestamp[symbol] &&
      Date.now() - cache.timestamp[symbol] < CACHE_DURATION
    ) {
      console.log('Returning cached data for:', symbol);
      return res.json(cache.data[symbol]);
    }

    // Fetch from Yahoo Finance
    const yahooSymbol = symbol.replace('^', '%5E'); // Properly encode ^ character
    console.log('Fetching from Yahoo Finance:', yahooSymbol);
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
      params: {
        interval: '1d',
        range: '1d'
      }
    });

    console.log('Received response from Yahoo Finance');
    
    if (!response.data?.chart?.result?.[0]) {
      throw new Error('Invalid response format from Yahoo Finance');
    }

    const quote = response.data.chart.result[0];
    const price = quote.meta.regularMarketPrice;
    const previousClose = quote.meta.chartPreviousClose;
    const change = price - previousClose;
    const changePercent = ((change / previousClose) * 100).toFixed(2);

    const marketData = {
      symbol: symbol,
      price: price,
      change: change.toFixed(2),
      changePercent: parseFloat(changePercent)
    };

    // Update cache
    cache.data[symbol] = marketData;
    cache.timestamp[symbol] = Date.now();

    console.log('Sending market data:', marketData);
    res.json(marketData);
  } catch (error) {
    console.error('Error in market data route:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      details: error.message,
    });
  }
});

export default router;
