import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import MessageAlert from '../../components/ui/MessageAlert';
import { handlePasswordReset } from '../../utils/authUtils';

const ResetPasswordPage = () => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get email and token from URL params if provided
  const emailFromUrl = searchParams.get('email') || '';
  const tokenFromUrl = searchParams.get('token') || '';

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Add token from URL if available
      const resetData = {
        ...formData,
        token: tokenFromUrl
      };

      const result = await handlePasswordReset(resetData);
      if (result.success) {
        setResetSuccess(true);
        setMessage({
          text: 'Password reset successful! Redirecting to login...',
          type: 'success'
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { replace: true });
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto">
              Enter the verification code sent to your email and set a new password.
            </p>
          </div>

          {/* Main Form Card */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
              
              {/* Success/Error Message */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 border-green-400/30 text-green-200' 
                    : 'bg-red-500/20 border-red-400/30 text-red-200'
                } ${message.type === 'error' ? 'animate-shake' : 'animate-fade-in'}`}>
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {message.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <p className="text-sm font-medium leading-5">{message.text}</p>
                  </div>
                </div>
              )}

              {/* Form or Success State */}
              {!resetSuccess ? (
                <ResetPasswordForm 
                  onSubmit={onSubmit} 
                  isLoading={isLoading}
                  initialEmail={emailFromUrl}
                />
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="mx-auto h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-400/30">
                    <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Password Reset Complete!</h3>
                  <p className="text-blue-100">You will be redirected to the login page shortly.</p>
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              {!resetSuccess && (
                <div className="mt-8 space-y-4 text-center">
                  <p className="text-sm text-blue-200">
                    Remember your password?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-300 underline decoration-2 underline-offset-2 decoration-blue-300/50 hover:decoration-blue-200"
                    >
                      Sign in
                    </Link>
                  </p>
                  
                  <Link
                    to="/"
                    className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm font-medium transition-all duration-300 group"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to homepage
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;