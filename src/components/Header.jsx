import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="py-4 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaMoneyBillWave className="text-green-600 text-3xl mr-2" />
          <h1 className="text-2xl font-bold text-blue-900">AI Money Mentor</h1>
        </div>
        <div>
          <p className="text-sm text-blue-700 italic">Your guide to online income</p>
        </div>
      </div>
    </header>
  );
};

export default Header;