import React from 'react';

const LocationTab = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Location</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set the venue details and map location for your event
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Venue Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Venue Name *
          </label>
          <input
            type="text"
            value={formData.venue?.name || ''}
            onChange={(e) => handleInputChange('venue', { ...formData.venue, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Convention Center, Hotel Conference Room, Virtual Platform"
            required
          />
        </div>

        {/* Event Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Event Mode *
          </label>
          <select
            value={formData.mode || 'in-person'}
            onChange={(e) => handleInputChange('mode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="in-person">🏢 In-Person</option>
            <option value="virtual">💻 Virtual</option>
            <option value="hybrid">🔄 Hybrid</option>
          </select>
        </div>
      </div>

      {/* Address - Show only for in-person and hybrid events */}
      {(formData.mode === 'in-person' || formData.mode === 'hybrid') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Full Address *
          </label>
          <textarea
            value={formData.venue?.address || ''}
            onChange={(e) => handleInputChange('venue', { ...formData.venue, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 123 Main St, Suite 456, San Jose, CA 95110, USA"
            rows={3}
            required
          />
        </div>
      )}

      {/* Google Maps Integration */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Google Maps Embed URL
          </label>
          <input
            type="url"
            value={formData.venue?.mapEmbedUrl || ''}
            onChange={(e) => handleInputChange('venue', { ...formData.venue, mapEmbedUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Go to Google Maps → Find location → Share → Embed a map → Copy HTML (src attribute)
          </p>
        </div>

        {/* Map Preview */}
        {formData.venue?.mapEmbedUrl && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Map Preview</span>
            </div>
            <div className="w-full h-64">
              <iframe
                src={formData.venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Preview"
              />
            </div>
          </div>
        )}

        {/* Coordinates (Optional) */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Latitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.venue?.lat || ''}
              onChange={(e) => handleInputChange('venue', { ...formData.venue, lat: parseFloat(e.target.value) || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 37.3382"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Longitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              value={formData.venue?.lng || ''}
              onChange={(e) => handleInputChange('venue', { ...formData.venue, lng: parseFloat(e.target.value) || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., -121.8863"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTab;
