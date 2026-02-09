import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import Button from '../../components/common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const USANumbers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState('confirm');
  const [purchasedNumber, setPurchasedNumber] = useState(null);
  const [otpCodes, setOtpCodes] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Remove the mock USA services array - use only real data
  // No fallback to mock data

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
        const user = userData.data?.user || userData.user || userData.data || userData;
        setUser(user);
        
        // Get wallet balance
        const balance = await apiService.getWalletBalance();
        setUserBalance(balance);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.message.includes('401') || error.message.includes('token')) {
          navigateTo('/login');
        } else {
          setUser({ firstName: 'User', lastName: '', email: '' });
          setUserBalance(0);
        }
      }
    };

    fetchUserData();
  }, []);

  // Fetch services from admin pricing system
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        
        // Fetch real services from backend API
        const token = localStorage.getItem('token');
        if (!token) {
          setServices([]);
          setServicesLoading(false);
          return;
        }

        const response = await apiService.getServices();
        const apiServices = response.data?.services || [];
        
        if (apiServices.length > 0) {
          // Transform API services to match our UI format
          const transformedServices = apiServices
            .filter(service => service.status === 'active') // Only show active services
            .map(service => ({
              id: service._id || service.id,
              serviceCode: service.code.toLowerCase(),
              name: service.name,
              icon: getServiceIcon(service.code),
              description: service.description || `Verification service for ${service.name}`,
              popular: service.settings?.popular || false,
              category: service.category || 'social',
              price: service.currentPrice || service.pricing?.[0]?.price || 3200,
              available: service.blissDigitals?.available !== false,
              stock: service.blissDigitals?.stock || 0
            }));
          
          setServices(transformedServices);
        } else {
          // No services available - show empty state
          setServices([]);
        }
        
      } catch (error) {
        console.error('Error fetching services:', error);
        // On error, show empty state - no mock data
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (serviceCode) => {
    const icons = {
      'WA': '📱', 'TG': '✈️', 'IG': '📷', 'FB': '👥', 'TW': '🐦', 
      'TT': '🎵', 'DISCORD': '🎮', 'SIGNAL': '🔒'
    };
    return icons[serviceCode.toUpperCase()] || '📱';
  };

  const handlePurchaseClick = (service) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigateTo('/login');
      return;
    }

    if (userBalance < service.price) {
      alert('Insufficient balance. Please fund your wallet first.');
      return;
    }

    setSelectedService(service);
    setPurchaseStep('confirm');
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchaseStep('processing');

    try {
      // Purchase USA number through backend API (no country selection needed)
      const result = await apiService.purchaseNumber(selectedService.serviceCode);
      
      if (result.success) {
        const numberData = result.data;
        setPurchasedNumber(numberData.phoneNumber || numberData.number);
        setPurchaseStep('success');
        
        // Update user balance
        setUserBalance(prev => prev - selectedService.price);
        
        // Store active number
        apiService.activeNumbersStorage.addActiveNumber({
          id: numberData.id,
          phoneNumber: numberData.phoneNumber || numberData.number,
          service: selectedService.name,
          serviceCode: selectedService.serviceCode,
          activationId: numberData.activationId || numberData.id
        });
        
        // Move to codes view after showing success
        setTimeout(() => {
          setPurchaseStep('codes');
          startPollingForCodes(numberData.id);
        }, 2000);
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
      
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorMessage = apiService.handleAPIError(error);
      alert(errorMessage);
      setPurchaseStep('confirm');
    }
  };

  const startPollingForCodes = async (numberId) => {
    let pollCount = 0;
    const maxPolls = 60; // Poll for 10 minutes
    
    const pollForCodes = async () => {
      try {
        const result = await apiService.getSMSCodes(numberId);
        const codes = result.data?.smsCodes || [];
        
        if (codes.length > 0) {
          const transformedCodes = codes.map(sms => ({
            id: sms.id,
            code: sms.code,
            service: selectedService.name,
            time: new Date(sms.receivedAt),
            status: 'received'
          }));
          
          setOtpCodes(transformedCodes);
          return;
        }
        
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForCodes, 10000);
        }
        
      } catch (error) {
        console.error('Error polling for codes:', error);
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForCodes, 10000);
        }
      }
    };
    
    setTimeout(pollForCodes, 5000);
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedService(null);
    setPurchaseStep('confirm');
    setPurchasedNumber(null);
    setOtpCodes([]);
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
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🇺🇸</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
                  USA Numbers
                </h1>
                <p className="text-secondary-600">
                  Premium US phone numbers for instant verification
                </p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">USA Numbers Features</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• High-quality US phone numbers</li>
                  <li>• Instant SMS delivery</li>
                  <li>• 20-minute active duration</li>
                  <li>• Compatible with all major services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md p-6 ${
                    service.popular ? 'border-primary-200 ring-2 ring-primary-100' : 'border-gray-200'
                  }`}
                >
                  {service.popular && (
                    <div className="flex justify-center mb-4">
                      <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h3 className="text-xl font-bold text-secondary-800 mb-2">{service.name}</h3>
                    <p className="text-sm text-secondary-600 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {formatCurrency(service.price)}
                    </div>
                    <p className="text-xs text-secondary-500">per number</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Delivery:</span>
                      <span className="text-sm font-semibold text-green-600">Instant</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Success Rate:</span>
                      <span className="text-sm font-semibold text-green-600">98%+</span>
                    </div>
                  </div>

                  <Button
                    variant={service.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handlePurchaseClick(service)}
                  >
                    Get Number
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Purchase Modal */}
          {showPurchaseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {purchaseStep === 'confirm' && selectedService && (
                    <>
                      <h3 className="text-xl font-bold text-secondary-800 mb-4">Confirm Purchase</h3>
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-4">{selectedService.icon}</span>
                          <div>
                            <h4 className="font-semibold text-secondary-800">{selectedService.name}</h4>
                            <p className="text-sm text-secondary-600">{selectedService.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-secondary-600">Country:</span>
                            <p className="font-medium">🇺🇸 United States</p>
                          </div>
                          <div>
                            <span className="text-secondary-600">Price:</span>
                            <p className="font-medium text-primary-600">{formatCurrency(selectedService.price)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={handleClosePurchaseModal} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleConfirmPurchase} className="flex-1">
                          Purchase Number
                        </Button>
                      </div>
                    </>
                  )}

                  {purchaseStep === 'processing' && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <h3 className="text-xl font-bold text-secondary-800 mb-2">Processing Purchase</h3>
                      <p className="text-secondary-600">Allocating your USA number...</p>
                    </div>
                  )}

                  {purchaseStep === 'success' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Purchase Successful!</h3>
                      <p className="text-secondary-600 mb-4">Your USA number has been allocated</p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 mb-2">Your Number:</p>
                        <p className="text-lg font-mono font-bold text-green-800">{purchasedNumber}</p>
                      </div>
                    </div>
                  )}

                  {purchaseStep === 'codes' && (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-secondary-800">SMS Codes</h3>
                        <button
                          onClick={handleClosePurchaseModal}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">🇺🇸</span>
                          <span className="font-medium text-blue-800">USA Number:</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg font-bold text-blue-900">{purchasedNumber}</span>
                          <button
                            onClick={() => copyToClipboard(purchasedNumber)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-secondary-800">Received SMS Codes</h4>
                          <span className="text-sm text-secondary-500">{otpCodes.length} codes</span>
                        </div>

                        {otpCodes.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <div className="animate-pulse">
                              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                              <p className="text-secondary-600">Waiting for SMS codes...</p>
                              <p className="text-sm text-secondary-500 mt-1">Codes will appear here automatically</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {otpCodes.map((sms) => (
                              <div key={sms.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                      <span className="font-medium text-secondary-800">{sms.service}</span>
                                    </div>
                                    <p className="text-xs text-secondary-500">
                                      {sms.time.toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(sms.code.toString())}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="font-mono text-lg font-bold text-center text-secondary-800">
                                    {sms.code}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Important:</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              This USA number will remain active for 20 minutes. Use the codes quickly for verification.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default USANumbers;
