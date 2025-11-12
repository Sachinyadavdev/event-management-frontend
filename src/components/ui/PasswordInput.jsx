import React, { useState } from 'react';

const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  onBlur, 
  onFocus,
  placeholder, 
  label, 
  error, 
  touched, 
  disabled = false,
  showStrengthMeter = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const isInvalid = touched && error;

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-semibold text-blue-100 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className={`h-5 w-5 transition-colors duration-200 ${
              isInvalid ? 'text-red-400' : value && !error ? 'text-green-400' : 'text-blue-300'
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl shadow-sm 
            placeholder-blue-200/60 text-white text-sm backdrop-blur-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isInvalid 
              ? 'border-red-400/50 focus:border-red-400 focus:ring-red-500/50' 
              : value && !error
              ? 'border-green-400/50 focus:border-green-400 focus:ring-green-500/50'
              : 'border-white/20 focus:border-blue-400 focus:ring-blue-500/50'
            }
            ${focused ? 'transform scale-[1.02] shadow-lg bg-white/15' : ''}
            hover:border-white/40 focus:hover:border-blue-400
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center group"
          disabled={disabled}
        >
          {showPassword ? (
            <svg className="h-5 w-5 text-blue-300 hover:text-blue-200 group-hover:scale-110 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-blue-300 hover:text-blue-200 group-hover:scale-110 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Error Message */}
      <div className={`mt-2 min-h-[20px] transition-all duration-200 ${isInvalid ? 'opacity-100' : 'opacity-0'}`}>
        {isInvalid && (
          <p className="text-sm text-red-300 flex items-center animate-fade-in">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;