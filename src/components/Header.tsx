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
              <span className="flex items-center text-gray-200 text-sm mr-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D8ABC&color=fff&size=32`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow"
                />
                Eingeloggt als <b className="ml-1">{username}</b>
              </span>
            )}
            {onLogout && (
              <button onClick={onLogout} className="text-blue-200 hover:underline">Logout</button>
            )}
            <Button
              variant={darkMode ? "primary" : "secondary"}
              onClick={() => setDarkMode(!darkMode)}              
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