import React, { useState } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import MessageAlert from '../ui/MessageAlert';
import { handlePasswordReset } from '../../utils/authUtils';

const ForgotPassword = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (email) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await handlePasswordReset(email);
      if (result.success) {
        setMessage({
          text: 'Password reset link has been sent to your email address.',
          type: 'success'
        });
      } else {
        setMessage({
          text: result.message || 'Failed to send reset link. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'An unexpected error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3c0-.265.105-.52.293-.707L10.586 9.293A6 6 0 0117 3a6.002 6.002 0 010 12z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your registered email address and we'll send you a reset link.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-12 px-8 shadow-2xl rounded-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          {/* Message Alert */}
          {message.text && (
            <div className="mb-6">
              <MessageAlert message={message.text} type={message.type} />
            </div>
          )}

          {/* Form */}
          <ForgotPasswordForm onSubmit={onSubmit} isLoading={isLoading} />

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remembered your password?{' '}
              <button 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:underline"
                onClick={() => {
                  // Add navigation to login page here
                  console.log('Navigate to login');
                }}
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <button className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;