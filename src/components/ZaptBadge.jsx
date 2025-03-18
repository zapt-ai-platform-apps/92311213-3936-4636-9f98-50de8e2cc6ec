import React from 'react';

const ZaptBadge = () => {
  return (
    <div className="text-center py-2 text-xs text-gray-600">
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-blue-600 transition-colors"
      >
        Made on ZAPT
      </a>
    </div>
  );
};

export default ZaptBadge;