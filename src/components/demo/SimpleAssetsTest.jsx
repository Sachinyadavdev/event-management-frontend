import React from 'react';
import { IsacaLogo, MenuIcon, ImagePlaceholder } from '../../assets';

/**
 * Simple Assets Test - Showcases the ISACA logo and other assets
 */
const SimpleAssetsTest = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          ISACA Logo Integration Test
        </h1>
        
        {/* Logo Showcase */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
            ISACA Logo at Different Sizes
          </h2>
          
          <div className="space-y-6">
            {/* Small Logo */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Small (h-8)</p>
              <img src={IsacaLogo} alt="ISACA Logo Small" className="h-8 w-auto mx-auto" />
            </div>
            
            {/* Medium Logo */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medium (h-16)</p>
              <img src={IsacaLogo} alt="ISACA Logo Medium" className="h-16 w-auto mx-auto" />
            </div>
            
            {/* Large Logo */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Large (h-24)</p>
              <img src={IsacaLogo} alt="ISACA Logo Large" className="h-24 w-auto mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Logo on Different Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Light Background</h3>
            <div className="flex justify-center">
              <img src={IsacaLogo} alt="ISACA Logo on Light" className="h-16 w-auto" />
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4 text-center">Dark Background</h3>
            <div className="flex justify-center">
              <img src={IsacaLogo} alt="ISACA Logo on Dark" className="h-16 w-auto" />
            </div>
          </div>
        </div>
        
        {/* Other Assets */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Other Assets</h3>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <img src={MenuIcon} alt="Menu Icon" className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Menu Icon</p>
            </div>
            <div className="text-center">
              <img src={ImagePlaceholder} alt="Placeholder" className="w-16 h-12 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Placeholder</p>
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Assets System Working Correctly!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAssetsTest;