import React from 'react';
import Icon from './Icon';

const FundDeveloperButton: React.FC = () => {
  return (
    <a
      href="https://www.buymeacoffee.com/praneethreddy33"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-20 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300 group"
      aria-label="Fund the app developer"
    >
      <Icon name="coffee" className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-semibold rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Fund App Developer
      </span>
    </a>
  );
};

export default FundDeveloperButton;
