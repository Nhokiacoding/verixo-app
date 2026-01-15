import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/dashboard/StatsCard';
import UserManagement from '../../components/admin/UserManagement';
import PricingControl from '../../components/admin/PricingControl';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeNumbers: 0,
    successRate: 0,
    availableNumbers: 0,
    soldNumbers: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const admin = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@verixo.com',
    role: 'Super Admin'
  };

  // Fetch admin stats
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        
        // For fresh project, start with zero stats
        // These will be populated as users register and make purchases
        setStats({
          totalUsers: 0,
          totalRevenue: 0,
          activeNumbers: 0,
          successRate: 0,
          availableNumbers: 0, // Default available numbers
          soldNumbers: 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: 'blue',
      trend: 'up',
      trendValue: 0
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      color: 'green',
      trend: 'up',
      trendValue: 0
    },
    {
      title: 'Available Numbers',
      value: stats.availableNumbers,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      color: 'purple',
      trend: 'up',
      trendValue: 0
    },
    {
      title: 'Numbers Sold',
      value: stats.soldNumbers,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      color: 'green',
      trend: 'up',
      trendValue: 0
    }
  ];

  const recentUsers = [
    // Users will be populated from API after they register and add funds
  ];

  const recentTransactions = [
    // Transactions will be populated from API
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': case 'Completed': return 'text-green-600 bg-green-100';
      case 'Suspended': case 'Failed': return 'text-red-600 bg-red-100';
      case 'Pending': case 'Processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <AdminHeader 
          admin={admin}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-secondary-600">
                  Monitor and manage your VirtNum platform
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))}
              </div>

              {/* Number Inventory Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-800">USA Numbers</h3>
                    <span className="text-2xl">🇺🇸</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Available:</span>
                      <span className="font-semibold text-green-600">{stats.availableNumbers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Sold:</span>
                      <span className="font-semibold text-blue-600">{stats.soldNumbers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Active:</span>
                      <span className="font-semibold text-purple-600">{stats.activeNumbers}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-800">Revenue Today</h3>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(0)}
                  </div>
                  <p className="text-sm text-secondary-500">No transactions yet</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-800">System Status</h3>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">API Status:</span>
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-600">Database:</span>
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-secondary-800">Recent Users</h3>
                  </div>
                  <div className="p-6">
                    {recentUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <p className="text-secondary-600 text-sm">No users yet</p>
                        <p className="text-secondary-500 text-xs mt-1">Users will appear after registration</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-secondary-800">{user.name}</h4>
                              <p className="text-sm text-secondary-600">{user.email}</p>
                              <p className="text-xs text-secondary-500">Joined: {user.joined}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-secondary-800">{formatCurrency(user.balance)}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-secondary-800">Recent Transactions</h3>
                  </div>
                  <div className="p-6">
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-secondary-600 text-sm">No transactions yet</p>
                        <p className="text-secondary-500 text-xs mt-1">Transactions will appear after user activity</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-secondary-800">{transaction.type}</h4>
                              <p className="text-sm text-secondary-600">{transaction.user}</p>
                              <p className="text-xs text-secondary-500">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                              </p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'pricing' && <PricingControl />}
          
          {activeTab === 'transactions' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">Transaction Management</h2>
                <p className="text-secondary-600">View and manage all platform transactions</p>
                <p className="text-sm text-secondary-500 mt-2">This feature will be available once users start making transactions</p>
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">Service Management</h2>
                <p className="text-secondary-600">Manage available services and integrations</p>
                <p className="text-sm text-secondary-500 mt-2">Configure service availability and settings</p>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">Analytics Dashboard</h2>
                <p className="text-secondary-600">Detailed insights and performance metrics</p>
                <p className="text-sm text-secondary-500 mt-2">Analytics will be available once data is collected</p>
              </div>
            </div>
          )}
          
          {activeTab === 'support' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">Support Tickets</h2>
                <p className="text-secondary-600">Manage customer support requests</p>
                <p className="text-sm text-secondary-500 mt-2">Support tickets will appear here when users submit requests</p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 mb-2">System Settings</h2>
                <p className="text-secondary-600">Configure platform settings and preferences</p>
                <p className="text-sm text-secondary-500 mt-2">System configuration options</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
