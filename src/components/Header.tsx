import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="w-full bg-white border-4 border-black p-4 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black">
          Crypto<span className="text-green-400">Radar</span><span>📡</span>
          </Link>
          
          <nav className="flex flex-row gap-40">
            <Link
              to="/"
              className={`font-bold hover:text-green-500 ${
                location.pathname === '/' ? 'text-green-400' : ''
              }`}
            >
              Overview
            </Link>
            <Link
              to="/compare"
              className={`font-bold hover:text-green-500 ${
                location.pathname === '/compare' ? 'text-green-400' : ''
              }`}
            >
              Compare
            </Link>
            <Link
              to="/LatestNews"
              className={`font-bold hover:text-green-500 ${
                location.pathname === '/LatestNews' ? 'text-green-400' : ''
              }`}
            >
              Latest News
            </Link>
            <Link
              to="/currencyconveter"
              className={`font-bold hover:text-green-500 ${
                location.pathname === '/currencyconveter' ? 'text-green-400' : ''
              }`}
            >
              Currency conveter
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">          
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 rounded-none border-2 border-black"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};