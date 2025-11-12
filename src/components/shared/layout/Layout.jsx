// Main layout component
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                ISACA Silicon Valley
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                Events
              </Link>
              <Link to="/members" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                Members
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 mb-2">
              © 2025 ISACA Silicon Valley Chapter. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Developed with ❤️ by{' '}
              <span className="text-primary-400 font-medium hover:text-primary-300 transition-colors cursor-pointer">
                Sachin
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;