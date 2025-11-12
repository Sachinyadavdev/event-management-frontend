import React from 'react';
import { createPortal } from 'react-dom';
import { useToast, TOAST_POSITIONS } from '../../hooks/useToast';
import Toast from './Toast';

// ============================================================================
// POSITION STYLES
// ============================================================================
const getPositionStyles = (position) => {
  const positions = {
    [TOAST_POSITIONS.TOP_RIGHT]: 'top-4 right-4',
    [TOAST_POSITIONS.TOP_LEFT]: 'top-4 left-4',
    [TOAST_POSITIONS.TOP_CENTER]: 'top-4 left-1/2 transform -translate-x-1/2',
    [TOAST_POSITIONS.BOTTOM_RIGHT]: 'bottom-4 right-4',
    [TOAST_POSITIONS.BOTTOM_LEFT]: 'bottom-4 left-4',
    [TOAST_POSITIONS.BOTTOM_CENTER]: 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  
  return positions[position] || positions[TOAST_POSITIONS.TOP_RIGHT];
};

// ============================================================================
// TOAST CONTAINER COMPONENT
// ============================================================================
const ToastContainer = () => {
  const { toasts, position, clearAllToasts } = useToast();

  // Don't render if no toasts
  if (toasts.length === 0) {
    return null;
  }

  const containerContent = (
    <div
      className={`
        fixed z-50 pointer-events-none
        ${getPositionStyles(position)}
      `}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="flex flex-col space-y-3 pointer-events-auto">
        {/* Clear All Button (only show if more than 2 toasts) */}
        {toasts.length > 2 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={clearAllToasts}
              className="
                text-xs px-2 py-1 rounded 
                bg-gray-800 dark:bg-gray-200 
                text-white dark:text-gray-800 
                hover:bg-gray-700 dark:hover:bg-gray-300
                focus:outline-none focus:ring-2 focus:ring-gray-500
                transition-colors duration-200
              "
            >
              Clear all
            </button>
          </div>
        )}

        {/* Toast List */}
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );

  // Render in portal to ensure proper z-index stacking
  return createPortal(containerContent, document.body);
};

export default ToastContainer;