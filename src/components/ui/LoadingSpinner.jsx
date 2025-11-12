import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'white' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    white: 'border-white',
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600'
  };

  return (
    <div className="inline-flex items-center justify-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          border-2 ${colorClasses[color]} border-t-transparent 
          rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;