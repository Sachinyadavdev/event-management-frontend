import React, { useState, useEffect } from 'react';
import { useToast, TOAST_TYPES } from '../../hooks/useToast';

// ============================================================================
// TOAST ICONS
// ============================================================================
const ToastIcons = {
  [TOAST_TYPES.SUCCESS]: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.ERROR]: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.WARNING]: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.INFO]: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.LOADING]: (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
};

// ============================================================================
// TOAST STYLES
// ============================================================================
const getToastStyles = (type) => {
  const baseStyles = "flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out transform";
  
  const typeStyles = {
    [TOAST_TYPES.SUCCESS]: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    [TOAST_TYPES.ERROR]: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    [TOAST_TYPES.WARNING]: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    [TOAST_TYPES.INFO]: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    [TOAST_TYPES.LOADING]: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200",
  };
  
  return `${baseStyles} ${typeStyles[type]}`;
};

const getIconStyles = (type) => {
  const iconStyles = {
    [TOAST_TYPES.SUCCESS]: "text-green-500 dark:text-green-400",
    [TOAST_TYPES.ERROR]: "text-red-500 dark:text-red-400",
    [TOAST_TYPES.WARNING]: "text-yellow-500 dark:text-yellow-400",
    [TOAST_TYPES.INFO]: "text-blue-500 dark:text-blue-400",
    [TOAST_TYPES.LOADING]: "text-gray-500 dark:text-gray-400",
  };
  
  return iconStyles[type];
};

// ============================================================================
// INDIVIDUAL TOAST COMPONENT
// ============================================================================
const Toast = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation before removing
    setTimeout(() => removeToast(toast.id), 300);
  };

  const handleMouseEnter = () => {
    if (toast.pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (toast.pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div
      className={`
        ${getToastStyles(toast.type)}
        max-w-sm w-full
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isPaused ? 'scale-105' : 'scale-100'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${getIconStyles(toast.type)}`}>
        {ToastIcons[toast.type]}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold">
            {toast.title}
          </p>
        )}
        
        {toast.message && (
          <p className={`text-sm ${toast.title ? 'mt-1' : ''}`}>
            {toast.message}
          </p>
        )}

        {/* Action Button */}
        {toast.action && (
          <div className="mt-3">
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      {toast.dismissible && (
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-current opacity-50 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded p-1"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Progress Bar (for timed toasts) */}
      {toast.duration > 0 && toast.type !== TOAST_TYPES.LOADING && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-current opacity-60 animate-shrink-width"
            style={{ 
              animationDuration: `${toast.duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;