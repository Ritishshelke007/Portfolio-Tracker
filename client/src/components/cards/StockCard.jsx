import React, { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import EditStockModal from '../modals/EditStockModal';

const StockCard = ({ stock, handleDelete, handleEdit }) => {
  console.log("Stock in stock card:", stock);
  
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const calculateMetrics = () => {
    const investedAmount = stock.quantity * stock.purchasePrice;
    const currentAmount = stock.quantity * stock.currentPrice;
    const profitLoss = currentAmount - investedAmount;
    const profitLossPercentage = (profitLoss / investedAmount) * 100;
    return { profitLoss, profitLossPercentage };
  };

  const { profitLoss, profitLossPercentage } = calculateMetrics();
  const isProfit = profitLoss >= 0;

  const handleConfirmDelete = async () => {
    await handleDelete(stock._id);
    setShowDeleteModal(false);
  };

  const handleConfirmEdit = async (updatedStock) => {
    await handleEdit(updatedStock);
    setShowEditModal(false);
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg ${
          darkMode ? 'bg-[#27272A] text-white' : 'bg-white'
        } shadow-lg transition-transform hover:scale-105 duration-300 cursor-pointer`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{stock.symbol}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stock.companyName}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <FaEdit className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <FaTrash className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity</p>
            <p className="font-semibold">{stock.quantity}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buy Price</p>
            <p className="font-semibold">&#8377;{stock.purchasePrice.toFixed(2)}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Price</p>
            <p className="font-semibold">&#8377;{stock.currentPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>P/L</p>
            <p
              className={`font-semibold ${
                isProfit ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isProfit ? '+' : ''}&#8377;{profitLoss.toFixed(2)}
              <span className='px-1'>{`(${isProfit ? '+' : ''}${profitLossPercentage.toFixed(2)}%)`}</span>
            </p>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        stockSymbol={stock.symbol}
        darkMode={darkMode}
      />

      <EditStockModal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        stock={stock}
        onUpdate={handleConfirmEdit}
      />
    </>
  );
};

export default StockCard;
