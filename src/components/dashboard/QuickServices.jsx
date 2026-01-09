import React from 'react';
import Button from '../common/Button/Button';

const QuickServices = () => {
  const services = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      price: '₦3,200',
      icon: '📱',
      popular: true,
      description: 'Instant verification'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      price: '₦3,000',
      icon: '✈️',
      description: 'Fast activation'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      price: '₦4,000',
      icon: '📷',
      description: 'Premium numbers'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      price: '₦2,700',
      icon: '👥',
      description: 'Quick verification'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-800">Quick Services</h3>
        <a href="/services" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
              service.popular 
                ? 'border-primary-200 bg-primary-50' 
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            {service.popular && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            
            <div className="text-center">
              <div className="text-2xl mb-2">{service.icon}</div>
              <h4 className="font-semibold text-secondary-800 mb-1">{service.name}</h4>
              <p className="text-xs text-secondary-600 mb-2">{service.description}</p>
              <p className="text-lg font-bold text-primary-600 mb-3">{service.price}</p>
              
              <Button
                size="sm"
                variant={service.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                Get Number
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickServices;