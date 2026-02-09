import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import Button from '../../components/common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const AllCountries = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedService, setSelectedService] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState('confirm');
  const [purchasedNumber, setPurchasedNumber] = useState(null);
  const [otpCodes, setOtpCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  // Available countries with real API integration
  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸', multiplier: 1.0 },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', multiplier: 1.1 },
    { code: 'ca', name: 'Canada', flag: '🇨🇦', multiplier: 1.0 },
    { code: 'au', name: 'Australia', flag: '🇦🇺', multiplier: 1.2 },
    { code: 'de', name: 'Germany', flag: '🇩🇪', multiplier: 1.1 },
    { code: 'fr', name: 'France', flag: '🇫🇷', multiplier: 1.1 },
    { code: 'es', name: 'Spain', flag: '🇪🇸', multiplier: 1.0 },
    { code: 'it', name: 'Italy', flag: '🇮🇹', multiplier: 1.0 },
    { code: 'nl', name: 'Netherlands', flag: '🇳🇱', multiplier: 1.1 },
    { code: 'se', name: 'Sweden', flag: '🇸🇪', multiplier: 1.2 },
    { code: 'no', name: 'Norway', flag: '🇳🇴', multiplier: 1.3 },
    { code: 'dk', name: 'Denmark', flag: '🇩🇰', multiplier: 1.2 },
    { code: 'fi', name: 'Finland', flag: '🇫🇮', multiplier: 1.2 },
    { code: 'ch', name: 'Switzerland', flag: '🇨🇭', multiplier: 1.4 },
    { code: 'at', name: 'Austria', flag: '🇦🇹', multiplier: 1.1 },
    { code: 'be', name: 'Belgium', flag: '🇧🇪', multiplier: 1.1 },
    { code: 'pt', name: 'Portugal', flag: '🇵🇹', multiplier: 1.0 },
    { code: 'pl', name: 'Poland', flag: '🇵🇱', multiplier: 0.8 },
    { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', multiplier: 0.8 },
    { code: 'hu', name: 'Hungary', flag: '🇭🇺', multiplier: 0.8 }
  ];

  // Base services that will be fetched from BlissDigitals API
  const baseServices = [
    {
      id: 'wa',
      serviceCode: 'wa',
      name: 'WhatsApp',
      icon: '📱',
      description: 'Instant verification for WhatsApp accounts',
      popular: true,
      category: 'messaging',
      basePrice: 3200
    },
    {
      id: 'tg',
      serviceCode: 'tg',
      name: 'Telegram',
      icon: '✈️',
      description: 'Fast activation for Telegram accounts',
      popular: true,
      category: 'messaging',
      basePrice: 3500
    },
    {
      id: 'signal',
      serviceCode: 'signal',
      name: 'Signal',
      icon: '🔒',
      description: 'Secure messaging verification for Signal',
      popular: false,
      category: 'messaging',
      basePrice: 3500
    },
    {
      id: 'tw',
      serviceCode: 'tw',
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Verified numbers for Twitter/X accounts',
      popular: false,
      category: 'social',
      basePrice: 3600
    },
    {
      id: 'fb',
      serviceCode: 'fb',
      name: 'Facebook',
      icon: '👥',
      description: 'Quick verification for Facebook accounts',
      popular: false,
      category: 'social',
      basePrice: 3550
    },
    {
      id: 'ig',
      serviceCode: 'ig',
      name: 'Instagram',
      icon: '📷',
      description: 'Premium numbers for Instagram verification',
      popular: false,
      category: 'social',
      basePrice: 3800
    }
  ];

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
        setUser(userData.data?.user || userData.data || userData);
        setUserBalance(userData.data?.user?.walletBalance || userData.data?.walletBalance || userData.walletBalance || 0);
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

  // Fetch services from BlissDigitals API
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setServices(baseServices);
          setServicesLoading(false);
          return;
        }

        // Try to fetch real services from BlissDigitals API
        const data = await apiService.getServices();
        const apiServices = data.data?.services || [];
        
        if (apiServices.length > 0) {
          // Transform API services to match our UI format
          const transformedServices = apiServices.map(service => {
            const baseService = baseServices.find(bs => bs.serviceCode === service.service_code);
            return {
              id: service.service_code,
              serviceCode: service.service_code,
              name: service.name,
              icon: baseService?.icon || getServiceIcon(service.service_code),
              description: service.description || `Verification service for ${service.name}`,
              popular: baseService?.popular || false,
              category: baseService?.category || getServiceCategory(service.service_code),
              basePrice: service.naira_price || baseService?.basePrice || 3200,
              available: service.available !== false
            };
          });
          setServices(transformedServices);
        } else {
          setServices(baseServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(baseServices);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (serviceCode) => {
    const icons = {
      'wa': '📱', 'tg': '✈️', 'tw': '🐦', 'fb': '👥', 'ig': '📷',
      'li': '💼', 'dc': '🎮', 'tt': '🎵', 'sc': '👻', 'vi': '💜'
    };
    return icons[serviceCode] || '📱';
  };

  const getServiceCategory = (serviceCode) => {
    const categories = {
      'wa': 'messaging', 'tg': 'messaging', 'vi': 'messaging',
      'tw': 'social', 'fb': 'social', 'ig': 'social', 'tt': 'social', 'sc': 'social',
      'li': 'professional',
      'dc': 'gaming'
    };
    return categories[serviceCode] || 'social';
  };

  const getServicePrice = (service, countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    const multiplier = country?.multiplier || 1.0;
    return Math.round(service.basePrice * multiplier);
  };

  const handlePurchaseClick = (service) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigateTo('/login');
      return;
    }

    const servicePrice = getServicePrice(service, selectedCountry);

    if (userBalance < servicePrice) {
      alert('Insufficient balance. Please fund your wallet first.');
      return;
    }

    const serviceWithPrice = { ...service, price: servicePrice };
    setSelectedService(serviceWithPrice);
    setPurchaseStep('confirm');
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    setPurchaseStep('processing');

    try {
      // Purchase number using BlissDigitals API with real country code
      const result = await apiService.purchaseNumber(selectedService.serviceCode, selectedCountry);
      
      if (result.success) {
        setPurchasedNumber(result.data.number.phoneNumber);
        setPurchaseStep('success');
        
        // Update user balance
        setUserBalance(prev => prev - selectedService.price);
        
        // Move to codes view after showing success
        setTimeout(() => {
          setPurchaseStep('codes');
          startPollingForCodes(result.data.number.id);
        }, 2000);
      } else {
        throw new Error(result.message || 'Purchase failed');
      }
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error.message || 'Purchase failed. Please try again.');
      setPurchaseStep('confirm');
    } finally {
      setIsLoading(false);
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
    setIsLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

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
              <span className="text-4xl mr-4">🌍</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
                  All Countries Numbers
                </h1>
                <p className="text-secondary-600">
                  Global phone numbers from 20+ countries with real API integration
                </p>
              </div>
            </div>
          </div>

          {/* Country Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-secondary-500 mt-1">
                  Prices vary by country. Premium countries have higher rates.
                </p>
              </div>
              <div className="flex items-end">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <div className="text-sm text-primary-700 font-medium">
                    Selected: {selectedCountryData?.flag} {selectedCountryData?.name}
                  </div>
                  <div className="text-xs text-primary-600 mt-1">
                    Price multiplier: {selectedCountryData?.multiplier}x
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                      {formatCurrency(getServicePrice(service, selectedCountry))}
                    </div>
                    <p className="text-xs text-secondary-500">per number</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Country:</span>
                      <span className="text-sm font-semibold text-primary-600">
                        {selectedCountryData?.flag} {selectedCountryData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">API:</span>
                      <span className="text-sm font-semibold text-green-600">BlissDigitals</span>
                    </div>
                  </div>

                  <Button
                    variant={service.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handlePurchaseClick(service)}
                    disabled={service.available === false}
                  >
                    {service.available === false ? 'Unavailable' : 'Get Number'}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Purchase Modal - Same as USA Numbers but with country selection */}
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
                            <p className="font-medium">{selectedCountryData?.flag} {selectedCountryData?.name}</p>
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
                      <p className="text-secondary-600">Connecting to BlissDigitals API...</p>
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
                      <p className="text-secondary-600 mb-4">Your number has been allocated</p>
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
                          <span className="text-2xl mr-2">{selectedCountryData?.flag}</span>
                          <span className="font-medium text-blue-800">{selectedCountryData?.name} Number:</span>
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
                              <p className="text-sm text-secondary-500 mt-1">Real SMS delivery via BlissDigitals API</p>
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
                              This number will remain active for 20 minutes. Real SMS codes from BlissDigitals API.
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

export default AllCountries;
