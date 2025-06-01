import React from 'react';
import { BarChart3, Sun, Moon } from 'lucide-react';
import Button from './ui/Button';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  // Optional: Logout support
  onLogout?: () => void;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, onLogout, username }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-violet-700 dark:to-violet-900 text-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">StockfolioPro</h1>
              <p className="text-blue-100 text-sm">Manage your investments with ease</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {username && (
              <span className="text-gray-200 text-sm mr-2">Eingeloggt als <b>{username}</b></span>
            )}
            {onLogout && (
              <button onClick={onLogout} className="text-blue-200 hover:underline">Logout</button>
            )}
            <Button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-md shadow  dark:bg-gray-700 dark:text-white text-gray-700  dark:hover:bg-gray-600 bg-blue-600"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;