# Toast Notification System Documentation

## 🍞 Overview

The Toast Notification System provides a comprehensive, scalable, and accessible way to display notifications to users. It includes multiple toast types, positioning options, animations, and ISACA-specific notification patterns.

## 🚀 Quick Start

### 1. Setup (Already configured in App.jsx)

```jsx
import { ToastProvider } from './hooks/useToast';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {/* Your app content */}
      <ToastContainer />
    </ToastProvider>
  );
}
```

### 2. Basic Usage

```jsx
import { useToast } from '../hooks/useToast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

## 📋 Toast Types

### Available Types
- **Success** (`success`) - Green, for successful operations
- **Error** (`error`) - Red, for errors and failures
- **Warning** (`warning`) - Yellow, for warnings and cautions
- **Info** (`info`) - Blue, for general information
- **Loading** (`loading`) - Gray with spinner, for ongoing operations

### Type Methods

```jsx
const toast = useToast();

// Convenience methods
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');
toast.loading('Loading message');
```

## 🎯 Positioning

### Available Positions
- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

### Change Position

```jsx
const toast = useToast();

// Change global position
toast.setPosition('bottom-right');
```

## ⚙️ Configuration Options

### Toast Options

```jsx
toast.addToast({
  type: 'success',           // Toast type
  title: 'Success!',         // Optional title
  message: 'Details here',   // Message content
  duration: 4000,           // Auto-dismiss time (0 = persistent)
  dismissible: true,        // Can be manually dismissed
  pauseOnHover: true,       // Pause timer on hover
  action: {                 // Optional action button
    label: 'Undo',
    onClick: () => handleUndo()
  }
});
```

### Provider Options

```jsx
<ToastProvider 
  position="top-right"      // Default position
  maxToasts={5}            // Maximum visible toasts
>
```

## 🔄 Advanced Features

### Promise-based Toasts

Perfect for async operations:

```jsx
const handleAsyncOperation = async () => {
  await toast.promise(
    fetch('/api/data').then(r => r.json()),
    {
      loading: 'Loading data...',
      success: 'Data loaded successfully!',
      error: 'Failed to load data'
    }
  );
};
```

### Loading Toasts

For long-running operations:

```jsx
const handleLongOperation = async () => {
  // Show loading toast
  const loadingId = toast.loading('Processing...');
  
  try {
    await performOperation();
    // Remove loading and show success
    toast.removeToast(loadingId);
    toast.success('Operation completed!');
  } catch (error) {
    // Remove loading and show error
    toast.removeToast(loadingId);
    toast.error('Operation failed!');
  }
};
```

### Update Existing Toasts

```jsx
const toastId = toast.loading('Starting process...');

// Update the toast
toast.updateToast(toastId, {
  message: 'Processing step 2...',
});

// Later, complete it
toast.updateToast(toastId, {
  type: 'success',
  title: 'Completed!',
  message: 'Process finished successfully',
  duration: 4000,
});
```

## 🏢 ISACA-Specific Patterns

Use the `useIsacaToast` hook for pre-configured ISACA notifications:

```jsx
import { useIsacaToast } from '../utils/toastUtils';

