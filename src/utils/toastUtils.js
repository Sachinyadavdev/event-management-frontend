import { useToast } from '../hooks/useToast';

/**
 * Custom hook for ISACA-specific toast patterns
 * Provides pre-configured toast notifications for common ISACA operations
 */
export const useIsacaToast = () => {
  const toast = useToast();

  return {
    // Authentication-related toasts
    auth: {
      loginSuccess: (userName) => 
        toast.success('Welcome back!', {
          message: `Successfully logged in as ${userName}`,
        }),
      
      loginError: (error) => 
        toast.error('Login failed', {
          message: error || 'Please check your credentials and try again.',
        }),
      
      logoutSuccess: () => 
        toast.info('Logged out', {
          message: 'You have been successfully logged out.',
        }),
      
      sessionExpired: () => 
        toast.warning('Session expired', {
          message: 'Please log in again to continue.',
          duration: 6000,
        }),
    },

    // Event-related toasts
    events: {
      registrationSuccess: (eventName) => 
        toast.success('Registration confirmed!', {
          message: `You are now registered for "${eventName}". Check your email for details.`,
          duration: 6000,
        }),
      
      registrationError: (error) => 
        toast.error('Registration failed', {
          message: error || 'Unable to register for this event. Please try again.',
        }),
      
      eventReminder: (eventName, timeUntil) => 
        toast.info('Event reminder', {
          message: `"${eventName}" starts ${timeUntil}`,
          duration: 8000,
        }),
      
      eventCancelled: (eventName) => 
        toast.warning('Event cancelled', {
          message: `"${eventName}" has been cancelled. You will receive a refund if applicable.`,
          duration: 8000,
        }),
    },

    // Member-related toasts
    membership: {
      renewalSuccess: () => 
        toast.success('Membership renewed!', {
          message: 'Your ISACA membership has been successfully renewed.',
          duration: 6000,
        }),
      
      renewalReminder: (daysLeft) => 
        toast.warning('Membership renewal', {
          message: `Your membership expires in ${daysLeft} days. Renew now to continue enjoying benefits.`,
          duration: 8000,
          action: {
            label: 'Renew Now',
            onClick: () => window.location.href = '/membership/renew',
          },
        }),
      
      profileUpdated: () => 
        toast.success('Profile updated', {
          message: 'Your profile information has been saved successfully.',
        }),
    },

    // Certification-related toasts
    certification: {
      applicationSubmitted: (certName) => 
        toast.success('Application submitted!', {
          message: `Your ${certName} certification application has been submitted for review.`,
          duration: 6000,
        }),
      
      examScheduled: (certName, date) => 
        toast.info('Exam scheduled', {
          message: `Your ${certName} exam is scheduled for ${date}.`,
          duration: 8000,
        }),
      
      resultAvailable: (certName) => 
        toast.info('Results available', {
          message: `Your ${certName} exam results are now available.`,
          action: {
            label: 'View Results',
            onClick: () => window.location.href = '/certifications/results',
          },
        }),
    },

    // Payment-related toasts
    payment: {
      success: (amount, description) => 
        toast.success('Payment successful!', {
          message: `Payment of $${amount} for ${description} has been processed.`,
          duration: 6000,
        }),
      
      failed: (error) => 
        toast.error('Payment failed', {
          message: error || 'Your payment could not be processed. Please try again.',
          duration: 8000,
        }),
      
      pending: (amount) => 
        toast.info('Payment processing', {
          message: `Your payment of $${amount} is being processed. You will receive a confirmation shortly.`,
          duration: 6000,
        }),
    },

    // Network/System-related toasts
    system: {
      offline: () => 
        toast.warning('You are offline', {
          message: 'Some features may not be available until you reconnect to the internet.',
          duration: 0, // Persistent until dismissed
        }),
      
      online: () => 
        toast.success('Connection restored', {
          message: 'You are back online. All features are now available.',
        }),
      
      maintenance: (startTime, duration) => 
        toast.info('Scheduled maintenance', {
          message: `System maintenance scheduled from ${startTime} for ${duration}. Save your work.`,
          duration: 0, // Persistent
        }),
      
      saveDraft: () => 
        toast.info('Draft saved', {
          message: 'Your changes have been automatically saved.',
          duration: 2000,
        }),
      
      uploadProgress: (filename, percentage) => 
        toast.loading(`Uploading ${filename}`, {
          message: `${percentage}% complete`,
        }),
      
      uploadSuccess: (filename) => 
        toast.success('Upload complete', {
          message: `${filename} has been uploaded successfully.`,
        }),
      
      uploadError: (filename, error) => 
        toast.error('Upload failed', {
          message: `Failed to upload ${filename}. ${error}`,
        }),
    },

    // Data operations
    data: {
      loading: (operation) => 
        toast.loading(`${operation}...`, {
          message: 'Please wait while we process your request.',
        }),
      
      success: (operation) => 
        toast.success(`${operation} completed`, {
          message: 'Your request has been processed successfully.',
        }),
      
      error: (operation, error) => 
        toast.error(`${operation} failed`, {
          message: error || 'An error occurred while processing your request.',
        }),
    },

    // Form validations
    form: {
      validationError: (errors) => {
        const errorCount = Array.isArray(errors) ? errors.length : 1;
        const message = Array.isArray(errors) 
          ? errors.join(', ')
          : errors;
        
        return toast.error('Form validation failed', {
          message: `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''}: ${message}`,
          duration: 6000,
        });
      },
      
      unsavedChanges: () => 
        toast.warning('Unsaved changes', {
          message: 'You have unsaved changes. Are you sure you want to leave?',
          action: {
            label: 'Save Now',
            onClick: () => {/* Implement save logic */},
          },
        }),
    },

    // Utility methods
    ...toast, // Include all original toast methods
  };
};

export default useIsacaToast;