import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

// Top 20 Indian stocks with their company names
const STOCK_OPTIONS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.' },
  { symbol: 'ITC.NS', name: 'ITC Ltd.' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd.' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd.' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd.' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Ltd.' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Ltd.' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement Ltd.' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel Ltd.' }
];

const AddEditStock = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    quantity: '',
    purchasePrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStockSelect = (e) => {
    const selectedStock = STOCK_OPTIONS.find(stock => stock.symbol === e.target.value);
    if (selectedStock) {
      setFormData(prev => ({
        ...prev,
        symbol: selectedStock.symbol,
        companyName: selectedStock.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/stocks`, {
        ...formData,
        currentPrice: formData.purchasePrice // Initially set current price to purchase price
      });

      setSuccess('Stock added successfully!');
      setFormData({
        symbol: '',
        companyName: '',
        quantity: '',
        purchasePrice: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 min-h-screen">
      <h1 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Add Stock
      </h1>
      <div className="grid grid-cols-3 gap-6">
        <div className={`col-span-1 rounded-xl p-6 ${darkMode ? 'bg-[#27272A]' : 'bg-white shadow-sm'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Select Stock
              </label>
              <select
                value={formData.symbol}
                onChange={handleStockSelect}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#18181B] border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a stock</option>
                {STOCK_OPTIONS.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                readOnly
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#27272A] border-gray-600 text-gray-400' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#18181B] border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Purchase Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#18181B] border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                darkMode
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? 'Adding...' : 'Add Stock'}
            </button>
          </form>
        </div>
        <div className="col-span-2">
          {/* Right side content - can be used for stock details, charts, or other information */}
        </div>
      </div>
    </div>
  );
};

export default AddEditStock;
