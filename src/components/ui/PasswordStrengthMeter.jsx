import React from 'react';

const PasswordStrengthMeter = ({ password, className = '' }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, level: 'none', text: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calculate score based on criteria
    if (checks.length) score += 2;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.symbols) score += 2;
    
    // Bonus points for longer passwords
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Determine strength level
    let level, text, color;
    if (score === 0) {
      level = 'none';
      text = '';
      color = 'gray';
    } else if (score < 3) {
      level = 'weak';
      text = 'Weak';
      color = 'red';
    } else if (score < 5) {
      level = 'fair';
      text = 'Fair';
      color = 'yellow';
    } else if (score < 7) {
      level = 'good';
      text = 'Good';
      color = 'blue';
    } else {
      level = 'strong';
      text = 'Strong';
      color = 'green';
    }
    
    return { score, level, text, color, checks };
  };

  const strength = calculateStrength(password);
  
  const getStrengthWidth = () => {
    const maxScore = 9; // Maximum possible score
    return Math.min((strength.score / maxScore) * 100, 100);
  };

  const getColorClasses = () => {
    switch (strength.color) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getTextColorClasses = () => {
    switch (strength.color) {
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-100">Password Strength</span>
          <span className={`text-sm font-semibold ${getTextColorClasses()}`}>
            {strength.text}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 backdrop-blur-sm">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getColorClasses()}`}
            style={{ width: `${getStrengthWidth()}%` }}
          ></div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <div className="text-xs text-blue-200 font-medium">Requirements:</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${
            strength.checks?.length ? 'text-green-400' : 'text-blue-200/60'
          }`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {strength.checks?.length ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              )}
            </svg>
            <span>At least 8 characters</span>
          </div>
          
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${
            strength.checks?.lowercase ? 'text-green-400' : 'text-blue-200/60'
          }`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {strength.checks?.lowercase ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              )}
            </svg>
            <span>Lowercase letter (a-z)</span>
          </div>
          
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${
            strength.checks?.uppercase ? 'text-green-400' : 'text-blue-200/60'
          }`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {strength.checks?.uppercase ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              )}
            </svg>
            <span>Uppercase letter (A-Z)</span>
          </div>
          
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${
            strength.checks?.numbers ? 'text-green-400' : 'text-blue-200/60'
          }`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {strength.checks?.numbers ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              )}
            </svg>
            <span>Number (0-9)</span>
          </div>
          
          <div className={`flex items-center space-x-2 transition-colors duration-300 ${
            strength.checks?.symbols ? 'text-green-400' : 'text-blue-200/60'
          }`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {strength.checks?.symbols ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              )}
            </svg>
            <span>Special character (!@#$...)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;