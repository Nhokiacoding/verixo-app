import React from 'react';
import FooterNav from './FooterNav';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Desktop Footer */}
      <div className="hidden lg:block px-6 py-4">
        <div className="flex justify-between items-center text-sm text-secondary-500">
          <p>&copy; 2025 Verixo. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-secondary-700 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-secondary-700 transition-colors">Terms of Service</a>
            <a href="/support" className="hover:text-secondary-700 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Mobile Footer Navigation */}
      <div className="lg:hidden">
        <FooterNav />
      </div>
    </footer>
  );
};

export default Footer;
