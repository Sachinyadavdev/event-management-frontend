# Assets Management Guide

This guide explains how to organize and use images, icons, and other assets in your ISACA Silicon Valley React application.

## 📁 Folder Structure

```
src/assets/
├── index.js                    # Centralized exports for all assets
├── images/
│   ├── logos/                  # Application and partner logos
│   │   ├── isaca-logo.svg
│   │   ├── isaca-logo-white.svg
│   │   └── partner-logos/
│   ├── icons/                  # UI icons (prefer SVG)
│   │   ├── menu.svg
│   │   ├── user.svg
│   │   ├── event.svg
│   │   └── social/
│   ├── banners/                # Hero banners and section headers
│   │   ├── hero-banner.jpg
│   │   ├── events-banner.jpg
│   │   └── certification-banner.jpg
│   ├── events/                 # Event-specific images
│   │   ├── event-placeholder.jpg
│   │   ├── conference-2024.jpg
│   │   └── workshops/
│   ├── avatars/                # Profile pictures and avatars
│   │   ├── default-avatar.svg
│   │   └── team/
│   └── placeholder-image.svg   # Fallback/placeholder images
```

## 🚀 Import Methods

### Method 1: Centralized Imports (Recommended)

Use the centralized `assets/index.js` file:

```jsx
import { IsacaLogo, MenuIcon, HeroBanner } from '../assets';

function Header() {
  return (
    <header>
      <img src={IsacaLogo} alt="ISACA Silicon Valley" className="h-12" />
      <img src={MenuIcon} alt="Menu" className="w-6 h-6" />
    </header>
  );
}
```

### Method 2: Direct Imports

Import specific assets directly:

```jsx
import logo from '../assets/images/logos/isaca-logo.svg';
import menuIcon from '../assets/images/icons/menu.svg';

function Navigation() {
  return (
    <nav>
      <img src={logo} alt="Logo" />
      <img src={menuIcon} alt="Menu" />
    </nav>
  );
}
```

### Method 3: Optimized Image Component

Use the `OptimizedImage` component for advanced features:

```jsx
import OptimizedImage from '../components/ui/OptimizedImage';
import { IsacaLogo, ImagePlaceholder } from '../assets';

function Logo() {
  return (
    <OptimizedImage
      src={IsacaLogo}
      alt="ISACA Silicon Valley"
      fallbackSrc={ImagePlaceholder}
      width={200}
      height={67}
      lazy={false} // Don't lazy load logos
      className="h-16"
    />
  );
}
```

### Method 4: Dynamic Imports

For conditional or runtime loading:

```jsx
const loadThemeImage = async (theme) => {
  try {
    const image = await import(`../assets/images/logos/logo-${theme}.svg`);
    return image.default;
  } catch (error) {
    console.error('Failed to load themed image:', error);
    return null;
  }
};
```

## 🎨 Asset Types & Guidelines

### Logos
- **Format**: SVG preferred (scalable, theme-friendly)
- **Naming**: `brand-name-logo.svg`, `brand-name-logo-white.svg`
- **Usage**: Headers, footers, authentication pages
- **Sizes**: Small (120x40), Medium (200x67), Large (300x100)

### Icons
- **Format**: SVG (scalable, can inherit colors)
- **Naming**: `action-name.svg` (e.g., `menu.svg`, `user.svg`)
- **Usage**: UI elements, buttons, navigation
- **Sizes**: Small (16x16), Medium (24x24), Large (32x32)

### Banners
- **Format**: JPG/WebP for photos, SVG for graphics
- **Naming**: `section-banner.jpg` (e.g., `hero-banner.jpg`)
- **Usage**: Page headers, section backgrounds
- **Sizes**: Hero (1920x600), Section (1200x400)

### Event Images
- **Format**: JPG/WebP
- **Naming**: `event-description-date.jpg`
- **Usage**: Event cards, detail pages
- **Sizes**: Card (400x300), Detail (800x600)

### Avatars
- **Format**: SVG for default, JPG for photos
- **Naming**: `default-avatar.svg`, `person-name.jpg`
- **Usage**: User profiles, team pages
- **Sizes**: Small (32x32), Medium (48x48), Large (96x96)

## 🔧 Configuration

### Size Constants

Use predefined sizes from `assets/index.js`:

```jsx
import { IMAGE_SIZES } from '../assets';

// Use consistent sizing
<img 
  width={IMAGE_SIZES.logo.medium.width}
  height={IMAGE_SIZES.logo.medium.height}
/>
```

### Theme-Aware Assets

For assets that change with theme:

```jsx
import { useTheme } from '../hooks/useTheme';
import { IsacaLogo, IsacaLogoWhite } from '../assets';

function ThemedLogo() {
  const { isDark } = useTheme();
  
  return (
    <img 
      src={isDark ? IsacaLogoWhite : IsacaLogo}
      alt="ISACA Silicon Valley"
      className="h-12"
    />
  );
}
```

## ⚡ Performance Best Practices

### 1. Optimize Images
- Use appropriate formats (SVG for icons, WebP for photos)
- Compress images before adding to project
- Use appropriate dimensions (don't use CSS to resize large images)

### 2. Lazy Loading
```jsx
<OptimizedImage
  src={eventImage}
  alt="Event"
  lazy={true} // Enable lazy loading
  className="w-full h-64 object-cover"
/>
```

### 3. Preload Critical Assets
For above-the-fold images:
```jsx
<link rel="preload" as="image" href="/src/assets/images/logos/isaca-logo.svg" />
```

### 4. Error Handling
Always provide fallbacks:
```jsx
<OptimizedImage
  src={userAvatar}
  alt="User"
  fallbackSrc={DefaultAvatar}
  onError={(e) => console.log('Image failed to load:', e)}
/>
```

## 🌙 Dark Mode Support

### SVG Icons
Use `currentColor` for theme-aware icons:
```svg
<svg fill="currentColor" className="text-gray-600 dark:text-gray-300">
  <!-- SVG content -->
</svg>
```

### Conditional Assets
```jsx
const getThemedAsset = (lightAsset, darkAsset) => {
  const { isDark } = useTheme();
  return isDark ? darkAsset : lightAsset;
};
```

## 📱 Public vs Assets Folder

### Use `src/assets/` for:
- Images imported in components
- Icons and logos used in UI
- Images that need processing by Vite

### Use `public/` for:
- PWA icons and manifests
- Meta images (og:image, twitter:image)
- Static files referenced by URL
- Images that should not be processed

## 🔍 Troubleshooting

### Common Issues

1. **Image not showing**: Check file path and extension
2. **Build errors**: Ensure all imported assets exist
3. **Performance issues**: Use appropriate formats and sizes
4. **Theme issues**: Verify SVG uses `currentColor` or provide theme variants

### Debug Tips

```jsx
// Debug image loading
<OptimizedImage
  src={imageSrc}
  alt="Debug"
  onLoad={() => console.log('Image loaded successfully')}
  onError={(e) => console.error('Image failed:', e)}
/>
```

## 📝 Naming Conventions

- Use kebab-case: `isaca-logo.svg`
- Be descriptive: `cybersecurity-workshop-2024.jpg`
- Include variants: `logo-white.svg`, `logo-dark.svg`
- Use consistent prefixes: `icon-`, `banner-`, `avatar-`

## 🚀 Demo

Visit `/assets-demo` in your application to see all import methods in action with live examples.

---

*This guide covers the complete asset management system for the ISACA Silicon Valley application. Follow these patterns for consistent, performant, and maintainable image handling.*