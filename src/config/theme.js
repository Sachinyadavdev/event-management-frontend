// Centralized Theme Configuration
// Modify this file to change theme colors across the entire application

export const themeConfig = {
  // Light Mode Colors
  light: {
    // Background colors
    background: {
      primary: 'bg-white',           // Main background
      secondary: 'bg-gray-50',       // Secondary background
      card: 'bg-white',              // Card backgrounds
      header: 'bg-white',            // Header background
      sidebar: 'bg-white',           // Sidebar background
    },
    
    // Text colors
    text: {
      primary: 'text-gray-900',      // Main text
      secondary: 'text-gray-600',    // Secondary text
      muted: 'text-gray-500',        // Muted text
      accent: 'text-primary-600',    // Accent text
    },
    
    // Border colors
    border: {
      primary: 'border-gray-200',    // Main borders
      secondary: 'border-gray-300',  // Input borders
      accent: 'border-primary-600',  // Accent borders
    },
    
    // Button colors
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    
    // Custom colors for light mode
    custom: {
      highlight: 'bg-yellow-100',
      accent: 'bg-blue-500',
      special: 'bg-purple-200',
    }
  },
  
  // Dark Mode Colors
  dark: {
    // Background colors
    background: {
      primary: 'dark:bg-gray-900',     // Main background
      secondary: 'dark:bg-gray-800',   // Secondary background
      card: 'dark:bg-gray-800',        // Card backgrounds
      header: 'dark:bg-gray-800',      // Header background
      sidebar: 'dark:bg-gray-800',     // Sidebar background
    },
    
    // Text colors
    text: {
      primary: 'dark:text-white',      // Main text
      secondary: 'dark:text-gray-300', // Secondary text
      muted: 'dark:text-gray-400',     // Muted text
      accent: 'dark:text-primary-400', // Accent text
    },
    
    // Border colors
    border: {
      primary: 'dark:border-gray-700',   // Main borders
      secondary: 'dark:border-gray-600', // Input borders
      accent: 'dark:border-primary-400', // Accent borders
    },
    
    // Button colors
    button: {
      primary: 'dark:bg-primary-500 dark:hover:bg-primary-600',
      secondary: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
      danger: 'dark:bg-red-500 dark:hover:bg-red-600',
      success: 'dark:bg-green-500 dark:hover:bg-green-600',
      warning: 'dark:bg-yellow-600 dark:hover:bg-yellow-700',
    },
    
    // Custom colors for dark mode (different from light!)
    custom: {
      highlight: 'dark:bg-yellow-900',
      accent: 'dark:bg-blue-800',
      special: 'dark:bg-purple-800',
    }
  }
};

// Helper function to combine light and dark classes
export const getThemeClasses = (lightClass, darkClass) => {
  return `${lightClass} ${darkClass}`;
};

// Predefined theme class combinations for common elements
export const themeClasses = {
  // Page backgrounds
  pageBackground: getThemeClasses(
    themeConfig.light.background.primary,
    themeConfig.dark.background.primary
  ),
  
  secondaryBackground: getThemeClasses(
    themeConfig.light.background.secondary,
    themeConfig.dark.background.secondary
  ),
  
  // Cards
  card: getThemeClasses(
    `${themeConfig.light.background.card} ${themeConfig.light.border.primary}`,
    `${themeConfig.dark.background.card} ${themeConfig.dark.border.primary}`
  ),
  
  // Text
  primaryText: getThemeClasses(
    themeConfig.light.text.primary,
    themeConfig.dark.text.primary
  ),
  
  secondaryText: getThemeClasses(
    themeConfig.light.text.secondary,
    themeConfig.dark.text.secondary
  ),
  
  mutedText: getThemeClasses(
    themeConfig.light.text.muted,
    themeConfig.dark.text.muted
  ),
  
  accentText: getThemeClasses(
    themeConfig.light.text.accent,
    themeConfig.dark.text.accent
  ),
  
  // Borders
  border: getThemeClasses(
    themeConfig.light.border.primary,
    themeConfig.dark.border.primary
  ),
  
  // Buttons
  primaryButton: getThemeClasses(
    themeConfig.light.button.primary,
    themeConfig.dark.button.primary
  ),
  
  secondaryButton: getThemeClasses(
    themeConfig.light.button.secondary,
    themeConfig.dark.button.secondary
  ),
  
  dangerButton: getThemeClasses(
    themeConfig.light.button.danger,
    themeConfig.dark.button.danger
  ),
  
  successButton: getThemeClasses(
    themeConfig.light.button.success,
    themeConfig.dark.button.success
  ),
  
  warningButton: getThemeClasses(
    themeConfig.light.button.warning,
    themeConfig.dark.button.warning
  ),
  
  // Custom theme combinations
  highlightBg: getThemeClasses(
    themeConfig.light.custom.highlight,
    themeConfig.dark.custom.highlight
  ),
  
  accentBg: getThemeClasses(
    themeConfig.light.custom.accent,
    themeConfig.dark.custom.accent
  ),
  
  specialBg: getThemeClasses(
    themeConfig.light.custom.special,
    themeConfig.dark.custom.special
  ),
  
  // Common layouts
  header: getThemeClasses(
    `${themeConfig.light.background.header} ${themeConfig.light.border.primary}`,
    `${themeConfig.dark.background.header} ${themeConfig.dark.border.primary}`
  ),
  
  sidebar: getThemeClasses(
    `${themeConfig.light.background.sidebar} ${themeConfig.light.border.primary}`,
    `${themeConfig.dark.background.sidebar} ${themeConfig.dark.border.primary}`
  ),
};

export default themeConfig;