import { useState, useEffect } from 'react';
import Button from '../common/Button/Button';
import { formatCurrency } from '../../utils/formatCurrency';

const PricingControl = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [bulkPercentage, setBulkPercentage] = useState('');

  // USA Services with updated premium pricing
  const defaultUSAServices = [
    {
      id: 'wa',
      serviceCode: 'wa',
      name: 'WhatsApp',
      icon: '📱',
      description: 'Instant verification for WhatsApp accounts',
      category: 'messaging',
      currentPrice: 3200,
      popular: true
    },
    {
      id: 'tg',
      serviceCode: 'tg',
      name: 'Telegram',
      icon: '✈️',
      description: 'Fast activation for Telegram accounts',
      category: 'messaging',
      currentPrice: 3200,
      popular: true
    },
    {
      id: 'ig',
      serviceCode: 'ig',
      name: 'Instagram',
      icon: '📷',
      description: 'Premium numbers for Instagram verification',
      category: 'social',
      currentPrice: 3500,
      popular: false
    },
    {
      id: 'fb',
      serviceCode: 'fb',
      name: 'Facebook',
      icon: '👥',
      description: 'Quick verification for Facebook accounts',
      category: 'social',
      currentPrice: 3400,
      popular: false
    },
    {
      id: 'tw',
      serviceCode: 'tw',
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Verified numbers for Twitter/X accounts',
      category: 'social',
      currentPrice: 3500,
      popular: false
    },
    {
      id: 'tt',
      serviceCode: 'tt',
      name: 'TikTok',
      icon: '🎵',
      description: 'Premium service for TikTok verification',
      category: 'social',
      currentPrice: 3500,
      popular: false
    },
    {
      id: 'discord',
      serviceCode: 'discord',
      name: 'Discord',
      icon: '🎮',
      description: 'Gaming community verification',
      category: 'gaming',
      currentPrice: 3300,
      popular: false
    },
    {
      id: 'signal',
      serviceCode: 'signal',
      name: 'Signal',
      icon: '🔒',
      description: 'Secure messaging verification',
      category: 'messaging',
      currentPrice: 3200,
      popular: false
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch services from backend first
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/admin/services', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const backendServices = data.data.services.map(service => ({
              id: service.id,
              serviceCode: service.code.toLowerCase(),
              name: service.name,
              icon: getServiceIcon(service.code),
              description: service.description,
              category: service.category || 'social',
              currentPrice: service.currentPrice,
              popular: service.settings?.popular || false
            }));
            
            setServices(backendServices);
            // Also save to localStorage as backup
            localStorage.setItem('adminUSAServicePricing', JSON.stringify(backendServices));
            return;
          }
        }

        // Fallback to localStorage if backend fails
        const savedServices = localStorage.getItem('adminUSAServicePricing');
        if (savedServices) {
          try {
            setServices(JSON.parse(savedServices));
          } catch (error) {
            console.error('Error loading saved pricing:', error);
            setServices(defaultUSAServices);
          }
        } else {
          setServices(defaultUSAServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Use localStorage or defaults as fallback
        const savedServices = localStorage.getItem('adminUSAServicePricing');
        if (savedServices) {
          setServices(JSON.parse(savedServices));
        } else {
          setServices(defaultUSAServices);
        }
      } finally {
        setIsLoading(false);
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

  const handleEditPrice = (service) => {
    setEditingService(service.id);
    setNewPrice(service.currentPrice.toString());
  };

  const handleSavePrice = async (serviceId) => {
    setIsLoading(true);
    
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }

      if (price < 100) {
        alert('Price must be at least ₦100');
        return;
      }

      if (price > 50000) {
        alert('Price cannot exceed ₦50,000');
        return;
      }

      // Update service price in backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/services/${serviceId}/pricing`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPrice: price,
          reason: 'Admin price update via pricing control panel'
        })
      });

      if (!response.ok) {
        // If service ID doesn't work, try with service code
        const service = services.find(s => s.id === serviceId);
        if (service) {
          const codeResponse = await fetch(`/api/admin/services/${service.serviceCode.toUpperCase()}/pricing`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              currentPrice: price,
              reason: 'Admin price update via pricing control panel'
            })
          });
          
          if (!codeResponse.ok) {
            const errorData = await codeResponse.json();
            throw new Error(errorData.message || 'Failed to update price');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update price');
        }
      }

      // Update local state
      const updatedServices = services.map(service => 
        service.id === serviceId 
          ? { ...service, currentPrice: price }
          : service
      );
      
      setServices(updatedServices);
      
      // Also save to localStorage as backup
      localStorage.setItem('adminUSAServicePricing', JSON.stringify(updatedServices));
      
      setEditingService(null);
      setNewPrice('');
      
      alert('Price updated successfully!');
      
    } catch (error) {
      console.error('Error updating price:', error);
      alert(`Failed to update price: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setNewPrice('');
  };

  const handleBulkPriceUpdate = async (type) => {
    const percentage = parseFloat(bulkPercentage);
    if (isNaN(percentage) || percentage <= 0) {
      alert('Please enter a valid percentage');
      return;
    }

    if (percentage > 100) {
      alert('Percentage cannot exceed 100%');
      return;
    }

    const multiplier = type === 'increase' ? (1 + percentage / 100) : (1 - percentage / 100);
    
    const updatedServices = services.map(service => ({
      ...service,
      currentPrice: Math.round(service.currentPrice * multiplier)
    }));

    try {
      // Update all services in backend
      const token = localStorage.getItem('token');
      const updatePromises = updatedServices.map(service => {
        // Try with service code first, then with ID
        const serviceIdentifier = service.serviceCode ? service.serviceCode.toUpperCase() : service.id;
        return fetch(`/api/admin/services/${serviceIdentifier}/pricing`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPrice: service.currentPrice,
            reason: `Bulk ${type} by ${percentage}%`
          })
        });
      });

      const responses = await Promise.all(updatePromises);
      
      // Check if any requests failed
      const failedRequests = responses.filter(response => !response.ok);
      if (failedRequests.length > 0) {
        console.warn(`${failedRequests.length} price updates failed`);
      }

      setServices(updatedServices);
      localStorage.setItem('adminUSAServicePricing', JSON.stringify(updatedServices));
      setBulkPercentage('');
      
      if (failedRequests.length === 0) {
        alert(`All prices ${type}d by ${percentage}%!`);
      } else {
        alert(`Prices updated locally. ${failedRequests.length} backend updates failed.`);
      }
    } catch (error) {
      console.error('Error updating bulk prices:', error);
      // Still update locally as fallback
      setServices(updatedServices);
      localStorage.setItem('adminUSAServicePricing', JSON.stringify(updatedServices));
      setBulkPercentage('');
      alert(`Prices updated locally. Backend sync may have failed: ${error.message}`);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'messaging': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'gaming': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all prices to default BlissDigitals values?')) {
      setServices(defaultUSAServices);
      localStorage.setItem('adminUSAServicePricing', JSON.stringify(defaultUSAServices));
      alert('Prices reset to defaults!');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800 mb-2">
              🇺🇸 USA Service Pricing
            </h1>
            <p className="text-secondary-600">
              Manage pricing for all USA virtual number services
            </p>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Bulk Price Update */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Bulk Price Update</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentage Change
            </label>
            <input
              type="number"
              placeholder="Enter percentage (e.g., 10)"
              value={bulkPercentage}
              onChange={(e) => setBulkPercentage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <Button
              variant="primary"
              onClick={() => handleBulkPriceUpdate('increase')}
              disabled={!bulkPercentage}
              className="w-full sm:w-auto"
            >
              ↗️ Increase All
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkPriceUpdate('decrease')}
              disabled={!bulkPercentage}
              className="w-full sm:w-auto"
            >
              ↘️ Decrease All
            </Button>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 This will update all USA service prices by the specified percentage.
          </p>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-secondary-800">Pricing Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(Math.min(...services.map(s => s.currentPrice)))}
              </div>
              <p className="text-sm text-blue-700">Lowest Price</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Math.max(...services.map(s => s.currentPrice)))}
              </div>
              <p className="text-sm text-green-700">Highest Price</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(Math.round(services.reduce((sum, s) => sum + s.currentPrice, 0) / services.length))}
              </div>
              <p className="text-sm text-purple-700">Average Price</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {services.length}
              </div>
              <p className="text-sm text-orange-700">Total Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Pricing Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-secondary-800">USA Service Pricing Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{service.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                          {service.popular && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingService === service.id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">₦</span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="100"
                          max="50000"
                          step="10"
                        />
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(service.currentPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingService === service.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSavePrice(service.id)}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditPrice(service)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">USA Premium Pricing Strategy</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Premium USA numbers command higher prices (₦3200-3500 range)</li>
              <li>• Popular services (WhatsApp, Telegram) priced competitively at ₦3200</li>
              <li>• Social media services (Instagram, TikTok, Twitter) at premium ₦3500</li>
              <li>• Gaming/Discord services at mid-tier ₦3300</li>
              <li>• Monitor BlissDigitals API costs and maintain healthy markup</li>
              <li>• USA numbers have high demand and support premium pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingControl;
