import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Footer from '../../components/layout/Footer/Footer';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import { navigateTo } from '../../utils/router';
import apiService from '../../utils/api';

const ServicesList = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
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
        if (error.message.includes('401') || error.message.includes('token')) {
          navigateTo('/login');
        } else {
          // Set default empty user for development
          setUser({ firstName: 'User', lastName: '', email: '' });
          setUserBalance(0);
        }
      }
    };

    fetchUserData();
  }, []);

  // Simple services - users only see service and price, admin manages availability
  const defaultServices = [
    {
      id: 'wa',
      serviceCode: 'wa',
      name: 'WhatsApp',
      icon: '📱',
      description: 'Instant verification for WhatsApp accounts worldwide',
      popular: true,
      category: 'messaging',
      pricing: {
        us: 3200, uk: 3200, ca: 3200, au: 3200, es: 3200, de: 3200
      }
    },
    {
      id: 'tg',
      serviceCode: 'tg',
      name: 'Telegram',
      icon: '✈️',
      description: 'Fast activation for Telegram accounts',
      popular: true,
      category: 'messaging',
      pricing: {
        us: 3500, uk: 3500, ca: 3500, au: 3500, es: 3500, de: 3500
      }
    },
    {
      id: 'signal',
      serviceCode: 'signal',
      name: 'Signal',
      icon: '🔒',
      description: 'Secure messaging verification for Signal',
      popular: true,
      category: 'messaging',
      pricing: {
        us: 3500, uk: 3500, ca: 3500, au: 3500, es: 3500, de: 3500
      }
    },
    {
      id: 'tw',
      serviceCode: 'tw',
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Verified numbers for Twitter/X accounts',
      popular: false,
      category: 'social',
      pricing: {
        us: 3600, uk: 3600, ca: 3600, au: 3600, es: 3600, de: 3600
      }
    },
    {
      id: 'fb',
      serviceCode: 'fb',
      name: 'Facebook',
      icon: '👥',
      description: 'Quick verification for Facebook accounts',
      popular: false,
      category: 'social',
      pricing: {
        us: 3550, uk: 3550, ca: 3550, au: 3550, es: 3550, de: 3550
      }
    },
    {
      id: 'ig',
      serviceCode: 'ig',
      name: 'Instagram',
      icon: '📷',
      description: 'Premium numbers for Instagram verification',
      popular: false,
      category: 'social',
      pricing: {
        us: 3800, uk: 3800, ca: 3800, au: 3800, es: 3800, de: 3800
      }
    }
  ];

  // Fetch services from API or use defaults
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Use default services if no token
          setServices(defaultServices);
          setServicesLoading(false);
          return;
        }

        const data = await apiService.getServices();
        const apiServices = data.data?.services || [];
        
        if (apiServices.length > 0) {
          // Transform API services to match our UI format
          const transformedServices = apiServices.map(service => ({
            id: service.service_code,
            serviceCode: service.service_code,
            name: service.name,
            icon: getServiceIcon(service.service_code),
            description: service.description || `Verification service for ${service.name}`,
            popular: service.popular || false,
            category: getServiceCategory(service.service_code),
            pricing: service.pricing || {
              us: service.naira_price || 3200,
              uk: service.naira_price || 3200,
              ca: service.naira_price || 3200,
              au: service.naira_price || 3200,
              es: service.naira_price || 3200,
              de: service.naira_price || 3200
            }
          }));
          setServices(transformedServices);
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(defaultServices);
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

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' }
  ];

  const getServicePrice = (service, country) => {
    return service.pricing ? service.pricing[country] || service.pricing.us : 3200;
  };

  const filteredServices = services;

  const handlePurchaseClick = (service) => {
    // Get user balance from localStorage or API
    const token = localStorage.getItem('token');
    if (!token) {
      navigateTo('/login');
      return;
    }

    // Get price for selected country
    const servicePrice = getServicePrice(service, selectedCountry);

    // Check user balance (this should be fetched from API in real implementation)
    if (userBalance < servicePrice) {
      alert('Insufficient balance. Please fund your wallet first.');
      return;
    }

    // Add price to service object for modal display
    const serviceWithPrice = { ...service, price: servicePrice };
    setSelectedService(serviceWithPrice);
    setPurchaseStep('confirm');
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    setPurchaseStep('processing');

    try {
      const result = await apiService.purchaseNumber(selectedService.serviceCode, selectedCountry);
      
      setPurchasedNumber(result.data.number.phoneNumber);
      setPurchaseStep('success');
      
      // Move to codes view after showing success
      setTimeout(() => {
        setPurchaseStep('codes');
        startPollingForCodes(result.data.number.id);
      }, 2000);
      
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
    const maxPolls = 60; // Poll for 10 minutes (60 * 10 seconds)
    
    const pollForCodes = async () => {
      try {
        const result = await apiService.getSMSCodes(numberId);
        const codes = result.data?.smsCodes || [];
        
        if (codes.length > 0) {
          // SMS code received
          const transformedCodes = codes.map(sms => ({
            id: sms.id,
            code: sms.code,
            service: selectedService.name,
            time: new Date(sms.receivedAt),
            status: 'received'
          }));
          
          setOtpCodes(transformedCodes);
          return; // Stop polling
        }
        
        // Continue polling if still pending and within limit
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForCodes, 10000); // Poll every 10 seconds
        }
        
      } catch (error) {
        console.error('Error polling for codes:', error);
        // Continue polling on error, but log it
        pollCount++;
        if (pollCount < maxPolls) {
          setTimeout(pollForCodes, 10000);
        }
      }
    };
    
    // Start polling after a short delay
    setTimeout(pollForCodes, 5000);
  };

  const generatePhoneNumber = (country) => {
    const countryPrefixes = {
      us: '+1',
      uk: '+44',
      ca: '+1',
      de: '+49',
      fr: '+33',
      au: '+61',
      nl: '+31',
      se: '+46',
      no: '+47',
      dk: '+45',
      fi: '+358',
      ch: '+41',
      at: '+43',
      be: '+32',
      es: '+34',
      it: '+39',
      pt: '+351',
      pl: '+48',
      cz: '+420'
    };

    const prefix = countryPrefixes[country] || '+1';
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${prefix}${randomNumber.toString().substring(0, 10)}`;
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
              Available Services
            </h1>
            <p className="text-secondary-600">
              Choose from our wide range of virtual number services
            </p>
          </div>

          {/* Filters */}
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
                  Prices may vary by country. Current selection affects pricing.
                </p>
              </div>
              <div className="flex items-end">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <div className="text-sm text-primary-700 font-medium">
                    Selected: {countries.find(c => c.code === selectedCountry)?.flag} {countries.find(c => c.code === selectedCountry)?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-5-1.691c-2.598-2.11-4.126-5.3-4.126-8.709 0-6.627 5.373-12 12-12s12 5.373 12 12c0 3.409-1.528 6.599-4.126 8.709A7.962 7.962 0 0112 20.4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">No Services Available</h3>
              <p className="text-secondary-600">All services are currently unavailable. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
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
                      <span className="text-sm text-secondary-600">Service:</span>
                      <span className="text-sm font-semibold text-primary-600">{service.name}</span>
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
          <Modal isOpen={showPurchaseModal} onClose={handleClosePurchaseModal}>
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
                        <p className="font-medium">
                          {countries.find(c => c.code === selectedCountry)?.flag} {countries.find(c => c.code === selectedCountry)?.name}
                        </p>
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
                  <p className="text-secondary-600">Please wait while we allocate your number...</p>
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
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="font-medium text-blue-800">Active Number:</span>
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
                          This number will remain active for 20 minutes. Use the codes quickly for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Modal>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ServicesList;
