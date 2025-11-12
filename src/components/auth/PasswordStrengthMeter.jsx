import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password, onStrengthChange }) => {
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Check password criteria
  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setCriteria(newCriteria);

    // Calculate strength score
    const score = Object.values(newCriteria).filter(Boolean).length;
    setStrength(score);

    // Notify parent of strength change
    if (onStrengthChange) {
      onStrengthChange(score, newCriteria);
    }
  }, [password, onStrengthChange]);

  const getStrengthLabel = () => {
    if (strength === 0) return 'Enter password';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = () => {
    if (strength === 0) return 'text-gray-500';
    if (strength <= 2) return 'text-red-600';
    if (strength <= 3) return 'text-yellow-600';
    if (strength <= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  const criteriaList = [
    { key: 'length', label: 'At least 8 characters', icon: '8+' },
    { key: 'lowercase', label: 'One lowercase letter', icon: 'a' },
    { key: 'uppercase', label: 'One uppercase letter', icon: 'A' },
    { key: 'number', label: 'One number', icon: '1' },
    { key: 'special', label: 'One special character', icon: '@' }
  ];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </span>
          <span className={`text-sm font-semibold ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${getStrengthColor()} relative`}
            style={{ width: `${(strength / 5) * 100}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {criteriaList.map((criterion, index) => (
          <div
            key={criterion.key}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 transform ${
              criteria[criterion.key]
                ? 'bg-green-50 dark:bg-green-900/20 scale-100'
                : 'bg-gray-50 dark:bg-gray-800 scale-95'
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Animated Check/Cross Icon */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              criteria[criterion.key]
                ? 'bg-green-500 text-white scale-110'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
            }`}>
              {criteria[criterion.key] ? (
                <svg 
                  className="w-3 h-3 animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ animationDuration: '0.6s' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{criterion.icon}</span>
              )}
            </div>
            
            {/* Criterion Label */}
            <span className={`text-sm transition-colors duration-300 ${
              criteria[criterion.key]
                ? 'text-green-700 dark:text-green-300 font-medium'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>

      {/* Password Tips */}
      {strength < 5 && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 animate-fadeIn">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Security Tip
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                {strength <= 2 && "Consider using a longer password with mixed characters."}
                {strength === 3 && "Add numbers or special characters to improve security."}
                {strength === 4 && "Add one more character type for maximum security."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {strength === 5 && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Excellent! Your password is strong and secure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;