function LoginComponent() {
  const toast = useIsacaToast();

  const handleLogin = async (credentials) => {
    try {
      const user = await login(credentials);
      toast.auth.loginSuccess(user.name);
    } catch (error) {
      toast.auth.loginError(error.message);
    }
  };
}
```

### Available ISACA Patterns

#### Authentication
```jsx
toast.auth.loginSuccess(userName);
toast.auth.loginError(error);
toast.auth.logoutSuccess();
toast.auth.sessionExpired();
```

#### Events
```jsx
toast.events.registrationSuccess(eventName);
toast.events.registrationError(error);
toast.events.eventReminder(eventName, timeUntil);
toast.events.eventCancelled(eventName);
```

#### Membership
```jsx
toast.membership.renewalSuccess();
toast.membership.renewalReminder(daysLeft);
toast.membership.profileUpdated();
```

#### Certification
```jsx
toast.certification.applicationSubmitted(certName);
toast.certification.examScheduled(certName, date);
toast.certification.resultAvailable(certName);
```

#### Payment
```jsx
toast.payment.success(amount, description);
toast.payment.failed(error);
toast.payment.pending(amount);
```

#### System
```jsx
toast.system.offline();
toast.system.online();
toast.system.maintenance(startTime, duration);
toast.system.saveDraft();
```

## 🎨 Styling & Theming

### CSS Classes

Toasts automatically adapt to your theme:
- Light mode: Light backgrounds with dark text
- Dark mode: Dark backgrounds with light text

### Custom Animations

The system includes several CSS animations:
- `animate-shrink-width` - Progress bar animation
- `animate-bounce-in` - Success toast entrance
- `animate-shake` - Error toast emphasis

### Responsive Design

Toasts are responsive and work on all screen sizes:
- Mobile: Full width with proper spacing
- Desktop: Fixed width with shadows

## ♿ Accessibility

### Features Included
- **ARIA labels** - Proper labeling for screen readers
- **Role attributes** - `role="alert"` and `aria-live="polite"`
- **Keyboard navigation** - Focus management for action buttons
- **Color contrast** - WCAG compliant color schemes
- **Reduced motion** - Respects user motion preferences

### Screen Reader Support

```jsx
// Automatically announces to screen readers
toast.success('Profile updated', {
  message: 'Your changes have been saved successfully'
});
```

## 🧪 Testing

### Demo Routes Available

Visit these routes to test the toast system:
- `/toast-demo` - Complete interactive demo
- `/assets-test` - Simple test (includes basic toast functionality)

### Testing Patterns

```jsx
// In your tests
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../hooks/useToast';

const TestWrapper = ({ children }) => (
  <ToastProvider>
    {children}
    <ToastContainer />
  </ToastProvider>
);

test('shows success toast', () => {
  render(<MyComponent />, { wrapper: TestWrapper });
  // Test toast appearance
});
```

## 📱 Mobile Considerations

### Touch Interactions
- Swipe to dismiss (future enhancement)
- Touch-friendly close buttons
- Proper spacing for finger taps

### Performance
- Limited to 5 toasts maximum by default
- Automatic cleanup of old toasts
- Efficient re-renders using React context

## 🔧 API Reference

### useToast Hook

```jsx
const {
  // State
  toasts,              // Array of current toasts
  position,            // Current position
  
  // Core methods
  addToast,           // Add a custom toast
  removeToast,        // Remove specific toast
  updateToast,        // Update existing toast
  clearAllToasts,     // Remove all toasts
  setPosition,        // Change position
  
  // Convenience methods
  success,            // Show success toast
  error,              // Show error toast
  warning,            // Show warning toast
  info,               // Show info toast
  loading,            // Show loading toast
  promise,            // Promise-based toast
} = useToast();
```

### Toast Object Structure

```jsx
{
  id: 'unique-id',
  type: 'success',
  title: 'Optional title',
  message: 'Toast message',
  duration: 4000,
  dismissible: true,
  pauseOnHover: true,
  action: {
    label: 'Action',
    onClick: () => {}
  },
  createdAt: 1634567890123
}
```

## 🚨 Error Handling

### Common Issues

1. **Toast not showing**: Ensure `ToastContainer` is rendered
2. **Hook error**: Must be used within `ToastProvider`
3. **Styling issues**: Check Tailwind CSS is loaded
4. **Performance**: Limit concurrent toasts using `maxToasts`

### Debugging

```jsx
// Enable console logging
const toast = useToast();
console.log('Current toasts:', toast.toasts);
```

## 🔮 Future Enhancements

Planned features:
- Swipe to dismiss on mobile
- Sound notifications
- Toast queuing system
- Custom toast templates
- Offline toast storage
- Analytics integration

---

## 📝 Best Practices

1. **Use appropriate types** - Match toast type to action result
2. **Keep messages concise** - Users scan quickly
3. **Provide actions when helpful** - "Undo", "View Details", etc.
4. **Handle errors gracefully** - Always show user-friendly error messages
5. **Test accessibility** - Use screen readers to verify experience
6. **Limit concurrent toasts** - Don't overwhelm users
7. **Use ISACA patterns** - Leverage pre-built patterns for consistency

## 🤝 Contributing

When adding new toast patterns:
1. Add to `useIsacaToast` hook
2. Include in documentation
3. Test with screen readers
4. Verify on mobile devices
5. Update demo component

---

*This toast system provides a solid foundation for user notifications in the ISACA Silicon Valley application. It's designed to be accessible, performant, and easy to use while maintaining consistency with ISACA's user experience standards.*