import React, { useState } from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  validation = {}, 
  error, 
  required = false,
  className = '',
  value,
  ...props 
}) => {
  const inputId = `field-${name}`;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isValid = !error && hasValue;

  return (
    <div className={`form-field ${error ? 'error' : ''} ${isValid ? 'success' : ''} ${className}`}>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          placeholder={isFocused ? placeholder : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...register(name, validation)}
          className={`
            peer w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 dark:text-white placeholder-transparent
            ${error 
              ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20' 
              : isValid 
                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80'
            }
            ${isFocused ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-400 dark:hover:border-gray-500
          `}
          {...props}
        />
        
        <label 
          htmlFor={inputId} 
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            ${isFocused || hasValue 
              ? '-top-2.5 text-xs font-semibold bg-white dark:bg-gray-800 px-2 rounded' 
              : 'top-3 text-base'
            }
            ${error 
              ? 'text-red-600 dark:text-red-400' 
              : isFocused 
                ? 'text-blue-600 dark:text-blue-400' 
                : isValid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Success/Error Icons */}
        {(isValid || error) && (
          <div className="absolute right-3 top-3">
            {isValid ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;