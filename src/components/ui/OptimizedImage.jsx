import React from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * 
 * A wrapper component for images that provides:
 * - Lazy loading
 * - Error handling with fallback
 * - Consistent sizing
 * - Accessibility features
 * - Loading states
 */
const OptimizedImage = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  width,
  height,
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(src);

  const handleLoad = (event) => {
    setImageLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setImageError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageError(false);
    } else {
      onError?.(event);
    }
  };

  const imageClasses = `
    ${className}
    ${!imageLoaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300
    ${imageError ? 'bg-gray-200 dark:bg-gray-700' : ''}
  `.trim();

  return (
    <div className="relative inline-block">
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={imageClasses}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Error state */}
      {imageError && !fallbackSrc && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm rounded"
          style={{ width, height }}
        >
          Image not found
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lazy: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;