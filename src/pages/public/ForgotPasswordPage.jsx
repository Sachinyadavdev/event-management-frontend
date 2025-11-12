import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IsacaLogo } from '../../assets';
import { handlePasswordResetRequest } from '../../utils/authUtils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    
    // Clear error and message when user starts typing
    if (errors.email && value.trim()) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    const error = validateEmail(email);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(email);
    
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    setErrors({});
    
    try {
      const result = await handlePasswordResetRequest(email.trim());
      if (result.success) {
        setMessage({
          text: 'Password reset link has been sent to your email address. Please check your inbox.',
          type: 'success'
        });
        setEmail(''); // Clear form on success
        setTouched({});
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
      setLoading(false);
    }
  };

  const isEmailInvalid = touched.email && errors.email;

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
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3c0-.265.105-.52.293-.707L10.586 9.293A6 6 0 0117 3a6.002 6.002 0 010 12z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Forgot your password?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto">
              Enter your registered email address and we'll send you a reset link.
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className={`transform transition-all duration-500 delay-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 transition-colors duration-200 ${
                        isEmailInvalid ? 'text-red-400' : email && !errors.email ? 'text-green-400' : 'text-blue-300'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      onFocus={() => setFocusedField('email')}
                      disabled={loading}
                      placeholder="Enter your email"
                      className={`
                        w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white 
                        placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-offset-2
                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        ${focusedField === 'email' ? 'bg-white/20 shadow-lg transform scale-105' : ''}
                        ${isEmailInvalid 
                          ? 'border-red-400/50 focus:ring-red-500 focus:border-red-400' 
                          : email && !errors.email
                          ? 'border-green-400/50 focus:ring-green-500 focus:border-green-400'
                          : 'border-white/20 focus:ring-blue-400 focus:border-transparent'
                        }
                      `}
                    />
                  </div>
                  
                  {/* Error Message */}
                  <div className={`mt-2 min-h-[20px] transition-all duration-200 ${isEmailInvalid ? 'opacity-100' : 'opacity-0'}`}>
                    {isEmailInvalid && (
                      <p className="text-sm text-red-300 flex items-center animate-fade-in">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className={`transform transition-all duration-500 delay-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !!errors.email}
                    className={`
                      group relative w-full flex justify-center py-4 px-4 border border-transparent
                      text-sm font-bold rounded-xl text-white transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]
                      ${loading || !email.trim() || !!errors.email
                        ? 'bg-white/20 cursor-not-allowed opacity-60 border border-white/10'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <svg className="h-5 w-5 text-white group-hover:animate-pulse transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </span>
                    <span className="relative z-10">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </span>
                    
                    {/* Button glow effect */}
                    {!loading && !errors.email && email.trim() && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300"></span>
                    )}
                    
                    {/* Active state gradient overlay */}
                    {!loading && !errors.email && email.trim() && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    )}
                  </button>
                </div>

                {/* Back to Login Link */}
                <div className={`text-center transform transition-all duration-500 delay-900 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <p className="text-sm text-blue-200">
                    Remembered your password?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-300 underline decoration-2 underline-offset-2 decoration-blue-300/50 hover:decoration-blue-200"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Back to Homepage */}
                <div className={`text-center transform transition-all duration-500 delay-1100 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;