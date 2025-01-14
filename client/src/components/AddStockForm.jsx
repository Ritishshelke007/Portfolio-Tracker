import { useState } from 'react';
import axios from 'axios';

const AddStockForm = ({ onStockAdded }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    purchasePrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add .NS suffix if not present for Indian stocks
      const symbol = formData.symbol.includes('.NS') ? formData.symbol : `${formData.symbol}.NS`;
      
      const response = await axios.post('http://localhost:3000/api/stocks', {
        ...formData,
        symbol,
        purchasePrice: parseFloat(formData.purchasePrice),
      });

      setFormData({
        symbol: '',
        companyName: '',
        purchasePrice: '',
      });

      if (onStockAdded) {
        onStockAdded(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="e.g., RELIANCE"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Reliance Industries Ltd"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Price
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="e.g., 2500"
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>
    </div>
  );
};

export default AddStockForm;
