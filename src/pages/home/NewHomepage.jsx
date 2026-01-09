import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BoltIcon
} from '../../components/icons/SimpleIcons';

const NewHomepage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">Verixo</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get Virtual Numbers for
              <span className="text-blue-600 block">SMS Verification</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Secure, reliable, and instant virtual phone numbers for all your verification needs. 
              Support for WhatsApp, Telegram, Twitter, and 100+ services worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                View Services
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <div className="text-gray-600">Supported Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-gray-600">Countries Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Verixo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the most reliable and secure virtual number service with features designed for your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Delivery</h3>
              <p className="text-gray-600">Get your virtual number instantly. No waiting, no delays - start verifying immediately.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600">Your privacy is our priority. All numbers are private and secure with no data logging.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Numbers from 50+ countries including US, UK, Canada, Germany, and more.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-gray-600">Starting from just ₦32 per number. No hidden fees, no monthly subscriptions.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-red-50 border border-red-100">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated support team is available around the clock to help you succeed.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast SMS Delivery</h3>
              <p className="text-gray-600">Receive SMS codes within seconds. Average delivery time under 30 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supported Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get virtual numbers for all major platforms and services worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'WhatsApp', icon: '📱', popular: true },
              { name: 'Telegram', icon: '✈️', popular: true },
              { name: 'Twitter/X', icon: '🐦', popular: true },
              { name: 'Facebook', icon: '👥', popular: false },
              { name: 'Instagram', icon: '📷', popular: false },
              { name: 'Signal', icon: '🔒', popular: false },
              { name: 'Discord', icon: '🎮', popular: false },
              { name: 'TikTok', icon: '🎵', popular: false },
              { name: 'LinkedIn', icon: '💼', popular: false },
              { name: 'Snapchat', icon: '👻', popular: false },
              { name: 'Viber', icon: '💜', popular: false },
              { name: 'More...', icon: '➕', popular: false }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {service.popular && (
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mb-2 inline-block">
                    Popular
                  </div>
                )}
                <div className="text-3xl mb-2">{service.icon}</div>
                <div className="text-sm font-medium text-gray-900">{service.name}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/services')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pay only for what you use. No monthly fees, no hidden charges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for personal use</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">₦32</div>
                <p className="text-gray-600 mb-8">per number</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic services (WhatsApp, Telegram)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">5+ countries available</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">20-minute number validity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/register')}
                className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 rounded-2xl border-2 border-blue-600 p-8 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-blue-100 mb-6">Best for businesses</p>
                <div className="text-4xl font-bold text-white mb-2">₦35</div>
                <p className="text-blue-100 mb-8">per number</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">All services (100+ platforms)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">50+ countries available</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">30-minute number validity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">API access</span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/register')}
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large scale operations</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
                <p className="text-gray-600 mb-8">volume pricing</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Volume discounts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 phone support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
              </ul>
              <button className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust Verixo for their verification needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Verixo has been a game-changer for my business. The numbers work instantly and the support is excellent. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  A
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Johnson</div>
                  <div className="text-sm text-gray-600">Digital Marketer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Fast, reliable, and affordable. I've tried other services but Verixo is by far the best. The SMS codes arrive within seconds."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-600">E-commerce Owner</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Perfect for managing multiple social media accounts. The variety of countries and services available is impressive."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                  <div className="text-sm text-gray-600">Social Media Manager</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <span>Trusted by</span>
              <span className="font-bold text-blue-600">10,000+</span>
              <span>customers worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our virtual number service.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "How quickly will I receive my virtual number?",
                answer: "Virtual numbers are delivered instantly after payment. You'll receive your number within seconds and can start using it immediately for verification."
              },
              {
                question: "Which services are supported?",
                answer: "We support 100+ services including WhatsApp, Telegram, Twitter/X, Facebook, Instagram, Signal, Discord, TikTok, LinkedIn, and many more. New services are added regularly."
              },
              {
                question: "How long do the numbers stay active?",
                answer: "Numbers remain active for 20-30 minutes depending on your plan. This is sufficient time to receive verification codes from most services."
              },
              {
                question: "Can I use the same number for multiple services?",
                answer: "Each number is single-use for security reasons. You'll need a separate number for each service you want to verify."
              },
              {
                question: "What countries are available?",
                answer: "We offer numbers from 50+ countries including United States, United Kingdom, Canada, Germany, France, Australia, and many more."
              },
              {
                question: "Is my privacy protected?",
                answer: "Absolutely. We don't log or store any SMS content. All numbers are completely private and secure. Your data is never shared with third parties."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust Verixo for their verification needs. 
            Get your first virtual number in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">Verixo</div>
              <p className="text-gray-400 mb-4">
                The most reliable virtual number service for SMS verification worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  👥
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp Numbers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram Numbers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter Numbers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">All Services</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Verixo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewHomepage;