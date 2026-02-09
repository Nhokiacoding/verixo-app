import React from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';

const WalletBalance = ({ balance = 0 }) => {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center">
          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-secondary-600 hidden sm:block">Wallet Balance</p>
          <p className="text-sm sm:text-base font-semibold text-primary-700">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
