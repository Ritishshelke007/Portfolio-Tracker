import React from 'react';
import { useTheme } from '../context/ThemeContext';
import StockCard from './cards/StockCard';

const StockList = ({ stocks, isLoading, error, handleStockUpdate, handleStockDelete }) => {
  const { darkMode } = useTheme();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="lg:p-4">
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Stock Portfolio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map(stock => (
          <StockCard 
            key={stock._id} 
            stock={stock} 
            handleDelete={handleStockDelete} 
            handleEdit={handleStockUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;