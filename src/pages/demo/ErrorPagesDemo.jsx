// Demo component to easily test error pages
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPagesDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎭 Error Pages Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Experience our spectacular animated error pages
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 404 Page Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">🚀</span>
                404 - Not Found
              </h2>
              <p className="text-indigo-100 mt-2">
                Interactive animated page with glitch effects, floating particles, and stunning visuals
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Animated gradient background with floating particles
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Interactive glitch effect on click
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Mouse-tracking cursor glow effect
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Staggered animations and smooth transitions
                </div>
              </div>
              <div className="space-y-3">
                <Link
                  to="/this-page-does-not-exist"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
                >
                  <span>Experience 404 Page</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/test-simple-404"
                  className="w-full bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group text-sm"
                >
                  <span>Test Simple Version</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 403 Unauthorized Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">🔒</span>
                403 - Unauthorized
              </h2>
              <p className="text-red-100 mt-2">
                Security-themed page with warning animations and professional security messaging
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Warning-themed gradient with security colors
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Animated lock icon with pulse effects
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Security notice with professional messaging
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                  Clear action buttons for appropriate next steps
                </div>
              </div>
              <Link
                to="/unauthorized"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center group"
              >
                <span>Experience Unauthorized Page</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ✨ Spectacular Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Smooth Animations</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Staggered entrance animations with perfect timing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2M7 4h10" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Interactive Effects</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Mouse tracking, click effects, and dynamic responses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Modern Design</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Glass morphism, gradients, and contemporary aesthetics</p>
            </div>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPagesDemo;