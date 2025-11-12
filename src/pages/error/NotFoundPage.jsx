// Spectacular Animated 404 Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IsacaLogo } from '../../assets';

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Error boundary for development
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Animation triggers
  useEffect(() => {
    try {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Animation setup error:', error);
      setHasError(true);
    }
  }, []);

  // Floating particles data
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  // Debug: Add console log to check if component is rendering
  console.log('NotFoundPage component is rendering');

  // Fallback for development/debugging
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="mb-4">Something went wrong with the animations</p>
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/15 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

        {/* Subtle Floating Particles */}
        {particles.slice(0, 20).map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${Math.min(particle.size, 3)}px`,
              height: `${Math.min(particle.size, 3)}px`,
              animationDuration: `${particle.duration + 5}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>



      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`text-center max-w-4xl w-full transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* ISACA Logo - Simple */}
          <div className={`mb-8 transform transition-all duration-500 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`}>
            <img 
              src={IsacaLogo} 
              alt="ISACA Logo" 
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>

          {/* 404 Number - Clean Design */}
          <div className={`mb-12 transform transition-all duration-700 delay-300 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-90 rotate-1'
          }`}>
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className={`mb-12 transform transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-xl md:text-2xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-lg text-blue-200/70 max-w-xl mx-auto mt-4 leading-relaxed">
              Let's get you back on track with ISACA Silicon Valley.
            </p>
          </div>

          {/* Navigation Suggestions */}
          <div className={`mb-12 transform transition-all duration-700 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto">
              <h3 className="text-white/90 font-medium mb-6 text-center text-lg">Quick Navigation</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Home', path: '/', icon: '🏠', desc: 'Return to homepage' },
                  { name: 'Events', path: '/events', icon: '📅', desc: 'Browse upcoming events' },
                  { name: 'Login', path: '/login', icon: '🔐', desc: 'Access your account' },
                ].map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/10 hover:border-white/20 hover:scale-105"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                  >
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="text-white font-medium mb-1 group-hover:text-blue-200 transition-colors duration-300">{item.name}</span>
                    <span className="text-blue-200/60 text-sm text-center">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-700 delay-900 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            {/* Go Home Button */}
            <Link
              to="/"
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Go Back Button */}
            <button
              onClick={() => window.history.back()}
              className="group px-10 py-4 border-2 border-white/20 text-white font-semibold text-lg rounded-xl hover:border-white/40 hover:bg-white/5 transform transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Go Back
              </span>
            </button>
          </div>


        </div>
      </div>


    </div>
  );
};

export default NotFoundPage;