// Environment configuration utility
// All Vite environment variables must be prefixed with VITE_

export const config = {
  // App Information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'ISACA Silicon Valley',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'ISACA Silicon Valley Chapter Application',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Backend Configuration
  backend: {
    url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
    isProduction: import.meta.env.VITE_NODE_ENV === 'production',
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  },

  // Feature Flags
  features: {
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Social Media & Contact
  links: {
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/company/isaca-silicon-valley',
    twitter: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/isacasv',
    website: import.meta.env.VITE_WEBSITE_URL || 'https://www.isaca-sv.org',
  },

  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'info@isaca-sv.org',
    support: import.meta.env.VITE_SUPPORT_EMAIL || 'support@isaca-sv.org',
  },
};

// Helper function to check if we're in development mode
export const isDev = () => config.env.isDevelopment;

// Helper function to get API URL with endpoint
export const getApiUrl = (endpoint = '') => {
  return `${config.api.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Helper function for debugging
export const debugLog = (...args) => {
  if (config.features.enableDebug) {
    console.log('[DEBUG]', ...args);
  }
};

export default config;