import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const EditStockModal = ({ isOpen, onRequestClose, stock, onUpdate }) => {
  const { darkMode } = useTheme();
  const [quantity, setQuantity] = useState(stock ? stock.quantity : 0);
  const [buyPrice, setBuyPrice] = useState(stock ? stock.purchasePrice : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(stock);
    
    const updatedStock = {
      _id: stock._id,
      symbol: stock.symbol,
      quantity: Number(quantity),
      purchasePrice: Number(buyPrice),
      currentPrice: stock.currentPrice // Preserve the current price
    };
    onUpdate(updatedStock);
    onRequestClose();
  };

  if (!isOpen) return null;
  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-[#27272A]' : 'bg-white'} rounded-xl p-6 max-w-sm w-full mx-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Edit Stock
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Quantity:
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className={`mt-1 block w-full p-2 border rounded ${
                darkMode ? 'bg-gray-800 text-white' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Buy Price:
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              required
              className={`mt-1 block w-full p-2 border rounded ${
                darkMode ? 'bg-gray-800 text-white' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setQuantity(stock.quantity);
                setBuyPrice(stock.purchasePrice);
                onRequestClose();
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
