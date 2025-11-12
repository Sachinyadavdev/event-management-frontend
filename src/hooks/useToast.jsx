import React, { createContext, useContext, useReducer, useCallback, useState, useEffect } from 'react';

// ============================================================================
// TOAST TYPES AND CONSTANTS
// ============================================================================
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

export const TOAST_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
};

const DEFAULT_DURATION = 4000; // 4 seconds
const DEFAULT_POSITION = TOAST_POSITIONS.TOP_RIGHT;

// ============================================================================
// TOAST REDUCER
// ============================================================================
const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === action.payload.id
            ? { ...toast, ...action.payload.updates }
            : toast
        ),
      };

    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: [],
      };

    case 'SET_POSITION':
      return {
        ...state,
        position: action.payload,
      };

    default:
      return state;
  }
};

// ============================================================================
// TOAST CONTEXT
// ============================================================================
const ToastContext = createContext(null);

// ============================================================================
// TOAST COMPONENTS
// ============================================================================

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    let borderColor = 'border-blue-500';
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        borderColor = 'border-green-500';
        break;
      case TOAST_TYPES.ERROR:
        borderColor = 'border-red-500';
        break;
      case TOAST_TYPES.WARNING:
        borderColor = 'border-yellow-500';
        break;
      case TOAST_TYPES.INFO:
      default:
        borderColor = 'border-blue-500';
    }
    
    return `
      max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${borderColor}
      p-4 flex items-start gap-3 transform transition-all duration-300 ease-in-out
      ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `.replace(/\s+/g, ' ').trim();
  };

  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case TOAST_TYPES.ERROR:
        return (
          <div className="flex-shrink-0 rounded-full bg-red-100 p-1">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case TOAST_TYPES.WARNING:
        return (
          <div className="flex-shrink-0 rounded-full bg-yellow-100 p-1">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case TOAST_TYPES.INFO:
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-1">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        {toast.title && toast.title !== toast.message && (
          <p className="text-sm font-medium text-gray-900 mb-1">{toast.title}</p>
        )}
        <p className="text-sm text-gray-700">{toast.message}</p>
      </div>
      {toast.dismissible && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, position, onRemove }) => {
  const getPositionStyles = () => {
    switch (position) {
      case TOAST_POSITIONS.TOP_RIGHT:
        return 'top-4 right-4';
      case TOAST_POSITIONS.TOP_LEFT:
        return 'top-4 left-4';
      case TOAST_POSITIONS.TOP_CENTER:
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case TOAST_POSITIONS.BOTTOM_RIGHT:
        return 'bottom-4 right-4';
      case TOAST_POSITIONS.BOTTOM_LEFT:
        return 'bottom-4 left-4';
      case TOAST_POSITIONS.BOTTOM_CENTER:
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionStyles()}`}>
      <div className="flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// TOAST PROVIDER COMPONENT
// ============================================================================
export const ToastProvider = ({ 
  children, 
  position = DEFAULT_POSITION,
  maxToasts = 5 
}) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    position,
  });

  // Generate unique ID for toasts
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add toast function
  const addToast = useCallback((toastOptions) => {
    const id = generateId();
    const toast = {
      id,
      type: TOAST_TYPES.INFO,
      duration: DEFAULT_DURATION,
      dismissible: true,
      pauseOnHover: true,
      ...toastOptions,
      createdAt: Date.now(),
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });

    // Auto-remove toast after duration (if not persistent)
    if (toast.duration > 0 && toast.type !== TOAST_TYPES.LOADING) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  // Remove toast function
  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  // Update toast function
  const updateToast = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TOAST', payload: { id, updates } });
  }, []);

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  }, []);

  // Set global position
  const setPosition = useCallback((newPosition) => {
    dispatch({ type: 'SET_POSITION', payload: newPosition });
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.SUCCESS,
      message,
      ...options,
    });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.ERROR,
      message,
      duration: 6000, // Longer for errors
      ...options,
    });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.WARNING,
      title: 'Warning',
      message,
      ...options,
    });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.INFO,
      title: 'Info',
      message,
      ...options,
    });
  }, [addToast]);

  const loading = useCallback((message, options = {}) => {
    return addToast({
      type: TOAST_TYPES.LOADING,
      title: 'Loading',
      message,
      duration: 0, // Persistent until manually dismissed
      dismissible: false,
      ...options,
    });
  }, [addToast]);

  // Promise-based toast for async operations
  const promise = useCallback(async (promise, messages, options = {}) => {
    const loadingId = loading(messages.loading || 'Loading...', {
      dismissible: false,
      ...options.loading,
    });

    try {
      const result = await promise;
      removeToast(loadingId);
      success(messages.success || 'Operation completed successfully', {
        ...options.success,
      });
      return result;
    } catch (error) {
      removeToast(loadingId);
      const errorMessage = error.message || messages.error || 'Operation failed';
      error(errorMessage, {
        ...options.error,
      });
      throw error;
    }
  }, [loading, removeToast, success, error]);

  // Limit number of toasts if maxToasts is set
  const limitedToasts = state.toasts.slice(-maxToasts);

  const value = {
    // State
    toasts: limitedToasts,
    position: state.position,
    
    // Core functions
    addToast,
    removeToast,
    updateToast,
    clearAllToasts,
    setPosition,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    loading,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={limitedToasts} position={state.position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ============================================================================
// TOAST HOOK
// ============================================================================
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;