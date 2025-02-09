import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Home,
  List,
  User,
  Camera,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
      {/* Header avec Logo animé */}
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-green-600'} p-4 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <AnimatedLogo />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors"
          >
            {isDarkMode ? (
              <Sun className="text-white" size={24} />
            ) : (
              <Moon className="text-white" size={24} />
            )}
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        {/* Contenu du dashboard */}
      </main>

      {/* Navigation */}
      <nav className={`border-t ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-green-100'
      } transition-colors duration-300`}>
        <div className="flex justify-around p-2">
          {[
            { icon: Home, tab: 'home' },
            { icon: List, tab: 'list' },
            { icon: Camera, tab: 'scan', special: true },
            { icon: ShoppingCart, tab: 'cart' },
            { icon: User, tab: 'profile' }
          ].map(({ icon: Icon, tab, special }) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 ${
                special 
                  ? `rounded-full ${isDarkMode ? 'bg-green-600' : 'bg-green-600'} text-white shadow-lg` 
                  : activeTab === tab 
                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}