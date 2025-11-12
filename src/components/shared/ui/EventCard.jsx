import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';

const EventCard = ({ 
  event, 
  userType = 'guest', // admin, member, guest
  context = 'default', // home, dashboard, admin, member
  showSpeakers = true, 
  showSponsors = true, 
  showTags = true,
  showActions = true,
  onEdit = null,
  onDelete = null,
  onRegister = null,
  className = "" 
}) => {
  // Helper function to strip HTML tags and truncate text
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    
    // Create a temporary DOM element to properly parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Extract plain text content
    let plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace
    plainText = plainText.replace(/\s+/g, ' ').trim();
    
    // Truncate if necessary
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Helper function to determine if user can register
  const canRegister = () => {
    if (userType === 'admin') return false; // Admins don't register
    if (context === 'member' && event.registrationStatus === 'registered') return false;
    // Don't allow registration for completed or ongoing events
    if (event.status === 'completed' || event.status === 'ongoing') return false;
    return true;
  };

  // Helper function to format price for badge (concise)
  const formatPriceBadge = () => {
    if (!event.price) return 'Paid';
    
    // Handle object price structure {member, nonMember}
    if (typeof event.price === 'object' && event.price.member !== undefined) {
      const memberPrice = event.price.member === 0 ? 'Free' : `$${event.price.member}`;
      const nonMemberPrice = event.price.nonMember === 0 ? 'Free' : `$${event.price.nonMember}`;
      
      if (userType === 'member') {
        return memberPrice;
      } else {
        // For guests, show the lower price to be more attractive
        if (event.price.member === 0) return 'Free for Members';
        return `From $${Math.min(event.price.member, event.price.nonMember)}`;
      }
    }
    
    // Handle legacy string/number price
    if (typeof event.price === 'string') return event.price;
    if (typeof event.price === 'number') return event.price === 0 ? 'Free' : `$${event.price}`;
    
    return 'Paid';
  };

  // Helper function to format price for details (full)
  const formatPrice = () => {
    if (!event.price) return 'Contact for pricing';
    
    // Handle object price structure {member, nonMember}
    if (typeof event.price === 'object' && event.price.member !== undefined) {
      const memberPrice = event.price.member === 0 ? 'Free' : `$${event.price.member}`;
      const nonMemberPrice = event.price.nonMember === 0 ? 'Free' : `$${event.price.nonMember}`;
      
      if (userType === 'member') {
        return memberPrice;
      } else {
        return `${memberPrice} Members, ${nonMemberPrice} Non-Members`;
      }
    }
    
    // Handle legacy string/number price
    if (typeof event.price === 'string') return event.price;
    if (typeof event.price === 'number') return event.price === 0 ? 'Free' : `$${event.price}`;
    
    return 'Contact for pricing';
  };

  // Helper function to determine if event is free
  const isFree = () => {
    if (event.priceType === 'Free') return true;
    if (typeof event.price === 'object' && event.price.member !== undefined) {
      return event.price.member === 0 && event.price.nonMember === 0;
    }
    return event.price === 0 || event.price === 'Free';
  };

  // Helper function to get appropriate button text
  const getRegisterButtonText = () => {
    // Don't show register button for completed or ongoing events
    if (isEventPast() || isEventOngoing()) return null;
    
    if (userType === 'guest') return 'Apply Now';
    if (userType === 'member') {
      if (event.registrationStatus === 'registered') return 'Registered';
      if (isFree()) return 'Register Free';
      return 'Register Now';
    }
    return 'Apply Now';
  };

  // Helper function to check if event is past/completed
  const isEventPast = () => {
    // Use status field if available (more accurate)
    if (event.status) {
      return event.status === 'completed';
    }
    // Fallback to date comparison for legacy events
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate < today;
  };

  // Helper function to check if event is ongoing
  const isEventOngoing = () => {
    return event.status === 'ongoing';
  };

  // Default fallback image - cybersecurity themed
  const fallbackImage = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center";

  if (!event) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group ${className}`}>
      {/* Event Banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.bannerImage || event.image || fallbackImage} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {/* Mode Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            event.mode === 'Virtual' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {event.mode}
          </span>
          
          {/* Price Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isFree()
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-300'
          }`}>
            {isFree() ? 'Free' : formatPriceBadge()}
          </span>
        </div>

        {/* CP Score Badge */}
        {(event.cpScore || event.cpe) && (
          <div className="absolute top-4 right-4">
            <div className="bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {event.cpScore || event.cpe} CP
            </div>
          </div>
        )}

        {/* Date Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
          <div className="text-sm font-semibold">
            {formatDate(event.date)}
          </div>
          {event.time && (
            <div className="text-xs opacity-90">
              {formatTime(event.time)}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Hosted By */}
        {event.hostedBy && (
          <p className="text-sm text-gray-600 mb-3">
            Hosted by <span className="font-semibold text-blue-600">{event.hostedBy}</span>
          </p>
        )}

        {/* Location & Venue */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.venue || event.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(event.description)}
        </p>

        {/* Speakers Section */}
        {showSpeakers && event.speakers && event.speakers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Speakers</h4>
            <div className="flex items-center space-x-3">
              {event.speakers.slice(0, 2).map((speaker, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <img 
                    src={speaker.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"} 
                    alt={speaker.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face";
                    }}
                  />
                  <span className="text-xs text-gray-600 font-medium">{speaker.name}</span>
                </div>
              ))}
              {event.speakers.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">+{event.speakers.length - 2} more</span>
              )}
            </div>
          </div>
        )}

        {/* Sponsors Section */}
        {showSponsors && event.sponsors && event.sponsors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Sponsors</h4>
            <div className="flex items-center gap-3 flex-wrap">
              {event.sponsors.slice(0, 3).map((sponsor, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center"
                  title={sponsor.name}
                >
                  {sponsor.logo ? (
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name}
                      className="max-h-6 max-w-[60px] object-contain opacity-70 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        // Replace image with text if it fails to load
                        const parent = e.target.parentNode;
                        e.target.remove();
                        const textSpan = document.createElement('span');
                        textSpan.className = 'text-xs font-semibold text-gray-600 truncate';
                        textSpan.textContent = sponsor.name.length > 8 ? sponsor.name.substring(0, 8) + '...' : sponsor.name;
                        parent.appendChild(textSpan);
                      }}
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-600 truncate">
                      {sponsor.name.length > 8 ? sponsor.name.substring(0, 8) + '...' : sponsor.name}
                    </span>
                  )}
                </div>
              ))}
              {event.sponsors.length > 3 && (
                <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">+{event.sponsors.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {showTags && event.tags && event.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-blue-600 text-xs rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Conditional Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {/* Admin Actions */}
            {userType === 'admin' && (
              <>
                <Button 
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => onEdit && onEdit(event)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => onDelete && onDelete(event)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </>
            )}

            {/* Member/Guest Registration Actions */}
            {(userType === 'member' || userType === 'guest') && canRegister() && !isEventPast() && !isEventOngoing() && (
              <Button 
                className={`flex-1 font-semibold transition-colors ${
                  event.registrationStatus === 'registered' 
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={event.registrationStatus === 'registered'}
                onClick={() => onRegister ? onRegister(event) : console.log('Register clicked for event:', event.id)}
              >
                {event.registrationStatus === 'registered' ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Registered
                  </>
                ) : (
                  getRegisterButtonText()
                )}
              </Button>
            )}

            {/* Event Status Indicators */}
            {isEventPast() && (
              <div className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium text-sm">
                Event Completed
              </div>
            )}

            {isEventOngoing() && (
              <div className="flex-1 text-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium text-sm">
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Event in Progress
                </span>
              </div>
            )}

            {/* View Details Link - Always Available */}
            <Link 
              to={`/events/${event.slug || event.id}`}
              className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors font-medium text-sm"
            >
              View Details
            </Link>
          </div>
        )}

        {/* Context-specific Status Indicators */}
        {context === 'member' && (
          <div className="pt-2 text-xs text-gray-500 text-center">
            {event.registrationStatus === 'registered' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                You're registered
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;