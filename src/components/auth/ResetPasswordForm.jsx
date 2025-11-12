import React, { useState } from 'react';
import PasswordInput from '../ui/PasswordInput';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import LoadingSpinner from '../ui/LoadingSpinner';

const ResetPasswordForm = ({ onSubmit, isLoading, initialEmail = '' }) => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value, allValues = formData) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email address is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';

      case 'verificationCode':
        if (!value.trim()) return 'Verification code is required';
        if (value.length < 4) return 'Verification code must be at least 4 characters';
        return '';

      case 'newPassword':
        if (!value) return 'New password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (!/(?=.*[^A-Za-z0-9])/.test(value)) return 'Password must contain at least one special character';
        return '';

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== allValues.newPassword) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name] && value.trim()) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Special handling for confirm password when new password changes
    if (name === 'newPassword' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, { ...formData, [name]: value });
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        email: true,
        verificationCode: true,
        newPassword: true,
        confirmPassword: true
      });
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(formData);
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim()) &&
           Object.values(errors).every(error => !error);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="transform transition-all duration-500 delay-100">
        <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors duration-200 ${
                touched.email && errors.email ? 'text-red-400' : 
                formData.email && !errors.email ? 'text-green-400' : 'text-blue-300'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="Enter your email"
            className={`
              block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-xl shadow-sm 
              placeholder-blue-200/60 text-white text-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              backdrop-blur-sm
              ${touched.email && errors.email
                ? 'border-red-400/50 focus:border-red-400 focus:ring-red-500/50' 
                : formData.email && !errors.email
                ? 'border-green-400/50 focus:border-green-400 focus:ring-green-500/50'
                : 'border-white/20 focus:border-blue-400 focus:ring-blue-500/50'
              }
              hover:border-white/40 focus:hover:border-blue-400
            `}
          />
        </div>
        
        {/* Email Error Message */}
        <div className={`mt-2 min-h-[20px] transition-all duration-200 ${
          touched.email && errors.email ? 'opacity-100' : 'opacity-0'
        }`}>
          {touched.email && errors.email && (
            <p className="text-sm text-red-300 flex items-center animate-fade-in">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Verification Code Field */}
      <div className="transform transition-all duration-500 delay-200">
        <label htmlFor="verificationCode" className="block text-sm font-semibold text-blue-100 mb-2">
          Verification Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors duration-200 ${
                touched.verificationCode && errors.verificationCode ? 'text-red-400' : 
                formData.verificationCode && !errors.verificationCode ? 'text-green-400' : 'text-blue-300'
              }`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3c0-.265.105-.52.293-.707L10.586 9.293A6 6 0 0117 3a6.002 6.002 0 010 12z" />
            </svg>
          </div>
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            value={formData.verificationCode}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="Enter verification code"
            className={`
              block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-xl shadow-sm 
              placeholder-blue-200/60 text-white text-sm font-mono tracking-wider
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              backdrop-blur-sm
              ${touched.verificationCode && errors.verificationCode
                ? 'border-red-400/50 focus:border-red-400 focus:ring-red-500/50' 
                : formData.verificationCode && !errors.verificationCode
                ? 'border-green-400/50 focus:border-green-400 focus:ring-green-500/50'
                : 'border-white/20 focus:border-blue-400 focus:ring-blue-500/50'
              }
              hover:border-white/40 focus:hover:border-blue-400
            `}
          />
        </div>
        
        {/* Verification Code Error Message */}
        <div className={`mt-2 min-h-[20px] transition-all duration-200 ${
          touched.verificationCode && errors.verificationCode ? 'opacity-100' : 'opacity-0'
        }`}>
          {touched.verificationCode && errors.verificationCode && (
            <p className="text-sm text-red-300 flex items-center animate-fade-in">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.verificationCode}
            </p>
          )}
        </div>
      </div>

      {/* New Password Field */}
      <div className="transform transition-all duration-500 delay-300">
        <PasswordInput
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter new password"
          label="New Password"
          error={errors.newPassword}
          touched={touched.newPassword}
          disabled={isLoading}
        />
        
        {/* Password Strength Meter */}
        {formData.newPassword && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <PasswordStrengthMeter password={formData.newPassword} />
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="transform transition-all duration-500 delay-400">
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm new password"
          label="Confirm Password"
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <div className="transform transition-all duration-500 delay-500">
        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className={`
            group relative w-full flex justify-center py-4 px-4 border border-transparent
            text-sm font-bold rounded-xl text-white transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transform hover:scale-[1.02] active:scale-[0.98]
            ${isLoading || !isFormValid()
              ? 'bg-white/20 cursor-not-allowed opacity-60 border border-white/10'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-4">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="h-5 w-5 text-white group-hover:animate-pulse transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          </span>
          <span className="relative z-10">
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </span>
          
          {/* Button glow effect */}
          {!isLoading && isFormValid() && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300"></span>
          )}
          
          {/* Active state gradient overlay */}
          {!isLoading && isFormValid() && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;