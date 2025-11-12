// Simple Test 404 Page
import React from 'react';
import { Link } from 'react-router-dom';

const SimpleNotFoundTest = () => {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="mb-8">This is a simple test to make sure the 404 page is working</p>
        <Link 
          to="/" 
          className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default SimpleNotFoundTest;