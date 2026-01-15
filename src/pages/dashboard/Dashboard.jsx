import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';
import { initSessionManager, cleanupSessionManager } from '../../utils/sessionManager';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch user data and dashboard data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigateTo('/login');
          return;
        }

        // Initialize session manager for auto-logout
        initSessionManager();

        // Fetch user profile and dashboard data
        const [userData, dashData] = await Promise.all([
          apiService.getUserProfile(),
          apiService.getDashboardData()
        ]);

        setUser(userData.data?.user || userData.data || userData);
        setUserBalance(userData.data?.user?.walletBalance || userData.data?.walletBalance || userData.walletBalance || 0);
        setDashboardData(dashData.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If API fails, set default for development or redirect to login
        if (error.message.includes('401') || error.message.includes('token')) {
          navigateTo('/login');
        } else {
          // For development - set default user
          setUser({ firstName: 'User', lastName: '', email: '' });
          setUserBalance(0);
          setDashboardData({
            activeNumbers: [],
            recentTransactions: [],
            monthlyStats: { numbers: { totalNumbers: 0, successfulVerifications: 0, totalSpent: 0 } }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Cleanup session manager on unmount
    return () => {
      cleanupSessionManager();
    };
  }, []);

  const stats = [
    {
      title: 'Wallet Balance',
      value: formatCurrency(userBalance),
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Total Purchases',
      value: dashboardData?.monthlyStats?.numbers?.totalNumbers || '0',
      icon: '📱',
      color: 'bg-blue-500'
    },
    {
      title: 'Success Rate',
      value: dashboardData?.monthlyStats?.numbers?.totalNumbers > 0 
        ? `${Math.round((dashboardData.monthlyStats.numbers.successfulVerifications / dashboardData.monthlyStats.numbers.totalNumbers) * 100)}%`
        : '0%',
      icon: '✅',
      color: 'bg-purple-500'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(dashboardData?.monthlyStats?.numbers?.totalSpent || 0),
      icon: '📊',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
              Welcome back, {user?.firstName || 'User'} {user?.lastName || ''}!
            </h1>
            <p className="text-secondary-600">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-secondary-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => window.location.href = '/services'}
                className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">📱</span>
                <div className="text-left">
                  <div className="font-medium text-primary-700">Get Number</div>
                  <div className="text-sm text-primary-600">Purchase SMS number</div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/fund-wallet'}
                className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">💰</span>
                <div className="text-left">
                  <div className="font-medium text-green-700">Fund Wallet</div>
                  <div className="text-sm text-green-600">Add money to wallet</div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/recent-purchases'}
                className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">📋</span>
                <div className="text-left">
                  <div className="font-medium text-blue-700">Recent Purchases</div>
                  <div className="text-sm text-blue-600">View your numbers</div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/support'}
                className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">🎧</span>
                <div className="text-left">
                  <div className="font-medium text-purple-700">Support</div>
                  <div className="text-sm text-purple-600">Get help</div>
                </div>
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
