import React from 'react';

const Loader = ({ size = 'md', color = 'primary', text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`
        ${sizes[size]} 
        border-4 
        ${colors[color]} 
        border-t-transparent 
        rounded-full 
        animate-spin
      `}></div>
      {text && (
        <p className="mt-2 text-sm text-secondary-600">{text}</p>
      )}
    </div>
  );
};

export default Loader;
