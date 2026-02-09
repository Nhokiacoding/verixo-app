import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import apiService from '../../utils/api';

const RecentTransactions = ({ transactions: propTransactions = [] }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transactions if not provided as props
  useEffect(() => {
    if (propTransactions.length === 0) {
      fetchRecentTransactions();
    } else {
      setTransactions(propTransactions);
    }
  }, [propTransactions]);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTransactions(1, 5); // Get latest 5 transactions
      setTransactions(response.data?.transactions || []);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      // Keep empty array on error
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
      case 'number_purchase':
        return '📱';
      case 'fund_wallet':
      case 'funding':
        return '💳';
      case 'refund':
        return '↩️';
      default:
        return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const displayTransactions = transactions.length > 0 ? transactions : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-800">Recent Transactions</h3>
        <a href="/transactions" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </a>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-secondary-500 mt-2">Loading transactions...</p>
          </div>
        ) : displayTransactions.length > 0 ? (
          displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-secondary-800">{transaction.description || transaction.service}</p>
                  <p className="text-sm text-secondary-500">
                    {new Date(transaction.createdAt || transaction.date).toLocaleDateString()} • {transaction.reference}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-secondary-800'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-secondary-600">No transactions yet</p>
            <p className="text-sm text-secondary-500">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
