import React from 'react';
import { IsacaFavicon, IsacaLogo } from '../../assets';

/**
 * Favicon Test Component
 * 
 * Demonstrates favicon integration and provides testing utilities
 */
const FaviconTest = () => {
  const checkFavicon = () => {
    const favicon = document.querySelector('link[rel="icon"]');
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    const shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
    
    console.log('Favicon elements found:', {
      favicon: favicon?.href,
      appleTouchIcon: appleTouchIcon?.href,
      shortcutIcon: shortcutIcon?.href
    });
    
    // Show toast notification
    alert(`Favicon check complete! Check console for details.\n\nFavicon URL: ${favicon?.href || 'Not found'}`);
  };

  const testFaviconLoading = () => {
    const img = new Image();
    img.onload = () => {
      alert('✅ Favicon loaded successfully!');
    };
    img.onerror = () => {
      alert('❌ Favicon failed to load!');
    };
    img.src = '/favicon.png';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Favicon Integration Test
        </h1>

        {/* Favicon Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Favicon Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Browser Tab Icon
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                The icon that appears in browser tabs and bookmarks
              </p>
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <img 
                  src={IsacaFavicon} 
                  alt="ISACA Favicon" 
                  className="w-8 h-8"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                App Icon (PWA)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Icon used when app is installed on mobile devices
              </p>
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <img 
                  src={IsacaFavicon} 
                  alt="ISACA App Icon" 
                  className="w-12 h-12 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Size Comparison */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Icon Size Comparison
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded border mb-2">
                <img 
                  src={IsacaFavicon} 
                  alt="16x16" 
                  className="w-4 h-4 mx-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">16x16 px</p>
              <p className="text-xs text-gray-500">Browser tab</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded border mb-2">
                <img 
                  src={IsacaFavicon} 
                  alt="32x32" 
                  className="w-8 h-8 mx-auto"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">32x32 px</p>
              <p className="text-xs text-gray-500">Bookmarks</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded border mb-2">
                <img 
                  src={IsacaFavicon} 
                  alt="64x64" 
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">64x64 px</p>
              <p className="text-xs text-gray-500">Desktop</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded border mb-2">
                <img 
                  src={IsacaFavicon} 
                  alt="128x128" 
                  className="w-32 h-32 mx-auto"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">128x128 px</p>
              <p className="text-xs text-gray-500">App stores</p>
            </div>
          </div>
        </div>

        {/* Logo vs Favicon */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Logo vs Favicon Comparison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Main Logo (for headers, pages)
              </h3>
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <img 
                  src={IsacaLogo} 
                  alt="ISACA Main Logo" 
                  className="h-16 w-auto mx-auto"
                />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Favicon (for browser tabs, PWA)
              </h3>
              <div className="bg-white dark:bg-gray-700 p-4 rounded border">
                <img 
                  src={IsacaFavicon} 
                  alt="ISACA Favicon" 
                  className="h-16 w-auto mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Tools */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Favicon Test Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={checkFavicon}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check Favicon Elements
            </button>
            
            <button
              onClick={testFaviconLoading}
              className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Test Favicon Loading
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Testing Instructions
          </h2>
          
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">1</span>
              <p>Look at your browser tab - you should see the ISACA favicon next to the page title</p>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">2</span>
              <p>Bookmark this page - the favicon should appear in your bookmarks</p>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">3</span>
              <p>On mobile: Try "Add to Home Screen" - the favicon will be used as the app icon</p>
            </div>
            
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">4</span>
              <p>Use the test buttons above to verify favicon integration</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Technical Implementation
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTML Head Tags
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
<link rel="shortcut icon" href="/favicon.png" />
<link rel="icon" href="/favicon.png" />`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                PWA Manifest Icons
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
{`icons: [
  { src: '/favicon.png', sizes: '192x192', type: 'image/png' },
  { src: '/favicon.png', sizes: '512x512', type: 'image/png' },
  { src: '/favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
]`}
              </pre>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Favicon Successfully Integrated!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaviconTest;