// Mock authentication utilities for development/testing purposes

/**
 * Simulates a password reset request API call (for forgot password)
 * @param {string} email - The email address to send reset link to
 * @returns {Promise<Object>} - Returns success/error response
 */
export const handlePasswordResetRequest = async (email) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Simulate different response scenarios based on email
  const scenarios = [
    {
      // Success scenario (70% chance)
      condition: () => Math.random() < 0.7,
      response: {
        success: true,
        message: 'Password reset link has been sent to your email address.'
      }
    },
    {
      // User not found scenario (20% chance)
      condition: () => Math.random() < 0.2,
      response: {
        success: false,
        message: 'No account found with this email address.'
      }
    },
    {
      // Server error scenario (10% chance)
      condition: () => true, // Default fallback
      response: {
        success: false,
        message: 'Server temporarily unavailable. Please try again later.'
      }
    }
  ];

  // Find the first matching scenario
  const scenario = scenarios.find(s => s.condition());
  
  // Add some additional validation for demo purposes
  if (email.includes('invalid')) {
    return {
      success: false,
      message: 'Invalid email address format.'
    };
  }
  
  if (email.includes('blocked')) {
    return {
      success: false,
      message: 'This account has been temporarily blocked.'
    };
  }

  return scenario.response;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Mock function to check if email exists in system
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if email exists
 */
export const checkEmailExists = async (email) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, assume certain emails exist
  const existingEmails = [
    'user@example.com',
    'admin@company.com',
    'test@domain.com'
  ];
  
  return existingEmails.includes(email.toLowerCase()) || Math.random() < 0.8;
};

/**
 * Simulates a password reset confirmation API call (for reset password form)
 * @param {Object} resetData - The reset form data
 * @param {string} resetData.email - Email address
 * @param {string} resetData.verificationCode - Verification code from email
 * @param {string} resetData.newPassword - New password
 * @param {string} resetData.confirmPassword - Password confirmation
 * @returns {Promise<Object>} - Returns success/error response
 */
export const handlePasswordReset = async (resetData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1500));
  
  const { email, verificationCode, newPassword, confirmPassword } = resetData;
  
  // Simulate different response scenarios
  const scenarios = [
    {
      // Success scenario (80% chance)
      condition: () => Math.random() < 0.8,
      response: {
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.'
      }
    },
    {
      // Invalid verification code (15% chance)
      condition: () => Math.random() < 0.15,
      response: {
        success: false,
        message: 'Invalid or expired verification code. Please request a new password reset link.'
      }
    },
    {
      // Server error scenario (5% chance)
      condition: () => true, // Default fallback
      response: {
        success: false,
        message: 'Server temporarily unavailable. Please try again later.'
      }
    }
  ];

  // Validate inputs
  if (!email || !verificationCode || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: 'All fields are required.'
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match.'
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long.'
    };
  }

  // Special test cases for demo
  if (verificationCode === 'invalid') {
    return {
      success: false,
      message: 'Invalid verification code.'
    };
  }

  if (verificationCode === 'expired') {
    return {
      success: false,
      message: 'Verification code has expired. Please request a new reset link.'
    };
  }

  if (email.includes('blocked')) {
    return {
      success: false,
      message: 'This account has been temporarily blocked.'
    };
  }

  // Find the first matching scenario
  const scenario = scenarios.find(s => s.condition());
  return scenario.response;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with strength score and requirements
 */
export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[^A-Za-z0-9]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;
  
  let strength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    score,
    strength,
    requirements,
    isValid: score >= 4
  };
};