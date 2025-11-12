/**
 * VirtualMeetingLinks.jsx - Reusable Virtual Meeting Access Component
 * 
 * Features:
 * - Platform-extensible (Zoom, Teams, Google Meet, WebEx, etc.)
 * - Access control based on user registration status
 * - Security notices and best practices
 * - Customizable styling and branding
 * - Integration-ready for different meeting providers
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const VirtualMeetingLinks = ({ 
  event, 
  userRegistered = false,
  showAccessControl = true,
  platforms = ['zoom', 'teams', 'googlemeet'],
  customStyles = {},
  securityNotices = true,
  onLinkClick,
  expandable = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!expandable);

  // Default meeting data structure
  const defaultMeetingData = {
    zoom: {
      name: 'Zoom Meeting',
      url: event.virtualMeetingLinks?.zoom?.url || '#',
      meetingId: event.virtualMeetingLinks?.zoom?.meetingId || '123 456 7890',
      passcode: event.virtualMeetingLinks?.zoom?.passcode || 'SecureEvent2025',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
      textColor: 'text-white'
    },
    teams: {
      name: 'Microsoft Teams',
      url: event.virtualMeetingLinks?.teams?.url || '#',
      meetingId: event.virtualMeetingLinks?.teams?.meetingId || '456 789 123',
      passcode: event.virtualMeetingLinks?.teams?.passcode || 'TeamsSecure2025',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.625 15.188V8.813c0-.898-.438-1.688-1.125-2.188L12.75 2.25c-.438-.313-.938-.313-1.375 0l-6.75 4.375c-.688.5-1.125 1.29-1.125 2.188v6.375c0 .898.438 1.688 1.125 2.188l6.75 4.375c.438.313.938.313 1.375 0l6.75-4.375c.688-.5 1.125-1.29 1.125-2.188z"/>
        </svg>
      ),
      color: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
      textColor: 'text-white'
    },
    googlemeet: {
      name: 'Google Meet',
      url: event.virtualMeetingLinks?.googlemeet?.url || '#',
      meetingId: event.virtualMeetingLinks?.googlemeet?.meetingId || 'abc-defg-hij',
      passcode: event.virtualMeetingLinks?.googlemeet?.passcode || 'GoogleMeet2025',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.568 14.432c-.184.234-.484.374-.8.374H7.232c-.316 0-.616-.14-.8-.374L4.8 12l1.632-2.432c.184-.234.484-.374.8-.374h9.536c.316 0 .616.14.8.374L19.2 12l-1.632 2.432z"/>
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700 border-green-500',
      textColor: 'text-white'
    },
    webex: {
      name: 'WebEx',
      url: event.virtualMeetingLinks?.webex?.url || '#',
      meetingId: event.virtualMeetingLinks?.webex?.meetingId || '2345 678 901',
      passcode: event.virtualMeetingLinks?.webex?.passcode || 'WebExSecure2025',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      color: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
      textColor: 'text-white'
    }
  };

  const handleLinkClick = (platform, url) => {
    if (onLinkClick) {
      onLinkClick(platform, url, event);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderPlatformLink = (platformKey) => {
    const platform = defaultMeetingData[platformKey];
    if (!platform || !platforms.includes(platformKey)) return null;

    return (
      <div 
        key={platformKey}
        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
        style={customStyles.platformContainer}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${platform.color.split(' ')[0]} ${platform.color.split(' ')[0].replace('bg-', 'bg-opacity-10')}`}>
              <div className={`${platform.color.split(' ')[0].replace('bg-', 'text-')}`}>
                {platform.icon}
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {platform.name}
            </h4>
          </div>
          
          <button
            onClick={() => handleLinkClick(platformKey, platform.url)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${platform.color} ${platform.textColor} shadow-md hover:shadow-lg transform hover:scale-105`}
            style={customStyles.joinButton}
          >
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Join {platform.name.split(' ')[0]}
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Meeting ID:</span>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-gray-100 font-mono">
              {platform.meetingId}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Passcode:</span>
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-gray-100 font-mono">
              {platform.passcode}
            </code>
          </div>
        </div>
      </div>
    );
  };

  const renderAccessControl = () => {
    if (!showAccessControl) return null;

    if (!userRegistered) {
      return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Registration Required
          </h3>
          <p className="text-amber-700 dark:text-amber-300">
            Please register for this event to access the virtual meeting links.
          </p>
        </div>
      );
    }

    return null;
  };

  const renderSecurityNotices = () => {
    if (!securityNotices || !userRegistered) return null;

    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Security Notice</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• These meeting links are exclusive to registered attendees</li>
              <li>• Please do not share them publicly</li>
              <li>• Join the meeting 15 minutes early for a tech check</li>
              <li>• Download the respective app for the best experience</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Don't render if event is not virtual/hybrid
  if (event.mode === 'In Person') {
    return null;
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
      style={customStyles.container}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Virtual Meeting Access
          </h3>
        </div>
        
        {expandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Access Control */}
      {renderAccessControl()}

      {/* Meeting Links */}
      {userRegistered && isExpanded && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {platforms.map(platform => renderPlatformLink(platform))}
          </div>
          
          {/* Meeting Password Display */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-yellow-800 dark:text-yellow-200">Meeting Password</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Use the passcode provided for each platform when prompted during login.
            </p>
          </div>

          {/* Special Instructions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Special Instructions
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please join the meeting 15 minutes early for a tech check. Download the Zoom app 
              for the best experience. The session will be recorded for registered attendees who 
              cannot attend live.
            </p>
          </div>

          {/* Security Notices */}
          {renderSecurityNotices()}
        </div>
      )}
    </div>
  );
};

VirtualMeetingLinks.propTypes = {
  event: PropTypes.shape({
    mode: PropTypes.oneOf(['In Person', 'Virtual', 'Hybrid']).isRequired,
    virtualMeetingLinks: PropTypes.object
  }).isRequired,
  userRegistered: PropTypes.bool,
  showAccessControl: PropTypes.bool,
  platforms: PropTypes.arrayOf(PropTypes.oneOf(['zoom', 'teams', 'googlemeet', 'webex'])),
  customStyles: PropTypes.shape({
    container: PropTypes.object,
    platformContainer: PropTypes.object,
    joinButton: PropTypes.object
  }),
  securityNotices: PropTypes.bool,
  onLinkClick: PropTypes.func,
  expandable: PropTypes.bool
};

export default VirtualMeetingLinks;