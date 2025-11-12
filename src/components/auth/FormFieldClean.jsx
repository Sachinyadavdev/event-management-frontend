import React from 'react';

const FormFieldClean = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  validation = {}, 
  error, 
  required = false,
  className = '',
  ...props 
}) => {
  const inputId = `field-${name}`;

  return (
    <div className={`${className}`}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormFieldClean;