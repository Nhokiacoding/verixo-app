import React from 'react';

const SidebarItem = ({ icon, label, href, badge, isActive, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
          : 'text-secondary-600 hover:bg-gray-100 hover:text-secondary-800'
        }
      `}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-secondary-400'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      
      {badge && (
        <span className="text-lg">
          {badge}
        </span>
      )}
    </a>
  );
};

export default SidebarItem;
