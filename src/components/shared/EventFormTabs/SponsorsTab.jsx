import React from 'react';

const SponsorsTab = ({ formData, handleArrayAdd, handleArrayUpdate, handleArrayRemove }) => {
  
  // Handle sponsor logo upload
  const handleLogoUpload = async (event, sponsor, index) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('sponsorLogo', file);

      console.log('🏢 Uploading sponsor logo:', file.name);

      const response = await fetch('http://localhost:5000/api/upload/sponsor', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Logo uploaded successfully:', result.data.fullUrl);
        // Update the sponsor with the uploaded logo URL
        handleArrayUpdate('sponsors', index, { 
          ...sponsor, 
          logo: result.data.fullUrl || result.data.url 
        });
      } else {
        console.error('❌ Logo upload failed:', result.message);
        alert(`Failed to upload logo: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Logo upload error:', error);
      alert('Failed to upload logo. Please try again.');
    }
  };
  return (
    <div className="p-6 space-y-6 pb-8">
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Sponsors</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage sponsor information and recognition levels</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleArrayAdd('sponsors', {
              id: Date.now().toString(),
              name: '',
              logo: '',
              level: 'gold',
              website: '',
              customLabel: ''
            })}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sponsor
          </button>
        </div>

        {/* Show message when no sponsors */}
        {(!formData.sponsors || formData.sponsors.length === 0) && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30">
                <svg className="w-8 h-8 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sponsors added yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Start building your sponsor list by adding companies and organizations supporting this event.
              </p>
              <button
                type="button"
                onClick={() => handleArrayAdd('sponsors', {
                  id: Date.now().toString(),
                  name: '',
                  logo: '',
                  level: 'gold',
                  website: '',
                  customLabel: ''
                })}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Add Your First Sponsor
              </button>
            </div>
          </div>
        )}
        
        {/* Sponsors List */}
        <div className="grid gap-6">
          {(formData.sponsors || []).map((sponsor, index) => (
            <div key={sponsor.id || index} className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              {/* Sponsor Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {/* Sponsor Level Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    sponsor.level === 'platinum' 
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300' 
                      : sponsor.level === 'gold'
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
                      : sponsor.level === 'silver'
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-400'
                      : sponsor.level === 'bronze'
                      ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300'
                      : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
                  }`}>
                    {sponsor.level === 'custom' && sponsor.customLabel 
                      ? sponsor.customLabel.toUpperCase()
                      : (sponsor.level || 'gold').toUpperCase()
                    }
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {sponsor.name || 'Unnamed Sponsor'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sponsor #{index + 1}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleArrayRemove('sponsors', index)}
                  className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  title="Remove this sponsor"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Sponsor Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Sponsor Name *
                    </label>
                    <input
                      type="text"
                      value={sponsor.name || ''}
                      onChange={(e) => handleArrayUpdate('sponsors', index, { ...sponsor, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Microsoft"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-100 dark:bg-yellow-800/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Sponsorship Level
                    </label>
                    <select
                      value={sponsor.level || 'gold'}
                      onChange={(e) => handleArrayUpdate('sponsors', index, { ...sponsor, level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="platinum">🏆 Platinum Sponsor</option>
                      <option value="gold">🥇 Gold Sponsor</option>
                      <option value="silver">🥈 Silver Sponsor</option>
                      <option value="bronze">🥉 Bronze Sponsor</option>
                      <option value="custom">✨ Custom Label</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Custom Sponsor Label
                    </label>
                    <input
                      type="text"
                      value={sponsor.customLabel || ''}
                      onChange={(e) => handleArrayUpdate('sponsors', index, { ...sponsor, customLabel: e.target.value })}
                      className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        sponsor.level === 'custom' ? 'border-purple-300 dark:border-purple-600' : 'opacity-75'
                      }`}
                      placeholder="e.g., Title Sponsor, Presenting Partner, Media Partner, etc."
                      disabled={sponsor.level !== 'custom'}
                    />
                    {sponsor.level === 'custom' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This custom label will be displayed instead of the standard level
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={sponsor.website || ''}
                      onChange={(e) => handleArrayUpdate('sponsors', index, { ...sponsor, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      <div className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-800/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Sponsor Logo
                    </label>
                    
                    {/* Logo Upload Section */}
                    <div className="space-y-3">
                      {/* Current Logo Preview */}
                      {sponsor.logo && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-3">
                            <img
                              src={sponsor.logo}
                              alt={`${sponsor.name} logo`}
                              className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-600 bg-white"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Current Logo</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                                {sponsor.logo}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleArrayUpdate('sponsors', index, { ...sponsor, logo: '' })}
                            className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                            title="Remove logo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {/* File Upload Input */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, sponsor, index)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id={`logo-upload-${index}`}
                        />
                        <label
                          htmlFor={`logo-upload-${index}`}
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG, WebP (MAX. 2MB)</p>
                          </div>
                        </label>
                      </div>
                      
                      {/* URL Input Alternative */}
                      <div className="text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
                      </div>
                      <input
                        type="url"
                        value={sponsor.logo || ''}
                        onChange={(e) => handleArrayUpdate('sponsors', index, { ...sponsor, logo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  {/* Logo Preview */}
                  {sponsor.logo && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Logo Preview:</p>
                      <div className="w-32 h-20 border border-gray-200 dark:border-gray-600 rounded-lg p-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-sm">
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name || 'Sponsor'} logo`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="text-xs text-gray-400 hidden">Logo not found</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsTab;
