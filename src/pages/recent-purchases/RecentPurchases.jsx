import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const RecentPurchases = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigateTo('/login');
          return;
        }

        const userData = await apiService.getUserProfile();
        setUser(userData.data || userData);
        setUserBalance(userData.data?.walletBalance || userData.walletBalance || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({ firstName: 'User', lastName: '', email: '' });
        setUserBalance(0);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setPurchases([]);
          setIsLoading(false);
          return;
        }

        const data = await apiService.getRecentPurchases();
        // Only show actual purchases, not mock data
        setPurchases(data.data?.purchases || []);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        // Don't show mock data on error - show empty state
        setPurchases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'waiting': return 'Waiting for SMS';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header 
          user={user} 
          walletBalance={userBalance}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <button
              onClick={() => navigateTo('/dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
              Recent Purchases
            </h1>
            <p className="text-secondary-600">
              View your recent number purchases and SMS codes
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">No Recent Purchases</h3>
              <p className="text-secondary-600 mb-6">You haven't made any number purchases yet.</p>
              <button
                onClick={() => navigateTo('/services')}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Purchase Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{purchase.serviceIcon}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-800">
                            {purchase.service}
                          </h3>
                          <p className="text-sm text-secondary-600">
                            {purchase.countryFlag} {purchase.country}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-secondary-600">Phone Number:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-medium">{purchase.phoneNumber}</span>
                          <button
                            onClick={() => copyToClipboard(purchase.phoneNumber)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary-600">Price:</span>
                        <p className="font-medium text-primary-600">{formatCurrency(purchase.price)}</p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Purchased:</span>
                        <p className="font-medium">{purchase.purchasedAt.toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-secondary-600">Time Remaining:</span>
                        <p className={`font-medium ${purchase.status === 'expired' ? 'text-red-600' : 'text-green-600'}`}>
                          {formatTimeRemaining(purchase.expiresAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SMS Codes Section */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-secondary-800">SMS Codes</h4>
                      <span className="text-sm text-secondary-500">{purchase.codes.length} received</span>
                    </div>

                    {purchase.codes.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        {purchase.status === 'waiting' ? (
                          <div className="animate-pulse">
                            <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                            <p className="text-secondary-600 text-sm">Waiting for SMS codes...</p>
                          </div>
                        ) : purchase.status === 'expired' ? (
                          <>
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-red-600 text-sm">Number expired - No SMS received</p>
                          </>
                        ) : (
                          <p className="text-secondary-600 text-sm">No SMS codes received yet</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {purchase.codes.map((sms) => (
                          <div key={sms.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  <span className="font-medium text-secondary-800">Verification Code</span>
                                </div>
                                <p className="text-xs text-secondary-500">
                                  Received at {sms.receivedAt.toLocaleTimeString()}
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(sms.code.toString())}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Copy
                              </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <p className="font-mono text-xl font-bold text-center text-secondary-800">
                                {sms.code}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RecentPurchases;
