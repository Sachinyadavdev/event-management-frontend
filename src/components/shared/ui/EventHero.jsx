/**
 * EventHero.jsx - Reusable Event Hero Section Component
 * 
 * Features:
 * - Customizable layouts (banner, card, minimal)
 * - Dynamic date and time formatting
 * - Badge system for event types and status
 * - Responsive design with image optimization
 * - Configurable content sections
 */

import React from 'react';
import PropTypes from 'prop-types';

const EventHero = ({ 
  event, 
  layout = 'banner',
  showBadges = true,
  showDescription = true,
  showLocation = true,
  showDateTime = true,
  customStyles = {},
  onImageError,
  imageOptimization = true
}) => {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getBadgeColor = (type) => {
    const colors = {
      'In Person': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Virtual': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Hybrid': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Workshop': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Conference': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Webinar': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const renderBadges = () => {
    if (!showBadges) return null;

    const badges = [];
    
    if (event.mode) {
      badges.push({ text: event.mode, type: event.mode });
    }
    
    if (event.category) {
      badges.push({ text: event.category, type: event.category });
    }
    
    if (event.isPaid === false) {
      badges.push({ text: 'Free', type: 'Free' });
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(badge.type)}`}
            style={customStyles.badge}
          >
            {badge.text}
          </span>
        ))}
      </div>
    );
  };

  const renderDateTime = () => {
    if (!showDateTime) return null;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{formatDate(event.startsAt)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{formatTime(event.startsAt)} - {formatTime(event.endsAt)}</span>
        </div>
      </div>
    );
  };

  const renderLocation = () => {
    if (!showLocation || !event.location) return null;

    return (
      <div className="flex items-start gap-2 mb-6 text-gray-600 dark:text-gray-300">
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-medium">{event.location.venue}</p>
          {event.location.address && (
            <p className="text-sm opacity-80">{event.location.address}</p>
          )}
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    if (!showDescription || !event.description) return null;

    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {event.description}
        </p>
      </div>
    );
  };

  // Banner Layout (full-width with background image)
  if (layout === 'banner') {
    return (
      <div 
        className="relative overflow-hidden rounded-2xl shadow-2xl mb-8"
        style={customStyles.container}
      >
        {/* Background Image */}
        {event.bannerUrl && (
          <div className="absolute inset-0">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={onImageError}
              loading={imageOptimization ? "lazy" : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className={`relative z-10 p-8 md:p-12 ${!event.bannerUrl ? 'hero-gradient' : ''}`}>
          <div className="max-w-4xl">
            {renderBadges()}
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>
            
            {renderDateTime()}
            {renderLocation()}
            
            <div className="text-white/90 max-w-3xl">
              {renderDescription()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card Layout (contained card design)
  if (layout === 'card') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
        style={customStyles.container}
      >
        {/* Image Section */}
        {event.bannerUrl && (
          <div className="aspect-w-16 aspect-h-9 md:aspect-h-6">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-48 md:h-64 object-cover"
              onError={onImageError}
              loading={imageOptimization ? "lazy" : undefined}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-6 md:p-8">
          {renderBadges()}
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {event.title}
          </h1>
          
          {renderDateTime()}
          {renderLocation()}
          {renderDescription()}
        </div>
      </div>
    );
  }

  // Minimal Layout (text-only, clean design)
  if (layout === 'minimal') {
    return (
      <div 
        className="mb-8"
        style={customStyles.container}
      >
        {renderBadges()}
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {event.title}
        </h1>
        
        {renderDateTime()}
        {renderLocation()}
        
        <div className="border-l-4 border-indigo-500 pl-6">
          {renderDescription()}
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
};

EventHero.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string,
    mode: PropTypes.oneOf(['In Person', 'Virtual', 'Hybrid']),
    category: PropTypes.string,
    isPaid: PropTypes.bool,
    location: PropTypes.shape({
      venue: PropTypes.string,
      address: PropTypes.string
    })
  }).isRequired,
  layout: PropTypes.oneOf(['banner', 'card', 'minimal']),
  showBadges: PropTypes.bool,
  showDescription: PropTypes.bool,
  showLocation: PropTypes.bool,
  showDateTime: PropTypes.bool,
  customStyles: PropTypes.shape({
    container: PropTypes.object,
    badge: PropTypes.object
  }),
  onImageError: PropTypes.func,
  imageOptimization: PropTypes.bool
};

export default EventHero;