import React from 'react';
import { IsacaLogo } from '../../assets';
import { useToast } from '../../hooks/useToast';

/**
 * ISACA Logo Showcase Component
 * 
 * Demonstrates the ISACA logo integration across different contexts
 */
const IsacaLogoShowcase = () => {
  const toast = useToast();

  const showLogoToast = () => {
    toast.success('ISACA Logo Loaded!', {
      message: 'The logo is successfully integrated into the application.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <img src={IsacaLogo} alt="ISACA" className="h-32 w-auto mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ISACA Silicon Valley Chapter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional organization focused on cybersecurity, risk management, and governance
          </p>
        </div>

        {/* Logo Usage Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Header Example */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-4">
              <h3 className="text-lg font-semibold">Navigation Header</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center space-x-3">
                  <img src={IsacaLogo} alt="ISACA" className="h-8 w-auto" />
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    Silicon Valley
                  </span>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">Home</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">Events</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">About</a>
                </nav>
              </div>
            </div>
          </div>

          {/* Card Example */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-4">
              <h3 className="text-lg font-semibold">Event Card</h3>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <img src={IsacaLogo} alt="ISACA" className="h-10 w-auto mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Cybersecurity Workshop</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hosted by ISACA Silicon Valley</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Join us for an intensive workshop on modern cybersecurity practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Variations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Logo Size Variations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-2">
                <img src={IsacaLogo} alt="ISACA Small" className="h-6 w-auto mx-auto" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Small (h-6)</p>
              <p className="text-xs text-gray-500">Navigation bars</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-2">
                <img src={IsacaLogo} alt="ISACA Medium" className="h-12 w-auto mx-auto" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Medium (h-12)</p>
              <p className="text-xs text-gray-500">Cards, forms</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-2">
                <img src={IsacaLogo} alt="ISACA Large" className="h-20 w-auto mx-auto" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Large (h-20)</p>
              <p className="text-xs text-gray-500">Hero sections</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-2">
                <img src={IsacaLogo} alt="ISACA Extra Large" className="h-28 w-auto mx-auto" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">X-Large (h-28)</p>
              <p className="text-xs text-gray-500">Landing pages</p>
            </div>
          </div>
        </div>

        {/* Background Variations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-4">Light Background</h3>
            <img src={IsacaLogo} alt="ISACA on Light" className="h-16 w-auto mx-auto" />
            <p className="text-sm text-gray-600 mt-2">Default usage</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h3 className="font-semibold text-white mb-4">Dark Background</h3>
            <img src={IsacaLogo} alt="ISACA on Dark" className="h-16 w-auto mx-auto" />
            <p className="text-sm text-gray-300 mt-2">Dark mode usage</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-center">
            <h3 className="font-semibold text-white mb-4">Colored Background</h3>
            <img src={IsacaLogo} alt="ISACA on Colored" className="h-16 w-auto mx-auto" />
            <p className="text-sm text-blue-100 mt-2">Special sections</p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the logo to see it in action with a toast notification!
          </p>
          
          <button
            onClick={showLogoToast}
            className="inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            <img src={IsacaLogo} alt="ISACA" className="h-8 w-auto" />
            <span className="font-semibold">Click to Test Toast</span>
          </button>
        </div>

        {/* Integration Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">ISACA Logo Successfully Integrated!</span>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Header</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Login</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Home</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsacaLogoShowcase;