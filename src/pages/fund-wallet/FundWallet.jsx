import { useState, useEffect } from 'react';
import { navigateTo } from '../../utils/router';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import Button from '../../components/common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';

const FundWallet = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [paymentStatus, setPaymentStatus] = useState('form'); // form, processing, success, failed
  const [transactionRef, setTransactionRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    balance: 0
  });

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Paystack',
      description: 'Pay with card, bank transfer, or USSD',
      icon: '💳',
      fees: '₦200'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave', 
      description: 'Multiple payment options available',
      icon: '🏦',
      fees: '₦200'
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigateTo('/login');
          return;
        }

        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            firstName: userData.data?.user?.firstName || '',
            lastName: userData.data?.user?.lastName || '',
            email: userData.data?.user?.email || '',
            phone: userData.data?.user?.phone || '',
            balance: userData.data?.user?.wallet?.balance || 0
         });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const calculateFees = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    // Fixed fee of ₦200 for all payment methods
    return numAmount > 0 ? 200 : 0;
  };

  const fees = calculateFees(amount);
  const total = (parseFloat(amount) || 0) + fees;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fundAmount = parseFloat(amount);
    
    if (fundAmount < 100) {
      alert('Minimum funding amount is ₦100');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigateTo('/login');
        return;
      }

      // Initialize payment with backend
      let response;
      if (paymentMethod === 'paystack') {
        response = await fetch('/api/payments/paystack/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: fundAmount,
            currency: 'NGN'
          })
        });
      } else if (paymentMethod === 'flutterwave') {
        response = await fetch('/api/payments/flutterwave/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: fundAmount,
            currency: 'NGN'
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize payment');
      }

      const data = await response.json();
      const transaction = data.data.transaction;
      
      setTransactionRef(transaction.reference);

      // Initialize payment gateway
      if (paymentMethod === 'paystack') {
        initializePaystackPayment(data.data.paystack, fundAmount);
      } else if (paymentMethod === 'flutterwave') {
        initializeFlutterwavePayment(data.data.flutterwave, fundAmount);
      }

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert(error.message || 'Failed to initialize payment. Please try again.');
      setPaymentStatus('form');
      setIsLoading(false);
    }
  };

  const initializePaystackPayment = (paystackData, amount) => {
    // Check if PaystackPop is loaded
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded');
      alert('Payment system not ready. Please refresh the page and try again.');
      setPaymentStatus('form');
      setIsLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: paystackData.amount || (amount * 100), // Convert to kobo
      currency: 'NGN',
      ref: paystackData.reference || transactionRef,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: `${user.firstName} ${user.lastName}`
          }
        ]
      },
      callback: function(response) {
        console.log('Paystack callback:', response);
        verifyPayment(response.reference);
      },
      onClose: function() {
        console.log('Paystack popup closed');
        setPaymentStatus('form');
        setIsLoading(false);
      }
    });
    
    handler.openIframe();
  };

  const initializeFlutterwavePayment = (flutterwaveData, amount) => {
    // Check if FlutterwaveCheckout is loaded
    if (!window.FlutterwaveCheckout) {
      console.error('Flutterwave script not loaded');
      alert('Payment system not ready. Please refresh the page and try again.');
      setPaymentStatus('form');
      setIsLoading(false);
      return;
    }

    window.FlutterwaveCheckout({
      public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: flutterwaveData.tx_ref || transactionRef,
      amount: flutterwaveData.amount || amount,
      currency: 'NGN',
      payment_options: 'card, banktransfer, ussd',
      customer: {
        email: user.email,
        phone_number: user.phone || '',
        name: `${user.firstName} ${user.lastName}`,
      },
      customizations: {
        title: 'Verixo Wallet Funding',
        description: 'Fund your Verixo wallet',
        logo: 'https://your-domain.com/logo.png',
      },
      callback: function(data) {
        console.log('Flutterwave callback:', data);
        if (data.status === 'successful') {
          verifyPayment(data.tx_ref, data.transaction_id);
        } else {
          console.error('Flutterwave payment failed:', data);
          setPaymentStatus('failed');
          setIsLoading(false);
        }
      },
      onclose: function() {
        console.log('Flutterwave popup closed');
        setPaymentStatus('form');
        setIsLoading(false);
      },
    });
  };

  const verifyPayment = async (reference, transactionId = null) => {
    try {
      const token = localStorage.getItem('token');
      const requestBody = { reference };
      
      // Add transaction_id for Flutterwave
      if (transactionId) {
        requestBody.transaction_id = transactionId;
      }
      
      console.log('Verifying payment:', requestBody);
      
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Payment verification response:', data);

      if (response.ok && data.success) {
        setPaymentStatus('success');
        // Update user balance in state
        setUser(prev => ({
          ...prev,
          balance: data.data.transaction.balanceAfter
        }));
      } else {
        console.error('Payment verification failed:', data);
        throw new Error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setPaymentStatus('failed');
      alert('Payment verification failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigateTo('/dashboard');
  };

  const handleTryAgain = () => {
    setPaymentStatus('form');
    setAmount('');
    setTransactionRef('');
  };

  // Payment Processing Screen
  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header 
            user={user} 
            walletBalance={user.balance}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-secondary-800 mb-2">Processing Payment</h2>
              <p className="text-secondary-600 mb-4">Please complete payment in the popup window...</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-secondary-600">Amount: <span className="font-medium">{formatCurrency(parseFloat(amount))}</span></p>
                <p className="text-sm text-secondary-600">Method: <span className="font-medium capitalize">{paymentMethod}</span></p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Payment Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header 
            user={user} 
            walletBalance={user.balance}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h2>
              <p className="text-secondary-600 mb-6">Your wallet has been funded successfully</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-2xl font-bold text-green-800 mb-1">{formatCurrency(parseFloat(amount))}</div>
                <p className="text-sm text-green-700">Added to your wallet</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-secondary-800 mb-2">Transaction Summary</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-secondary-600">Reference: <span className="font-mono text-xs">{transactionRef}</span></p>
                  <p className="text-secondary-600">New Balance: <span className="font-medium">{formatCurrency(user.balance)}</span></p>
                  <p className="text-secondary-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleReturnToDashboard} className="w-full">
                  Return to Dashboard
                </Button>
                <Button onClick={handleTryAgain} variant="outline" className="w-full">
                  Fund Again
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Payment Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header 
            user={user} 
            walletBalance={user.balance}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-800 mb-2">Payment Failed!</h2>
              <p className="text-secondary-600 mb-6">Your payment could not be processed</p>
              
              <div className="space-y-3">
                <Button onClick={handleTryAgain} className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleReturnToDashboard} variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header 
          user={user} 
          walletBalance={user.balance}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
                Fund Wallet
              </h1>
              <p className="text-secondary-600">
                Add money to your wallet to purchase virtual numbers
              </p>
            </div>

            {/* Current Balance */}
            <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 rounded-xl shadow-lg p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold">{formatCurrency(user.balance)}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Funding Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit}>
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Amount to Fund
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      min="100"
                      step="100"
                      required
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">Minimum amount: ₦100</p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-secondary-700 mb-3">Quick Amounts</p>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => handleQuickAmount(quickAmount)}
                        className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-secondary-700 hover:bg-primary-50 hover:border-primary-300 transition-colors"
                      >
                        ₦{quickAmount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-secondary-700 mb-3">Payment Method</p>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center flex-1">
                          <span className="text-2xl mr-4">{method.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-secondary-800">{method.name}</p>
                            <p className="text-sm text-secondary-600">{method.description}</p>
                            <p className="text-xs text-secondary-500">Fees: {method.fees}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {amount && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-secondary-800 mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Processing Fee:</span>
                        <span className="font-medium">{formatCurrency(fees)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-medium text-secondary-800">Total to Pay:</span>
                        <span className="font-bold text-primary-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!amount || parseFloat(amount) < 100 || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default FundWallet;
