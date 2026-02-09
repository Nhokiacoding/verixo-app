import React from 'react';
import { footerMenu } from '../../../constants/footerMenu';

const FooterNav = () => {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {footerMenu.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`
              flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200
              ${window.location.pathname === item.href 
                ? 'text-primary-600' 
                : 'text-secondary-500 hover:text-secondary-700'
              }
            `}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
