import React from 'react';
import { BarChart3, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">StockfolioPro</h1>
              <p className="text-blue-100 text-sm">Manage your investments with ease</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;