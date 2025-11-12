import React, { useState, useEffect, useRef } from 'react';

// EventForm component that matches exactly the structure of EventDetails EditEventModal
const EventForm = ({ initialData, onSubmit, onCancel, submitButtonText = "Create Event" }) => {
  const [formData, setFormData] = useState(initialData);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      // Normalize the event data structure for the form
      const normalizedData = {
        ...initialData,
        // Ensure price is in the expected object format
        price: typeof initialData.price === 'object' && initialData.price !== null 
          ? initialData.price 
          : { 
              member: initialData.price || 0, 
              nonMember: initialData.price || 0 
            },
        // Ensure maxCapacity exists (fallback from capacity)
        maxCapacity: initialData.maxCapacity || initialData.capacity || 0,
        // Ensure shortDescription is populated for editing (prioritize descriptionHtml content)
        shortDescription: initialData.descriptionHtml || initialData.shortDescription || '',
        // Ensure sponsors array is properly initialized
        sponsors: initialData.sponsors || [],
        // Ensure venue object is properly initialized
        venue: initialData.venue || { name: '', address: '', mapEmbedUrl: '', lat: null, lng: null },
        // Ensure virtualLinks object is properly initialized
        virtualLinks: initialData.virtualLinks || { zoom: '', googleMeet: '', teams: '', other: '', password: '', instructions: '' },
        // Ensure notifications array is properly initialized
        notifications: initialData.notifications || [],
        // Ensure banner overlay settings are properly initialized
        bannerOverlay: initialData.bannerOverlay || { color: '#000000', opacity: 0.3 },
        // Ensure agenda and speakers are initialized
        agenda: initialData.agenda || [],
        speakers: initialData.speakers || [],
        // Ensure tags is an array
        tags: initialData.tags || []
      };
      
      setFormData(normalizedData);
      setBannerPreview(initialData?.bannerUrl || null);
    } else {
      // Initialize with default structure for new events
      setFormData({
        title: '',
        hostedBy: 'ISACA Silicon Valley',
        status: 'draft',
        category: 'workshop',
        startsAt: '',
        endsAt: '',
        mode: 'in_person',
        venue: { name: '', address: '', mapEmbedUrl: '', lat: null, lng: null },
        virtualLinks: { zoom: '', googleMeet: '', teams: '', other: '', password: '', instructions: '' },
        price: { member: 0, nonMember: 0 },
        maxCapacity: 0,
        cpScore: 0,
        tags: [],
        shortDescription: '',
        descriptionHtml: '',
        bannerUrl: '',
        bannerOverlay: { color: '#000000', opacity: 0.3 },
        agenda: [],
        speakers: [],
        sponsors: [],
        notifications: [],
        featured: false,
        allowPhotography: true,
        codeOfConduct: true,
        isPaid: false,
        visibility: 'public'
      });
    }
    setIsAnimating(true);
  }, [initialData]);

  const handleInputChange = (field, value, nested = null) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setBannerPreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          bannerUrl: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayAdd = (arrayName, newItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const handleArrayUpdate = (arrayName, index, updatedItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const handleArrayRemove = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    // Basic validation
    if (!formData.title || !formData.hostedBy || !formData.startsAt || !formData.shortDescription) {
      alert('Please fill in all required fields (Title, Hosted By, Date, and Description)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false); // Re-enable submit if there's an error
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 flex-shrink-0 shadow-sm">
        <nav className="flex space-x-1">
          {[
            { id: 'basic', label: 'Basic Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'banner', label: 'Banner & Media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'location', label: 'Location', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'agenda', label: 'Agenda', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'speakers', label: 'Speakers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { id: 'sponsors', label: 'Sponsors', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { id: 'notifications', label: 'Event Updates', icon: 'M15 17h5l-5 5v-5zM4.828 4.828A10.015 10.015 0 004 10c0 5.523 4.477 10 10 10a10.015 10.015 0 005.172-.828l-1.414-1.414A8.015 8.015 0 0115 18a8 8 0 01-8-8 8.015 8.015 0 011.414-3.758L4.828 4.828zM9 1l-2 2h10l-2-2H9z' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 px-4 font-medium text-sm flex items-center gap-2 transition-all duration-200 rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              <div className={`flex items-center justify-center w-5 h-5 rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-100 dark:bg-blue-800/50' 
                  : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-600'
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6 pb-8">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Hosted By *
                </label>
                <input
                  type="text"
                  value={formData.hostedBy || ''}
                  onChange={(e) => handleInputChange('hostedBy', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Status and Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Event Status *
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Event Category
                </label>
                <select
                  value={formData.category || 'workshop'}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="meeting">Meeting</option>
                  <option value="conference">Conference</option>
                  <option value="networking">Networking</option>
                  <option value="training">Training</option>
                  <option value="panel">Panel Discussion</option>
                </select>
              </div>
            </div>

            {/* Date and Duration */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.startsAt?.split('T')[0] || ''}
                  onChange={(e) => handleInputChange('startsAt', `${e.target.value}T${formData.startsAt?.split('T')[1] || '00:00:00'}`)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startsAt?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleInputChange('startsAt', `${formData.startsAt?.split('T')[0] || '2025-01-01'}T${e.target.value}:00`)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endsAt?.split('T')[1]?.substring(0, 5) || ''}
                  onChange={(e) => handleInputChange('endsAt', `${formData.startsAt?.split('T')[0] || '2025-01-01'}T${e.target.value}:00`)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Venue Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Venue Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venue?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value, 'venue')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Mode *
                  </label>
                  <select
                    value={formData.mode || 'in_person'}
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="in_person">In-Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={formData.venue?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value, 'venue')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 Main St, San Jose, CA 95110"
                  />
                </div>
              </div>
            </div>

            {/* Virtual Meeting Links - Only show when mode is virtual or hybrid */}
            {(formData.mode === 'virtual' || formData.mode === 'hybrid') && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Virtual Meeting Links</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Add meeting links for registered attendees</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Zoom Meeting Link
                      </label>
                      <input
                        type="url"
                        value={formData.virtualLinks?.zoom || ''}
                        onChange={(e) => handleInputChange('zoom', e.target.value, 'virtualLinks')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://zoom.us/j/123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Google Meet Link
                      </label>
                      <input
                        type="url"
                        value={formData.virtualLinks?.googleMeet || ''}
                        onChange={(e) => handleInputChange('googleMeet', e.target.value, 'virtualLinks')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://meet.google.com/abc-defg-hij"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Microsoft Teams Link
                      </label>
                      <input
                        type="url"
                        value={formData.virtualLinks?.teams || ''}
                        onChange={(e) => handleInputChange('teams', e.target.value, 'virtualLinks')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://teams.microsoft.com/l/meetup-join/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Other Platform Link
                      </label>
                      <input
                        type="url"
                        value={formData.virtualLinks?.other || ''}
                        onChange={(e) => handleInputChange('other', e.target.value, 'virtualLinks')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-platform.com/meeting"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Meeting Password (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.virtualLinks?.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value, 'virtualLinks')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Meeting password if required"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Virtual Instructions
                    </label>
                    <textarea
                      value={formData.virtualLinks?.instructions || ''}
                      onChange={(e) => handleInputChange('instructions', e.target.value, 'virtualLinks')}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Special instructions for virtual attendees (e.g., download requirements, early join time, etc.)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing and Capacity */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Member Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price?.member || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange('member', value, 'price');
                    handleInputChange('isPaid', value > 0 || formData.price?.nonMember > 0);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Non-Member Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price?.nonMember || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange('nonMember', value, 'price');
                    handleInputChange('isPaid', value > 0 || formData.price?.member > 0);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Max Attendees
                </label>
                <input
                  type="number"
                  value={formData.maxCapacity || 0}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handleInputChange('maxCapacity', value);
                    handleInputChange('capacity', value); // Keep both fields in sync
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            {/* CPE and Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  CPE Hours
                </label>
                <input
                  type="number"
                  value={formData.cpScore || 0}
                  onChange={(e) => handleInputChange('cpScore', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Event Tags
                </label>
                <input
                  type="text"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cybersecurity, AI, Panel"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Event Description *
              </label>
              <textarea
                value={formData.shortDescription || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('shortDescription', value);
                  // Also update descriptionHtml to sync both fields
                  handleInputChange('descriptionHtml', `<p>${value.split('\n').join('</p><p>')}</p>`);
                }}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Detailed event description..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Updates both the display text and HTML version automatically
              </p>
            </div>
          </div>
        )}

        {/* Continue with other tabs in next part... */}
      </form>
    </div>
  );
};

export default EventForm;