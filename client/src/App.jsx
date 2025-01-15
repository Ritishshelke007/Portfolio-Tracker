import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import StockList from './components/StockList'
import AddEditStock from './components/AddEditStock'
import { MagnifyingGlassIcon, BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { ThemeProvider, useTheme } from './context/ThemeContext'

function AppContent() {
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Error fetching stocks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
        if (response.data.status === 'ok') {
          console.log('Backend is healthy');
        }
      } catch (error) {
        console.log('Backend is starting up, retrying in 5 seconds...');
        setTimeout(checkBackendHealth, 5000);
      }
    };

    checkBackendHealth();
  }, []);

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleStockUpdate = async (updatedStock) => {
    try {
      console.log('Updating stock:', updatedStock);
      
      const response = await axios.put(
        `http://localhost:3000/api/stocks/${updatedStock._id}`,
        {
          quantity: updatedStock.quantity,
          purchasePrice: updatedStock.purchasePrice
        }
      );
      
      console.log('Stock update response:', response.data);

      if (response.data) {
        setStocks(prevStocks => 
          prevStocks.map(stock => 
            stock._id === updatedStock._id 
              ? response.data
              : stock
          )
        );
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Error updating stock');
    }
  };

  const handleStockDelete = async (stockId) => {
    try {
      await axios.delete(`http://localhost:3000/api/stocks/${stockId}`);
      setStocks(prevStocks => prevStocks.filter(stock => stock._id !== stockId));
    } catch (error) {
      console.error('Error deleting stock:', error);
      setError('Error deleting stock');
    }
  };

  return (
    <div className={`flex w-full ${darkMode ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Container */}
      <div className="flex-1">
        {/* Header */}
        <header className={`fixed top-0 right-0 left-0 lg:left-64 z-10 ${darkMode ? 'bg-[#18181B]' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center justify-end lg:justify-between px-8 py-4">
           
           <div className='hidden lg:block'>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Portfolio Tracker
            </h1>
           
           </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'hover:bg-[#27272A] text-gray-400' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>
              <button className={`p-2 rounded-full ${
                darkMode 
                  ? 'hover:bg-[#27272A] text-gray-400' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full ${darkMode ? 'bg-[#27272A]' : 'bg-gray-200'}`}></div>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex w-full lg:pl-64 pt-24 ">
          <div className="h-full w-full px-4 lg:px-8 pb-8">
            {activeTab === 'dashboard' ? (
              <>
                <div>
                  <Dashboard stocks={stocks} />
                </div>
                <div className="my-8">
                  <StockList 
                    stocks={stocks} 
                    isLoading={isLoading} 
                    error={error} 
                    handleStockUpdate={handleStockUpdate} 
                    handleStockDelete={handleStockDelete} 
                  />
                </div>
              </>
            ) : (
              <AddEditStock />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App
