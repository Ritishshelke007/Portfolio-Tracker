import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const MARKET_INDICES = [
  { symbol: '^NSEI', name: 'NIFTY 50' },
  { symbol: '^BSESN', name: 'SENSEX' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY' }
];

const TimeframeButton = ({ active, children, onClick }) => {
  const { darkMode } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm ${
        active 
          ? 'bg-blue-500/10 text-blue-500' 
          : darkMode 
            ? 'bg-[#18181B] text-white hover:bg-[#27272A]'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
};

const DashboardSkeleton = () => {
  const { darkMode } = useTheme();
  return (
    <div className="w-full animate-pulse">
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-[#27272A]' : 'bg-white'}`}>
        <div className={`h-7 w-40 mb-6 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
        
        <div className="space-y-4">
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-2">
                  <div className={`h-5 w-24 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-7 w-32 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div className={`h-7 w-40 mb-8 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
                  <div className={`h-5 w-32 mb-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  <div className={`h-8 w-40 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((index) => (
                <div key={index} className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
                  <div className={`h-5 w-40 mb-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className={`h-12 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stocks }) => {
  const { darkMode } = useTheme();
  const [metricsData, setMetricsData] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    profitLossPercentage: 0,
    topPerformer: null,
    topGainers: [],
    topLosers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stocks) {
      const metrics = calculateMetrics();
      setMetricsData(metrics);
      setIsLoading(false);
    }
  }, [stocks]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        console.log('Fetching market data...');
        const responses = await Promise.all(
          MARKET_INDICES.map(async index => {
            console.log(`Fetching data for ${index.symbol}...`);
            try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/quote/${encodeURIComponent(index.symbol)}`);
              console.log(`Response for ${index.symbol}:`, response.data);
              if (!response.data || typeof response.data.price !== 'number') {
                console.error(`Invalid data format for ${index.symbol}:`, response.data);
                return null;
              }
              return response;
            } catch (err) {
              console.error(`Error fetching ${index.symbol}:`, err.response || err.message);
              return null;
            }
          })
        );

        const newMarketData = {};
        responses.forEach((response, index) => {
          if (!response) return;
          const data = response.data;
          newMarketData[MARKET_INDICES[index].symbol] = {
            ...data,
            name: MARKET_INDICES[index].name
          };
        });
        console.log('Market data fetched successfully:', newMarketData);
        setMarketData(newMarketData);
        setError(null);
      } catch (error) {
        console.error('Error in fetchMarketData:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch market data');
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh market data every minute
    return () => clearInterval(interval);
  }, []);

  const calculateMetrics = () => {
    if (!stocks || stocks.length === 0) {
      return {
        totalInvestment: 0,
        currentValue: 0,
        totalProfitLoss: 0,
        profitLossPercentage: 0,
        topPerformer: null,
        topGainers: [],
        topLosers: []
      };
    }

    const stockMetrics = stocks.map(stock => {
      const investedAmount = Number(stock.quantity) * Number(stock.purchasePrice);
      const currentAmount = Number(stock.quantity) * Number(stock.currentPrice);
      const profitLoss = currentAmount - investedAmount;
      const profitLossPercentage = (profitLoss / investedAmount) * 100;

      return {
        ...stock,
        investedAmount,
        currentAmount,
        profitLoss,
        profitLossPercentage
      };
    });

    const totalInvestment = stockMetrics.reduce((sum, stock) => sum + stock.investedAmount, 0);
    const currentValue = stockMetrics.reduce((sum, stock) => sum + stock.currentAmount, 0);
    const totalProfitLoss = currentValue - totalInvestment;
    const profitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    const profitableStocks = stockMetrics.filter(stock => stock.profitLossPercentage > 0);
    const topPerformer = profitableStocks.length > 0 
      ? profitableStocks.reduce((prev, current) => 
          current.profitLossPercentage > prev.profitLossPercentage ? current : prev
        )
      : null;

    const sortedStocks = [...stockMetrics].sort((a, b) => b.profitLossPercentage - a.profitLossPercentage);
    const topGainers = sortedStocks.filter(stock => stock.profitLossPercentage > 0).slice(0, 3);
    const topLosers = sortedStocks.filter(stock => stock.profitLossPercentage < 0).slice(-3).reverse();

    return {
      totalInvestment,
      currentValue,
      totalProfitLoss,
      profitLossPercentage,
      topPerformer,
      topGainers,
      topLosers
    };
  };

  const renderMarketIndices = () => {
    if (error) {
      return (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKET_INDICES.map((index) => {
          const data = marketData[index.symbol];
          if (!data) {
            return (
              <div key={index.symbol} className="space-y-1">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {index.name}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-lg font-semibold font-numeric ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    --
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium text-gray-500`}>-- ₹</span>
                    <span className={`text-sm font-medium text-gray-500`}>--%</span>
                  </div>
                </div>
              </div>
            );
          }

          const isPositive = (data.changePercent || 0) >= 0;
          const formattedValue = data.value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
          const formattedChange = (data.changePercent || 0).toFixed(2);

          return (
            <div key={index.symbol} className="space-y-1">
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {index.name}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-lg font-semibold font-numeric ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formattedValue}
                </span>
                <div className="flex gap-1">
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  ₹ {isPositive ? '+' : ''}{data.change} 
                  </span>
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    ({isPositive ? '+' : ''}{formattedChange}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const {
    totalInvestment,
    currentValue,
    totalProfitLoss,
    profitLossPercentage,
    topPerformer,
    topGainers,
    topLosers
  } = metricsData;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full">
      <div className={`rounded-xl p-4 sm:p-6 ${darkMode ? 'bg-[#27272A]' : 'bg-white shadow-sm'}`}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Indices Today
          </h2>
        </div>

        <div className="space-y-4">
          <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            {renderMarketIndices()}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 sm:mb-8 pt-6 sm:pt-8">
          <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Portfolio
          </h2>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
            <h3 className={`text-2xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 sm:mb-0`}>
              ₹{currentValue.toFixed(2)}
            </h3>
            <div className={`flex items-center ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span className="text-base sm:text-xl font-medium">
                {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
              </span>
              {totalProfitLoss >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Performer</h3>
              {topPerformer ? (
                <div className="flex items-center justify-between">
                  <span className={`font-medium text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{topPerformer.symbol}</span>
                  <span className="text-green-500 text-base sm:text-lg">+{topPerformer.profitLossPercentage.toFixed(2)}%</span>
                </div>
              ) : (
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No profitable stocks in your portfolio.</div>
              )}
            </div>
            <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
              <h4 className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Portfolio Value
              </h4>
              <div className="flex items-center justify-between">
                <span className={`font-medium text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Total Investment
                </span>
                <span className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ₹{totalInvestment.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Top Gainers in Portfolio
              </h3>
              <div className="space-y-3">
                {topGainers.length > 0 ? (
                  topGainers.map(stock => (
                    <div key={stock.symbol} className="flex justify-between items-center">
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stock.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium font-numeric ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stock.currentPrice}</div>
                        <div className="text-sm font-medium text-green-500">+{stock.profitLossPercentage.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No gainers in your portfolio.</div>
                )}
              </div>
            </div>

            <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Top Losers in Portfolio
              </h3>
              <div className="space-y-3">
                {topLosers.length > 0 ? (
                  topLosers.map(stock => (
                    <div key={stock.symbol} className="flex justify-between items-center">
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stock.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium font-numeric ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{stock.currentPrice}</div>
                        <div className="text-sm font-medium text-red-500">{stock.profitLossPercentage.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No losers in your portfolio.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
