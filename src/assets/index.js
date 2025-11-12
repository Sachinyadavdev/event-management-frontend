// Assets Index - Centralized image imports and exports
// This file provides a single point of import for all application assets

// ============================================================================
// LOGOS (Only export existing assets)
// ============================================================================
// Main application logos
export { default as IsacaLogo } from './images/logos/ISACA_logo.png';
export { default as IsacaLogoWhite } from './images/logos/ISACA_logo.png';
export { default as IsacaFavicon } from './images/logos/favicon.png';

// ============================================================================
// ICONS (Only export existing assets)
// ============================================================================
// UI Icons (prefer SVG for scalability)
export { default as MenuIcon } from './images/icons/menu.svg';
export { default as CloseIcon } from './images/icons/close.svg';
export { default as SearchIcon } from './images/icons/search.svg';
export { default as UserIcon } from './images/icons/user.svg';
export { default as EventIcon } from './images/icons/event.svg';

// ============================================================================
// FALLBACK IMAGES (Only export existing assets)
// ============================================================================
export { default as ImagePlaceholder } from './images/placeholder-image.svg';

// ============================================================================
// FUTURE ASSETS (Commented out until created)
// ============================================================================
// Uncomment these exports as you add the corresponding asset files:

// Additional Logos:
// export { default as SiliconValleyLogo } from './images/logos/silicon-valley-logo.svg';
// export { default as PartnerLogo1 } from './images/logos/partner-1.svg';

// Additional Icons:
// export { default as CertificationIcon } from './images/icons/certification.svg';
// export { default as NetworkingIcon } from './images/icons/networking.svg';
// export { default as LinkedInIcon } from './images/icons/linkedin.svg';
// export { default as TwitterIcon } from './images/icons/twitter.svg';
// export { default as FacebookIcon } from './images/icons/facebook.svg';

// Banner Images:
// export { default as HeroBanner } from './images/banners/hero-banner.jpg';
// export { default as EventsBanner } from './images/banners/events-banner.jpg';
// export { default as CertificationBanner } from './images/banners/certification-banner.jpg';

// Event Images:
// export { default as EventPlaceholder } from './images/events/event-placeholder.jpg';
// export { default as ConferenceImage } from './images/events/conference-2024.jpg';

// Avatar Images:
// export { default as DefaultAvatar } from './images/avatars/default-avatar.svg';
// export { default as AdminAvatar } from './images/avatars/admin-avatar.jpg';

// ============================================================================
// ASSET CONSTANTS
// ============================================================================
export const ASSET_PATHS = {
  logos: '/src/assets/images/logos/',
  icons: '/src/assets/images/icons/',
  banners: '/src/assets/images/banners/',
  events: '/src/assets/images/events/',
  avatars: '/src/assets/images/avatars/',
};

// Image size constants for consistent sizing
export const IMAGE_SIZES = {
  logo: {
    small: { width: 120, height: 40 },
    medium: { width: 200, height: 67 },
    large: { width: 300, height: 100 },
  },
  icon: {
    small: { width: 16, height: 16 },
    medium: { width: 24, height: 24 },
    large: { width: 32, height: 32 },
  },
  avatar: {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 96, height: 96 },
  },
  banner: {
    hero: { width: 1920, height: 600 },
    section: { width: 1200, height: 400 },
  },
};