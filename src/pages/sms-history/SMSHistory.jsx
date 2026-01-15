import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api';

const SMSHistory = () => {
  const [smsHistory, setSmsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSMSHistory();
  }, []);

  const fetchSMSHistory = async () => {
    try {
      setLoading(true);
      // This would be the actual API call when implemented
      // const response = await apiService.get('/sms/history');
      // setSmsHistory(response.data);
      
      // For now, show empty state
      setSmsHistory([]);
    } catch (err) {
      setError('Failed to load SMS history');
      console.error('Error fetching SMS history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchSMSHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">SMS History</h1>
        
        {smsHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No SMS History</h3>
            <p className="text-gray-500 mb-6">
              Your SMS message history will appear here once you start receiving verification codes.
            </p>
            <button 
              onClick={() => window.location.href = '/services'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Your First Number
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {smsHistory.map((sms, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-800">{sms.sender}</div>
                  <div className="text-sm text-gray-500">{sms.receivedAt}</div>
                </div>
                <div className="text-gray-600 mb-2">{sms.message}</div>
                <div className="text-sm text-gray-500">
                  Number: {sms.phoneNumber} | Service: {sms.service}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSHistory;
