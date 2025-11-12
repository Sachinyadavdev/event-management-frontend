import React, { useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const ForgotPasswordForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email address is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email && value.trim()) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    const error = validateEmail(email);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(email);
    
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(email.trim());
  };

  const isEmailInvalid = touched.email && errors.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors duration-200 ${
                isEmailInvalid ? 'text-red-400' : email ? 'text-green-400' : 'text-gray-400'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            disabled={isLoading}
            placeholder="Enter your email"
            className={`
              block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm 
              placeholder-gray-400 text-gray-900 text-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isEmailInvalid 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : email && !errors.email
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              hover:border-gray-400 focus:hover:border-blue-500
            `}
          />
        </div>
        
        {/* Error Message */}
        <div className={`mt-2 min-h-[20px] transition-all duration-200 ${isEmailInvalid ? 'opacity-100' : 'opacity-0'}`}>
          {isEmailInvalid && (
            <p className="text-sm text-red-600 flex items-center animate-fade-in">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email.trim() || !!errors.email}
        className={`
          group relative w-full flex justify-center py-3 px-4 border border-transparent
          text-sm font-medium rounded-xl text-white transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transform hover:scale-[1.02] active:scale-[0.98]
          ${isLoading || !email.trim() || !!errors.email
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2">Sending...</span>
          </div>
        ) : (
          <span className="flex items-center">
            <svg className="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Reset Link
          </span>
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;