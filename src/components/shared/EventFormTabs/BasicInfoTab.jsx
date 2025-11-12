import React, { useState } from 'react';
import { formatDateForInput, formatTimeForInput, combineDateAndTime, debugDate, cleanDateString } from '../../../utils/dateUtils';

/**
 * TagsInput - Interactive tags input component
 * @param {Array} tags - Current tags array
 * @param {Function} onChange - Handler for tags change
 * @param {string} placeholder - Input placeholder text
 */
const TagsInput = ({ tags = [], onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagText) => {
    const newTag = tagText.trim();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent min-h-[48px]">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Existing Tags */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 focus:outline-none"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        
        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

/**
 * BasicInfoTab - Basic event information form
 * @param {Object} formData - Current form data
 * @param {Function} handleInputChange - Handler for input changes
 */
const BasicInfoTab = ({ formData, handleInputChange }) => {
  console.log('BasicInfoTab rendered with:', { formData, handleInputChange: typeof handleInputChange });
  
  return (
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
            onChange={(e) => {
              console.log('Title input onChange triggered:', e.target.value);
              console.log('handleInputChange function:', typeof handleInputChange);
              if (typeof handleInputChange === 'function') {
                handleInputChange('title', e.target.value);
                console.log('handleInputChange called successfully');
              } else {
                console.error('handleInputChange is not a function!');
              }
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            value={formData.status || 'upcoming'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Event Category
          </label>
          <select
            value={formData.category || 'panel'}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="panel">Panel Discussion</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="networking">Networking</option>
            <option value="training">Training</option>
            <option value="conference">Conference</option>
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
            value={formatDateForInput(formData.startsAt)}
            onChange={(e) => {
              const selectedDate = e.target.value; // YYYY-MM-DD format
              const currentTime = formatTimeForInput(formData.startsAt) || '00:00';
              const newDateTime = combineDateAndTime(selectedDate, currentTime);
              
              console.log('🗓️ DATE INPUT CHANGE:');
              console.log('- Selected date:', selectedDate);
              console.log('- Current time:', currentTime);
              console.log('- New datetime:', newDateTime);
              console.log('- Form data startsAt before:', formData.startsAt);
              
              debugDate('Date Input Changed', newDateTime);
              handleInputChange('startsAt', newDateTime);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            value={formatTimeForInput(formData.startsAt)}
            onChange={(e) => {
              const selectedTime = e.target.value; // HH:MM format
              const currentDate = formatDateForInput(formData.startsAt) || '2025-01-01';
              const newDateTime = combineDateAndTime(currentDate, selectedTime);
              
              console.log('⏰ TIME INPUT CHANGE:');
              console.log('- Selected time:', selectedTime);
              console.log('- Current date:', currentDate);
              console.log('- New datetime:', newDateTime);
              
              debugDate('Time Input Changed', newDateTime);
              handleInputChange('startsAt', newDateTime);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Zoom Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.virtualLinks?.zoom || ''}
                  onChange={(e) => handleInputChange('zoom', e.target.value, 'virtualLinks')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://zoom.us/j/123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Google Meet Link
                </label>
                <input
                  type="url"
                  value={formData.virtualLinks?.googleMeet || ''}
                  onChange={(e) => handleInputChange('googleMeet', e.target.value, 'virtualLinks')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Microsoft Teams Link
                </label>
                <input
                  type="url"
                  value={formData.virtualLinks?.teams || ''}
                  onChange={(e) => handleInputChange('teams', e.target.value, 'virtualLinks')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://teams.microsoft.com/l/meetup-join/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Other Platform Link
                </label>
                <input
                  type="url"
                  value={formData.virtualLinks?.other || ''}
                  onChange={(e) => handleInputChange('other', e.target.value, 'virtualLinks')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://your-platform.com/meeting"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Meeting Password (Optional)
              </label>
              <input
                type="text"
                value={formData.virtualLinks?.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value, 'virtualLinks')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Meeting password if required"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Virtual Instructions
              </label>
              <textarea
                value={formData.virtualLinks?.instructions || ''}
                onChange={(e) => handleInputChange('instructions', e.target.value, 'virtualLinks')}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Special instructions for virtual attendees (e.g., download requirements, early join time, etc.)"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Privacy Note:</strong> These virtual meeting links will only be visible to registered attendees after they complete registration.
              </p>
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
            onChange={(e) => handleInputChange('member', parseInt(e.target.value) || 0, 'price')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            onChange={(e) => handleInputChange('nonMember', parseInt(e.target.value) || 0, 'price')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Event Tags
          </label>
          <TagsInput 
            tags={formData.tags || []}
            onChange={(tags) => handleInputChange('tags', tags)}
            placeholder="e.g., Cybersecurity, AI, Panel"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Type and press Enter or comma to add tags. Click × to remove.
          </p>
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
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Detailed event description..."
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Updates both the display text and HTML version automatically
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;
