import React, { useState } from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import MessageAlert from '../ui/MessageAlert';
import { handlePasswordReset } from '../../utils/authUtils';

const ResetPassword = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await handlePasswordReset(formData);
      if (result.success) {
        setResetSuccess(true);
        setMessage({
          text: 'Password reset successful! Redirecting to login...',
          type: 'success'
        });
        
        // Simulate redirect after 3 seconds
        setTimeout(() => {
          // In a real app, you would navigate to login page here
          console.log('Redirecting to login page...');
        }, 3000);
      } else {
        setMessage({
          text: result.message || 'Failed to reset password. Please try again.',
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
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter the verification code sent to your email and set a new password.
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
          {!resetSuccess && (
            <ResetPasswordForm onSubmit={onSubmit} isLoading={isLoading} />
          )}

          {/* Success State */}
          {resetSuccess && (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Password Reset Complete!</h3>
              <p className="text-gray-600">You will be redirected to the login page shortly.</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          {!resetSuccess && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 focus:outline-none focus:underline"
                  onClick={() => {
                    // Add navigation to login page here
                    console.log('Navigate to login');
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
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

export default ResetPassword;