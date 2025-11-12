import React, { useState, useEffect, useRef } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonRef = useRef(null);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrolled / maxHeight) * 100;
    
    setScrollProgress(progress);
    setIsVisible(scrolled > 300);
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 group">
          {/* Simple glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

          {/* Progress ring */}
          <div className="relative">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-gray-300 dark:text-gray-600"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Main button */}
            <button
              ref={buttonRef}
              onClick={scrollToTop}
              className={`absolute inset-2 bg-gradient-to-br from-blue-600 to-purple-600 
                         text-white rounded-full shadow-lg transform transition-all duration-300 
                         hover:shadow-xl hover:scale-110 active:scale-95 
                         ${isScrolling ? 'animate-bounce' : ''}`}
              aria-label="Back to top"
            >
              {/* Arrow icon */}
              <div className="flex items-center justify-center w-full h-full">
                <svg 
                  className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-y-0.5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 10l7-7m0 0l7 7m-7-7v18" 
                  />
                </svg>
              </div>
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default BackToTop;