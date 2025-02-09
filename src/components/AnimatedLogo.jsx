import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';

const AnimatedLogo = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className={`transform transition-all duration-1000 ease-out
        ${isLoaded ? 'translate-x-0 opacity-100 rotate-0' : '-translate-x-full opacity-0 -rotate-180'}`}>
        <div className="relative w-10 h-10 overflow-visible">
          <img 
            src="/logo.png" 
            alt="JIL Market Cart"
            className="w-10 h-10 object-contain"
          />
          <div className={`absolute -right-1 -top-1 w-4 h-4 bg-green-500 rounded-full transform transition-all duration-500 delay-700
            ${isLoaded ? 'scale-100' : 'scale-0'}`}>
            <div className="w-full h-full animate-pulse bg-green-400 rounded-full"/>
          </div>
        </div>
      </div>
      <div className={`flex flex-col transition-all duration-700 delay-300
        ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <span className="text-xl font-bold text-white">JIL Market</span>
        <span className={`text-xs text-green-100 transform transition-all duration-500 delay-500
          ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          Le meilleur prix, tout simplement
        </span>
      </div>
    </div>
  );
};

export default AnimatedLogo;