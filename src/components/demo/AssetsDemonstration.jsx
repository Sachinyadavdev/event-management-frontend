import React from 'react';
import OptimizedImage from '../ui/OptimizedImage';

// ============================================================================
// METHOD 1: Direct Import (Recommended for frequently used assets)
// ============================================================================
import isacaLogo from '../../assets/images/logos/ISACA_logo.png';
import menuIcon from '../../assets/images/icons/menu.svg';
import placeholderImage from '../../assets/images/placeholder-image.svg';

// ============================================================================
// METHOD 2: Centralized Import (Recommended for better organization)
// ============================================================================
import { 
  IsacaLogo, 
  IsacaLogoWhite, 
  MenuIcon, 
  CloseIcon,
  SearchIcon,
  UserIcon,
  EventIcon,
  ImagePlaceholder,
  IMAGE_SIZES 
} from '../../assets';

// ============================================================================
// METHOD 3: Dynamic Import (For conditional loading)
// ============================================================================
const loadImageDynamically = async (imageName) => {
  try {
    const image = await import(`../../assets/images/logos/${imageName}.svg`);
    return image.default;
  } catch (error) {
    console.error('Failed to load image:', error);
    return null;
  }
};

/**
 * AssetsDemonstration Component
 * 
 * Demonstrates various methods of importing and using images in React + Vite
 */
const AssetsDemonstration = () => {
  const [dynamicImage, setDynamicImage] = React.useState(null);

  React.useEffect(() => {
    // Example of dynamic import
    loadImageDynamically('isaca-logo').then(setDynamicImage);
  }, []);

  return (
    <div className="p-8 space-y-12 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Assets Import Methods Demo
        </h1>

        {/* Method 1: Direct Import */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Method 1: Direct Import
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Import specific assets directly at the top of your component file.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <code className="text-sm">
              {`import isacaLogo from '../../assets/images/logos/isaca-logo.svg';`}
            </code>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={isacaLogo} 
              alt="ISACA Logo" 
              className="h-16"
            />
            <img 
              src={menuIcon} 
              alt="Menu" 
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
            />
          </div>
        </section>

        {/* Method 2: Centralized Import */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Method 2: Centralized Import (Recommended)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Import from a central index file for better organization and consistency.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <code className="text-sm">
              {`import { IsacaLogo, MenuIcon } from '../../assets';`}
            </code>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={IsacaLogo} 
              alt="ISACA Logo" 
              className="h-16"
            />
            <img 
              src={IsacaLogoWhite} 
              alt="ISACA Logo White" 
              className="h-16 bg-gray-800 p-2 rounded"
            />
            <div className="flex space-x-2">
              <img src={MenuIcon} alt="Menu" className="w-6 h-6 text-gray-600" />
              <img src={CloseIcon} alt="Close" className="w-6 h-6 text-gray-600" />
              <img src={SearchIcon} alt="Search" className="w-6 h-6 text-gray-600" />
              <img src={UserIcon} alt="User" className="w-6 h-6 text-gray-600" />
              <img src={EventIcon} alt="Event" className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </section>

        {/* Method 3: Optimized Image Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Method 3: Optimized Image Component
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Use the OptimizedImage component for lazy loading, error handling, and consistent sizing.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <code className="text-sm">
              {`<OptimizedImage src={IsacaLogo} alt="ISACA Logo" fallbackSrc={ImagePlaceholder} />`}
            </code>
          </div>
          <div className="space-y-4">
            <OptimizedImage
              src={IsacaLogo}
              alt="ISACA Logo with OptimizedImage"
              fallbackSrc={ImagePlaceholder}
              width={IMAGE_SIZES.logo.medium.width}
              height={IMAGE_SIZES.logo.medium.height}
              className="border border-gray-200 dark:border-gray-700 rounded"
            />
            
            {/* Example with error fallback */}
            <OptimizedImage
              src="/non-existent-image.jpg"
              alt="This will show fallback"
              fallbackSrc={ImagePlaceholder}
              width={200}
              height={150}
              className="border border-gray-200 dark:border-gray-700 rounded"
            />
          </div>
        </section>

        {/* Method 4: Dynamic Import */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Method 4: Dynamic Import
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Load images dynamically based on conditions or user interactions.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <code className="text-sm">
              {`const image = await import(\`../../assets/images/logos/\${imageName}.svg\`);`}
            </code>
          </div>
          {dynamicImage && (
            <img 
              src={dynamicImage} 
              alt="Dynamically loaded ISACA Logo" 
              className="h-16"
            />
          )}
        </section>

        {/* Best Practices Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Best Practices Summary
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use centralized imports via <code>assets/index.js</code> for better organization
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Prefer SVG for icons and logos (scalable and theme-friendly)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use OptimizedImage component for lazy loading and error handling
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Keep consistent folder structure: logos/, icons/, banners/, events/, avatars/
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Define standard sizes in your assets configuration
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Always provide alt text for accessibility
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use dynamic imports only when needed (conditional loading)
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssetsDemonstration;