// Spectacular Animated Unauthorized Page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IsacaLogo } from '../../assets';

const UnauthorizedPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const navigate = useNavigate();

  // Animation triggers
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Pulse effect for the lock icon
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 600);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-orange-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-yellow-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

        {/* Warning stripes pattern */}
        <div className="absolute inset-0 bg-warning-stripes opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`text-center max-w-2xl transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* ISACA Logo - Simple */}
          <div className={`mb-8 transform transition-all duration-500 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'
          }`}>
            <img 
              src={IsacaLogo} 
              alt="ISACA Logo" 
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>

          {/* Lock Icon with Pulse Animation */}
          <div className={`mb-8 transform transition-all duration-700 delay-300 ${
            isVisible ? 'scale-100' : 'scale-0'
          }`}>
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-red-500/20 backdrop-blur-lg rounded-full border border-red-400/30 ${
              pulseActive ? 'animate-pulse scale-110' : ''
            } transition-all duration-600`}>
              <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Error Code */}
          <div className={`mb-6 transform transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              403
            </h1>
          </div>

          {/* Error Message */}
          <div className={`mb-8 transform transition-all duration-700 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Access Denied
            </h2>
            <p className="text-lg md:text-xl text-orange-100 leading-relaxed">
              You don't have permission to access this area. This section is restricted to authorized personnel only.
            </p>
          </div>

          {/* Security Message */}
          <div className={`mb-10 transform transition-all duration-700 delay-900 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="bg-red-500/10 backdrop-blur-lg rounded-xl border border-red-400/30 p-6 max-w-lg mx-auto">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-red-200 font-semibold">Security Notice</h3>
              </div>
              <p className="text-red-100 text-sm leading-relaxed">
                This attempt has been logged for security purposes. If you believe you should have access to this content, 
                please contact your administrator or sign in with appropriate credentials.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-700 delay-1100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            {/* Sign In Button */}
            <Link
              to="/login"
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Go Home Button */}
            <Link
              to="/"
              className="group px-8 py-4 border-2 border-orange-400/30 text-orange-100 font-bold rounded-xl hover:border-orange-400/60 hover:bg-orange-500/10 transform transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </span>
            </Link>

            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="group px-8 py-4 border-2 border-white/20 text-white font-bold rounded-xl hover:border-white/40 hover:bg-white/5 transform transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Go Back
              </span>
            </button>
          </div>

          {/* Help Text */}
          <div className={`mt-12 transform transition-all duration-700 delay-1300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <p className="text-sm text-orange-200/60">
              Need help? Contact support at{' '}
              <a href="mailto:support@isaca-sv.org" className="text-orange-300 hover:text-orange-200 underline transition-colors duration-300">
                support@isaca-sv.org
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <div className="absolute bottom-8 right-8">
        <a
          href="mailto:support@isaca-sv.org"
          className="group relative w-14 h-14 bg-red-500/20 backdrop-blur-lg rounded-full border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-red-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;