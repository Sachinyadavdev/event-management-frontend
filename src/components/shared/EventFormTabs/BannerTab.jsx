import React from 'react';

/**
 * BannerTab - Event banner and media management
 * @param {Object} formData - Current form data
 * @param {Function} handleInputChange - Handler for input changes
 * @param {string} bannerPreview - Banner preview URL
 * @param {Function} setBannerPreview - Set banner preview
 * @param {Object} bannerInputRef - Ref for file input
 * @param {Function} handleBannerUpload - Handle banner file upload
 */
const BannerTab = ({ 
  formData, 
  handleInputChange, 
  bannerPreview, 
  setBannerPreview, 
  bannerInputRef, 
  handleBannerUpload 
}) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Banner & Media</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Upload banner image and customize overlay settings</p>
          </div>
        </div>
        
        {/* Current Banner Preview with Overlay */}
        {bannerPreview && (
          <div className="mb-6">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={bannerPreview}
                alt="Event Banner Preview"
                className="w-full h-64 object-cover"
              />
              {/* Overlay Preview */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  backgroundColor: `${formData.bannerOverlay?.color || '#000000'}${Math.round((formData.bannerOverlay?.opacity || 0.3) * 255).toString(16).padStart(2, '0')}`
                }}
              >
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                    {formData.title || 'Sample Event Title'}
                  </h3>
                  <p className="text-lg drop-shadow-md">
                    {formData.hostedBy || 'Event Host'} • {formData.date ? new Date(formData.date).toLocaleDateString() : 'Event Date'}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Preview with overlay effect • Adjust overlay settings below
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-white/50 dark:bg-gray-800/50">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Choose Banner Image
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 10MB • Recommended: 1200x400px
          </p>
        </div>
      </div>

      {/* Banner URL Alternative */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          Or Enter Banner URL
        </label>
        <input
          type="url"
          value={formData.bannerUrl || ''}
          onChange={(e) => {
            handleInputChange('bannerUrl', e.target.value);
            setBannerPreview(e.target.value);
          }}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="https://example.com/banner.jpg"
        />
      </div>

      {/* Color Overlay Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Color Overlay Settings</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Enhance text readability over your banner image</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Overlay Color */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM1 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm13-1a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1h2z" clipRule="evenodd" />
                </svg>
              </div>
              Overlay Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.bannerOverlay?.color || '#000000'}
                onChange={(e) => handleInputChange('bannerOverlay', {
                  ...formData.bannerOverlay,
                  color: e.target.value
                })}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600 cursor-pointer bg-white dark:bg-gray-700"
                title="Choose overlay color"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.bannerOverlay?.color || '#000000'}
                  onChange={(e) => handleInputChange('bannerOverlay', {
                    ...formData.bannerOverlay,
                    color: e.target.value
                  })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            {/* Preset Color Options */}
            <div className="flex gap-2 mt-3">
              {[
                { color: '#000000', name: 'Black' },
                { color: '#ffffff', name: 'White' },
                { color: '#1f2937', name: 'Dark Gray' },
                { color: '#3b82f6', name: 'Blue' },
                { color: '#8b5cf6', name: 'Purple' },
                { color: '#ef4444', name: 'Red' }
              ].map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handleInputChange('bannerOverlay', {
                    ...formData.bannerOverlay,
                    color: preset.color
                  })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    formData.bannerOverlay?.color === preset.color
                      ? 'border-indigo-500 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Overlay Opacity */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              Overlay Opacity
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                {Math.round((formData.bannerOverlay?.opacity || 0.3) * 100)}%
              </span>
            </label>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.bannerOverlay?.opacity || 0.3}
              onChange={(e) => handleInputChange('bannerOverlay', {
                ...formData.bannerOverlay,
                opacity: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0% (No overlay)</span>
              <span>100% (Full overlay)</span>
            </div>

            {/* Opacity Presets */}
            <div className="flex gap-2 mt-3">
              {[
                { opacity: 0, label: 'None' },
                { opacity: 0.2, label: 'Light' },
                { opacity: 0.4, label: 'Medium' },
                { opacity: 0.6, label: 'Dark' }
              ].map((preset) => (
                <button
                  key={preset.opacity}
                  type="button"
                  onClick={() => handleInputChange('bannerOverlay', {
                    ...formData.bannerOverlay,
                    opacity: preset.opacity
                  })}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all duration-200 ${
                    Math.abs((formData.bannerOverlay?.opacity || 0.3) - preset.opacity) < 0.1
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800/30 flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Overlay Tips</h5>
              <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Use darker overlays for light images to improve text readability</li>
                <li>• Use lighter overlays or lower opacity for dark images</li>
                <li>• Preview how your event title and details will appear over the banner</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTab;