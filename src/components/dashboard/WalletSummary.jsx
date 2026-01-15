import React from 'react';
import Button from '../common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';

const WalletSummary = ({ balance = 0, totalSpent = 0, totalNumbers = 0 }) => {
  return (
    <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Wallet Summary</h3>
          <p className="text-sm opacity-75">Your account overview</p>
        </div>
        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm opacity-75 mb-1">Current Balance</p>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-75 mb-1">Total Spent</p>
            <p className="text-lg font-semibold">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm opacity-75 mb-1">Numbers Used</p>
            <p className="text-lg font-semibold">{totalNumbers}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 border-white border-opacity-30"
        >
          Fund Wallet
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-white border-opacity-50 text-white hover:bg-white hover:text-primary-600"
        >
          View History
        </Button>
      </div>
    </div>
  );
};

export default WalletSummary;
