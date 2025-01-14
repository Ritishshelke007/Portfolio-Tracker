import { HomeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const MenuItem = ({ icon: Icon, label, active = false, onClick }) => {
  const { darkMode } = useTheme();
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${
        active 
          ? darkMode ? 'text-white bg-[#27272A]' : 'text-black font-semibold bg-gray-100' 
          : darkMode 
            ? 'text-gray-400 hover:bg-[#27272A]' 
            : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500'}`} />
      <span>{label}</span>
    </div>
  );
};

const Sidebar = ({ activeTab, onTabChange }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`hidden md:block fixed top-0 left-0 w-64 h-full border-r ${
      darkMode 
        ? 'bg-[#18181B] border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3 px-4 mb-8">
          <div className="w-fit p-2 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-2xl">
            CapX
          </div>
        </div>

       

        {/* Main Menu */}
        <div className="mb-8">
         
          <div className="space-y-1">
            <MenuItem 
              icon={HomeIcon} 
              label="Dashboard" 
              active={activeTab === 'dashboard'}
              onClick={() => onTabChange('dashboard')}
            />
            <MenuItem 
              icon={PlusCircleIcon} 
              label="Add Stock" 
              active={activeTab === 'add-edit'}
              onClick={() => onTabChange('add-edit')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
