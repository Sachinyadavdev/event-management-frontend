# Theme Configuration Guide

## 📍 **Single Source of Truth**

All theme colors are managed in: `src/config/theme.js`

## 🎨 **How to Change Theme Colors**

### **Method 1: Edit theme.js directly**
```javascript
// In src/config/theme.js
export const themeConfig = {
  light: {
    background: {
      primary: 'bg-white',        // ← Change this to modify light mode background
      secondary: 'bg-gray-50',    // ← Secondary background
    },
    text: {
      primary: 'text-gray-900',   // ← Main text color
    }
  },
  dark: {
    background: {
      primary: 'dark:bg-gray-900', // ← Change this to modify dark mode background  
      secondary: 'dark:bg-gray-800',
    },
    text: {
      primary: 'dark:text-white',  // ← Dark mode text color
    }
  }
};
```

### **Method 2: Use predefined theme classes**
```jsx
import { themeClasses } from '../config/theme.js';

// Use in your components
<div className={themeClasses.pageBackground}>
<h1 className={themeClasses.primaryText}>
<div className={themeClasses.card}>
```

## 🔧 **Available Theme Classes**

- `themeClasses.pageBackground` - Main page background (white/dark-gray)
- `themeClasses.secondaryBackground` - Secondary background (gray-50/gray-800)
- `themeClasses.card` - Card styling with borders
- `themeClasses.primaryText` - Main text (gray-900/white)
- `themeClasses.secondaryText` - Secondary text (gray-600/gray-300)
- `themeClasses.mutedText` - Muted text (gray-500/gray-400)
- `themeClasses.accentText` - Accent text (primary-600/primary-400)
- `themeClasses.border` - Standard borders
- `themeClasses.primaryButton` - Primary button styling
- `themeClasses.header` - Header styling
- `themeClasses.sidebar` - Sidebar styling

## 📝 **Examples**

### **Basic Usage:**
```jsx
// Old way (scattered across files)
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// New way (centralized)
<div className={`${themeClasses.pageBackground} ${themeClasses.primaryText}`}>
```

### **Custom Colors:**
```jsx
// Add to theme.js
export const customColors = {
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-yellow-600 dark:bg-yellow-500',
};

// Use in components
import { customColors } from '../config/theme.js';
<div className={customColors.success}>
```

## 🎯 **Quick Changes**

### **Want different dark mode background?**
Edit `themeConfig.dark.background.primary` in theme.js

### **Want different text colors?**
Edit `themeConfig.light.text.primary` and `themeConfig.dark.text.primary`

### **Want to add new theme variants?**
Add them to `themeClasses` object in theme.js

## ✅ **Benefits**

- ✅ **Single place to change colors** - Edit one file, update entire app
- ✅ **Consistent theming** - All components use same color scheme  
- ✅ **Easy maintenance** - No need to search multiple files
- ✅ **Type safety** - Import and use predefined classes
- ✅ **Reusable** - Create once, use everywhere