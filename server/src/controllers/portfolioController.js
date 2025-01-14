import asyncHandler from 'express-async-handler';
import Stock from '../models/Stock.js';

// Get portfolio metrics
export const getPortfolioMetrics = asyncHandler(async (req, res) => {
  const stocks = await Stock.find();
  
  const totalValue = stocks.reduce((sum, stock) => 
    sum + (stock.currentPrice * stock.quantity), 0);
    
  const totalInvestment = stocks.reduce((sum, stock) => 
    sum + (stock.purchasePrice * stock.quantity), 0);
    
  const totalProfitLoss = totalValue - totalInvestment;
  const profitLossPercentage = (totalProfitLoss / totalInvestment) * 100;
  
  // Find top performing stock
  const topPerformer = stocks.reduce((best, current) => {
    const currentReturn = ((current.currentPrice - current.purchasePrice) / current.purchasePrice) * 100;
    const bestReturn = ((best.currentPrice - best.purchasePrice) / best.purchasePrice) * 100;
    return currentReturn > bestReturn ? current : best;
  }, stocks[0]);
  
  // Calculate portfolio distribution
  const distribution = stocks.map(stock => ({
    symbol: stock.symbol,
    percentage: ((stock.currentPrice * stock.quantity) / totalValue) * 100
  }));
  
  res.json({
    totalValue,
    totalInvestment,
    totalProfitLoss,
    profitLossPercentage,
    topPerformer: topPerformer ? {
      symbol: topPerformer.symbol,
      profitLossPercentage: ((topPerformer.currentPrice - topPerformer.purchasePrice) / topPerformer.purchasePrice) * 100
    } : null,
    distribution
  });
});
