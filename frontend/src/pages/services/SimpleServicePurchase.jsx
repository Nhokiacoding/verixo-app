import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import Button from '../../components/common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const SimpleServicePurchase = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [servicePrice, setServicePrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  
  // Purchase state
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // idle, processing, success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [orderId, setOrderId] = useState(null);

  // Fetch user data
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
        navigateTo('/login');
      }
    };

    fetchUserData();
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        const apiServices = data.data?.services || [];
        
        const activeServices = apiServices
          .filter(service => service.status === 'active')
          .map(service => ({
            code: service.code.toLowerCase(),
            name: service.name,
            price: service.currentPrice || 3200
          }));
        
        setServices(activeServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Update price when service changes
  useEffect(() => {
    if (selectedService) {
      const service = services.find(s => s.code === selectedService);
      setServicePrice(service?.price || 0);
    } else {
      setServicePrice(0);
    }
  }, [selectedService, services]);

  const handlePurchase = async () => {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    if (userBalance < servicePrice) {
      alert('Insufficient balance. Please fund your wallet first.');
      navigateTo('/fund-wallet');
      return;
    }

    setIsLoading(true);
    setPurchaseStatus('processing');

    try {
      const result = await apiService.purchaseNumber(selectedService, 'us');
      
      setPhoneNumber(result.data.number.phoneNumber);
      setOrderId(result.data.number.id);
      setPurchaseStatus('success');
      
      // Start polling for OTP
      startPollingForOTP(result.data.number.id);
      
      // Update balance
      setUserBalance(prev => prev - servicePrice);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error.message || 'Purchase failed. Please try again.');
      setPurchaseStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const startPollingForOTP = async (numberId) => {
    let pollCount = 0;
    const maxPolls = 120; // Poll for 20 minutes (120 * 10 seconds)
    
    const pollForOTP = async () => {
      try {
        const result = await apiService.getSMSCodes(numberId);
        const codes = result.data?.smsCodes || [];
        
        if (codes.length > 0) {
          // OTP received!
          setOtpCode(codes[0].code);
          return; // Stop polling
        }
        
        // Continue polling
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForOTP, 10000); // Poll every 10 seconds
        } else {
          // Timeout after 20 minutes
          setOtpCode('Timeout - No OTP received');
        }
        
      } catch (error) {
        console.error('Error polling for OTP:', error);
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForOTP, 10000);
        }
      }
    };
    
    // Start polling after 5 seconds
    setTimeout(pollForOTP, 5000);
  };

  const handleNewPurchase = () => {
    setPurchaseStatus('idle');
    setPhoneNumber('');
    setOtpCode('');
    setOrderId(null);
    setSelectedService('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
                Purchase Virtual Number
              </h1>
              <p className="text-secondary-600">
                Select a service and get your verification number instantly
              </p>
            </div>

            {purchaseStatus === 'idle' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                {/* Service Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                    disabled={isLoading}
                  >
                    <option value="">-- Choose a service --</option>
                    {services.map((service) => (
                      <option key={service.code} value={service.code}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Display */}
                {selectedService && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-secondary-600">Service:</span>
                      <span className="font-semibold text-secondary-800">
                        {services.find(s => s.code === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Amount:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(servicePrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Balance Info */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Your Balance:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {formatCurrency(userBalance)}
                    </span>
                  </div>
                  {selectedService && userBalance < servicePrice && (
                    <p className="text-sm text-red-600 mt-2">
                      Insufficient balance. Please fund your wallet.
                    </p>
                  )}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchase}
                  disabled={!selectedService || isLoading || userBalance < servicePrice}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Purchase Number'}
                </Button>
              </div>
            )}

            {purchaseStatus === 'processing' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-secondary-800 mb-2">Processing Purchase</h3>
                <p className="text-secondary-600">Please wait while we allocate your number...</p>
              </div>
            )}

            {purchaseStatus === 'success' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Purchase Successful!</h3>
                  <p className="text-secondary-600">Your number is ready to use</p>
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Your Phone Number
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <span className="flex-1 font-mono text-lg font-bold text-secondary-800">
                      {phoneNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(phoneNumber)}
                      className="ml-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* OTP Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    OTP Code
                  </label>
                  {otpCode ? (
                    <div className="flex items-center bg-green-50 border border-green-300 rounded-lg p-4">
                      <span className="flex-1 font-mono text-2xl font-bold text-green-800 text-center">
                        {otpCode}
                      </span>
                      {!otpCode.includes('Timeout') && (
                        <button
                          onClick={() => copyToClipboard(otpCode)}
                          className="ml-2 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
                      <div className="animate-pulse mb-2">
                        <div className="w-12 h-12 bg-yellow-200 rounded-full mx-auto mb-2"></div>
                      </div>
                      <p className="text-yellow-800 font-medium">Waiting for OTP...</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        OTP will appear here automatically (usually within 30-120 seconds)
                      </p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Important Information:</p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• This number is active for 20 minutes</li>
                        <li>• OTP will auto-fetch every 10 seconds</li>
                        <li>• Use the code immediately for verification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* New Purchase Button */}
                <Button
                  onClick={handleNewPurchase}
                  variant="outline"
                  className="w-full"
                >
                  Purchase Another Number
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SimpleServicePurchase;
