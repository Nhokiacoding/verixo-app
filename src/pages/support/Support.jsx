import { useState } from 'react';
import { navigateTo } from '../../utils/router';

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I purchase a virtual number?",
      answer: "Go to Services page, select your desired service (WhatsApp, Telegram, etc.), choose a country, and complete the purchase with your wallet balance."
    },
    {
      question: "How long do virtual numbers stay active?",
      answer: "Virtual numbers typically stay active for 20-30 minutes to receive SMS. Some services may have different timeframes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, card payments, and cryptocurrency. Check the Fund Wallet page for available options."
    },
    {
      question: "Can I get a refund if I don't receive SMS?",
      answer: "Yes, if you don't receive the expected SMS within the active period, you can request a refund through our support system."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data and transactions."
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        alert('Support ticket submitted successfully! We will get back to you soon.');
        setContactForm({ subject: '', message: '', priority: 'medium' });
      } else {
        throw new Error('Failed to submit support ticket');
      }
    } catch (err) {
      console.error('Error submitting support ticket:', err);
      alert('Failed to submit support ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help and find answers to your questions</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Guides
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Other Ways to Reach Us</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>📧 Email: support@verixo.com</p>
                    <p>💬 Live Chat: Available 24/7 on our website</p>
                    <p>⏰ Response Time: Usually within 2-4 hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Guides Tab */}
            {activeTab === 'guides' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">User Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">Getting Started</h3>
                    <p className="text-gray-600 mb-4">Learn how to set up your account and make your first purchase</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">Funding Your Wallet</h3>
                    <p className="text-gray-600 mb-4">Step-by-step guide to add funds to your account</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">Using Virtual Numbers</h3>
                    <p className="text-gray-600 mb-4">How to purchase and use virtual numbers for verification</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-2">Troubleshooting</h3>
                    <p className="text-gray-600 mb-4">Common issues and how to resolve them</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
