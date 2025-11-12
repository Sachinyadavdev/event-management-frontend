import React, { useState } from 'react';

const SpeakersTab = ({ formData, handleArrayAdd, handleArrayUpdate, handleArrayRemove }) => {
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState(null);
  
  // Handle speaker photo upload
  const handleSpeakerPhotoUpload = async (event, speakerIndex) => {
    console.log('🔍 Upload function called with:', { event, speakerIndex, eventFiles: event.target.files });
    const file = event.target.files?.[0];
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      console.log('📸 Uploading speaker photo:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      console.log('📸 Debug - speakerIndex:', speakerIndex, 'formData.speakers:', formData.speakers);
      
      // Set loading state
      setUploadingPhotoIndex(speakerIndex);
      
      // Create form data for upload
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('type', 'speaker-photo');
      
      console.log('📤 Sending upload request with type: speaker-photo');
      console.log('📤 FormData entries:', Array.from(uploadFormData.entries()));

      // Upload to backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.url) {
        console.log('✅ Speaker photo uploaded successfully:', result.data.fullUrl);
        
        // Update speaker photo in form data - use fullUrl for complete path
        const speakers = formData.speakers || [];
        if (speakers[speakerIndex]) {
          const currentSpeaker = speakers[speakerIndex];
          handleArrayUpdate('speakers', speakerIndex, { 
            ...currentSpeaker, 
            photo: result.data.fullUrl || `http://localhost:5000${result.data.url}`
          });
        } else {
          console.error('❌ Speaker not found at index:', speakerIndex, 'Available speakers:', speakers.length);
          throw new Error('Speaker not found');
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Speaker photo upload error:', error);
      alert(`Failed to upload photo: ${error.message}`);
    } finally {
      // Clear loading state
      setUploadingPhotoIndex(null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section with Proper Spacing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Speakers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add speakers who will present at your event
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => handleArrayAdd('speakers', {
                id: Date.now().toString(),
                name: '',
                title: '',
                company: '',
                photo: '',
                bio: '',
                linkedin: ''
              })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-lg border border-indigo-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Speaker
            </button>
          </div>
        </div>
      </div>

      {/* Show message when no speakers */}
      {(!formData.speakers || formData.speakers.length === 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 m-6">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4">No speakers added yet</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Add Speaker" to start adding your event speakers</p>
          </div>
        </div>
      )}
      
      {/* Speakers List */}
      <div className="grid gap-6">
        {(formData.speakers || []).map((speaker, index) => (
          <div key={speaker.id || index} className="relative border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow">
            {/* Speaker Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Speaker {index + 1}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {speaker.name || 'Unnamed Speaker'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleArrayRemove('speakers', index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                title="Remove this speaker"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Speaker Details */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={speaker.name || ''}
                    onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Alex Kumar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={speaker.title || ''}
                    onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Chief Security Officer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company
                  </label>
                  <input
                    type="text"
                    value={speaker.company || ''}
                    onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., TechCorp Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Profile Photo
                  </label>
                  
                  {/* Photo Preview */}
                  {speaker.photo && (
                    <div className="mb-3">
                      <img 
                        src={speaker.photo} 
                        alt={`${speaker.name || 'Speaker'} profile`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor={`speaker-photo-${index}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md border-0 ${
                          uploadingPhotoIndex === index 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02]'
                        }`}
                      >
                        {uploadingPhotoIndex === index ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                        {uploadingPhotoIndex === index 
                          ? 'Uploading...' 
                          : speaker.photo 
                            ? 'Change Photo' 
                            : 'Upload Photo'
                        }
                      </label>
                      {uploadingPhotoIndex === index && (
                        <input
                          type="file"
                          id={`speaker-photo-${index}`}
                          accept="image/*"
                          disabled
                          className="hidden"
                        />
                      )}
                      {uploadingPhotoIndex !== index && (
                        <input
                          type="file"
                          id={`speaker-photo-${index}`}
                          accept="image/*"
                          onChange={(e) => handleSpeakerPhotoUpload(e, index)}
                          className="hidden"
                        />
                      )}
                    </div>
                    
                    {/* Or URL Input */}
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Or paste photo URL:</div>
                      <input
                        type="url"
                        value={speaker.photo || ''}
                        onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, photo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={speaker.linkedin || ''}
                  onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Biography
                </label>
                <textarea
                  value={speaker.bio || ''}
                  onChange={(e) => handleArrayUpdate('speakers', index, { ...speaker, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Write a brief biography about the speaker, their expertise, and background..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakersTab;
