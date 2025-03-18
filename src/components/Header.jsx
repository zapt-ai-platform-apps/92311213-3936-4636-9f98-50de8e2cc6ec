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
          <p className="text-sm text-blue-700 italic">Your guide to $10K+ monthly income</p>
        </div>
      </div>
      <div className="mt-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
        <p className="text-sm text-blue-800">
          I'll guide you step-by-step to earning <span className="font-bold">$10,000+ per month</span> through scalable online strategies.
        </p>
      </div>
    </header>
  );
};

export default Header;