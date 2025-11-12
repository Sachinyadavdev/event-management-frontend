import React, { useState } from 'react';
import { useToast, TOAST_POSITIONS } from '../../hooks/useToast';

/**
 * ToastDemo Component
 * 
 * Demonstrates all features of the toast notification system
 */
const ToastDemo = () => {
  const toast = useToast();
  const [loadingToastId, setLoadingToastId] = useState(null);
  const [promiseDemo, setPromiseDemo] = useState(false);

  // Demo data
  const positions = Object.values(TOAST_POSITIONS);
  const [selectedPosition, setSelectedPosition] = useState(toast.position);

  // Basic toast examples
  const showSuccessToast = () => {
    toast.success('Operation completed successfully!', {
      message: 'Your changes have been saved.',
    });
  };

  const showErrorToast = () => {
    toast.error('Something went wrong!', {
      message: 'Please try again or contact support if the problem persists.',
    });
  };

  const showWarningToast = () => {
    toast.warning('Action required', {
      message: 'Please review your settings before continuing.',
    });
  };

  const showInfoToast = () => {
    toast.info('New feature available', {
      message: 'Check out our latest updates in the dashboard.',
    });
  };

  const showLoadingToast = () => {
    const id = toast.loading('Processing your request...', {
      message: 'This may take a few moments.',
    });
    setLoadingToastId(id);
  };

  const dismissLoadingToast = () => {
    if (loadingToastId) {
      toast.removeToast(loadingToastId);
      setLoadingToastId(null);
    }
  };

  // Advanced toast examples
  const showCustomToast = () => {
    toast.addToast({
      type: 'success',
      title: 'Custom Toast',
      message: 'This toast has custom settings.',
      duration: 8000,
      action: {
        label: 'View Details',
        onClick: () => alert('Action clicked!'),
      },
    });
  };

  const showPersistentToast = () => {
    toast.addToast({
      type: 'info',
      title: 'Persistent Toast',
      message: 'This toast will stay until manually dismissed.',
      duration: 0, // Persistent
      dismissible: true,
    });
  };

  const showNonDismissibleToast = () => {
    const id = toast.addToast({
      type: 'warning',
      title: 'System Maintenance',
      message: 'Scheduled maintenance in progress. Please save your work.',
      duration: 0,
      dismissible: false,
    });

    // Auto-dismiss after 5 seconds for demo
    setTimeout(() => {
      toast.removeToast(id);
    }, 5000);
  };

  // Promise demo
  const showPromiseDemo = async () => {
    setPromiseDemo(true);
    
    const simulateAsync = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.5;
          if (success) {
            resolve('Data loaded successfully!');
          } else {
            reject(new Error('Failed to load data'));
          }
        }, 3000);
      });
    };

    try {
      await toast.promise(
        simulateAsync(),
        {
          loading: 'Loading data...',
          success: 'Data loaded successfully!',
          error: 'Failed to load data',
        }
      );
    } catch (error) {
      console.error('Promise demo failed:', error);
    } finally {
      setPromiseDemo(false);
    }
  };

  const changePosition = (newPosition) => {
    toast.setPosition(newPosition);
    setSelectedPosition(newPosition);
    toast.info('Position changed', {
      message: `Toasts will now appear at ${newPosition.replace('-', ' ')}`,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Toast Notification System Demo
      </h1>

      {/* Basic Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Basic Toast Types
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={showSuccessToast}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Success Toast
          </button>
          <button
            onClick={showErrorToast}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Error Toast
          </button>
          <button
            onClick={showWarningToast}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            Warning Toast
          </button>
          <button
            onClick={showInfoToast}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Info Toast
          </button>
        </div>
      </section>

      {/* Loading Toasts */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Loading Toast
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={showLoadingToast}
            disabled={loadingToastId}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            Show Loading
          </button>
          <button
            onClick={dismissLoadingToast}
            disabled={!loadingToastId}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            Dismiss Loading
          </button>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Advanced Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={showCustomToast}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Custom Toast with Action
          </button>
          <button
            onClick={showPersistentToast}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
          >
            Persistent Toast
          </button>
          <button
            onClick={showNonDismissibleToast}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Non-Dismissible Toast
          </button>
        </div>
      </section>

      {/* Promise Demo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Promise-based Toast
        </h2>
        <button
          onClick={showPromiseDemo}
          disabled={promiseDemo}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-lg transition-colors"
        >
          {promiseDemo ? 'Running Promise Demo...' : 'Promise Demo (50% success rate)'}
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          This will show a loading toast, then either success or error after 3 seconds.
        </p>
      </section>

      {/* Position Controls */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Toast Position
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => changePosition(position)}
              className={`
                px-3 py-2 text-sm rounded-lg transition-colors
                ${selectedPosition === position
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </section>

      {/* Control Actions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Control Actions
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={toast.clearAllToasts}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear All Toasts
          </button>
          <button
            onClick={() => {
              // Show multiple toasts for testing
              toast.success('First toast');
              setTimeout(() => toast.info('Second toast'), 500);
              setTimeout(() => toast.warning('Third toast'), 1000);
              setTimeout(() => toast.error('Fourth toast'), 1500);
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Show Multiple Toasts
          </button>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Usage Examples
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
{`// Basic usage
const toast = useToast();

// Simple success toast
toast.success('Operation successful!');

// Error with custom message
toast.error('Failed to save', {
  message: 'Please check your internet connection.'
});

// Custom toast with action
toast.addToast({
  type: 'info',
  title: 'Update Available',
  message: 'A new version is ready to install.',
  action: {
    label: 'Update Now',
    onClick: () => window.location.reload()
  }
});

// Promise-based toast
await toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load'
  }
);`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default ToastDemo;