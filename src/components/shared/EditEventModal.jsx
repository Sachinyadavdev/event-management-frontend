import React, { useState, useEffect, useRef } from 'react';
import {
  BasicInfoTab,
  BannerTab,
  LocationTab,
  AgendaTab,
  SpeakersTab,
  SponsorsTab,
  NotificationsTab
} from './EventFormTabs';

/**
 * EditEventModal - Reusable event creation/editing modal
 * Used in both Admin Panel and Public Event Details pages
 * Extracted from EventDetails.jsx to ensure consistent form structure
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSave - Callback when event is saved, receives formData
 * @param {Object} props.event - Event data for editing (null for create mode)
 * @param {string} props.mode - 'create' or 'edit'
 */
const EditEventModal = ({ isOpen, onClose, onSave, event = null, mode = 'create' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [bannerPreview, setBannerPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bannerInputRef = useRef(null);

  // Initialize form data
  const [formData, setFormData] = useState({
    title: '',
    hostedBy: '',
    status: 'upcoming',
    category: 'panel',
    startsAt: '',
    endsAt: '',
    mode: 'in_person',
    venue: {
      name: '',
      address: '',
      mapEmbedUrl: '',
      lat: null,
      lng: null
    },
    virtualLinks: {
      zoom: '',
      googleMeet: '',
      teams: '',
      other: '',
      password: '',
      instructions: ''
    },
    price: {
      member: 0,
      nonMember: 0
    },
    maxCapacity: 0,
    cpScore: 0,
    tags: [],
    shortDescription: '',
    descriptionHtml: '',
    bannerUrl: '',
    bannerOverlay: {
      color: '#000000',
      opacity: 0.3
    },
    agenda: [],
    speakers: [],
    sponsors: [],
    notifications: []
  });

  // Load event data when in edit mode
  useEffect(() => {
    if (event && mode === 'edit') {
      console.log('Loading event data into form:', event);
      console.log('🏢 VENUE DEBUG - Original venue data:', event.venue);
      console.log('🏢 VENUE DEBUG - Venue name:', event.venue?.name);
      console.log('🏢 VENUE DEBUG - Venue address:', event.venue?.address);
      console.log('🗺️ MAPS DEBUG - Google Maps URL:', event.venue?.google_maps_url || event.venue?.mapEmbedUrl);
      
      // Transform event data to match form field names
      const transformedData = {
        title: event.title || event.event_title || '',
        hostedBy: event.hostedBy || event.hosted_by || '',
        status: event.status || event.event_status || 'upcoming',
        category: event.category || event.event_category || 'panel',
        startsAt: event.startsAt || (event.date && event.time ? `${event.date}T${event.time}` : ''),
        endsAt: event.endsAt || (event.date && event.endTime ? `${event.date}T${event.endTime}` : ''),
        mode: event.mode || (event.virtual ? 'virtual' : 'in_person'),
        venue: { 
          name: event.venue?.name || event.location || '', 
          address: event.venue?.address || event.address || '', 
          mapEmbedUrl: event.venue?.mapEmbedUrl || event.venue?.google_maps_url || '', 
          lat: event.venue?.lat || null, 
          lng: event.venue?.lng || null 
        },
        virtualLinks: event.virtualLinks || { 
          zoom: event.virtualLink || '', 
          googleMeet: '', 
          teams: '', 
          other: '', 
          password: '', 
          instructions: '' 
        },
        price: event.price || { 
          member: event.memberPrice || 0, 
          nonMember: event.nonMemberPrice || 0 
        },
        maxCapacity: event.maxCapacity || event.capacity || 0,
        cpScore: event.cpScore || event.cpeCredits || 0,
        tags: event.tags || [],
        shortDescription: event.shortDescription || event.description || '',
        descriptionHtml: event.descriptionHtml || event.description || '',
        bannerUrl: event.bannerUrl || event.bannerImage || '',
        bannerOverlay: event.bannerOverlay || { color: '#000000', opacity: 0.3 },
        agenda: event.agenda || [],
        speakers: event.speakers || [],
        sponsors: event.sponsors || [],
        notifications: event.notifications || []
      };
      
      console.log('🎨 EditModal - Banner URL loaded:', transformedData.bannerUrl?.substring(0, 100));
      console.log('Transformed form data:', transformedData);
      setFormData(transformedData);
      
      if (transformedData.bannerUrl) {
        console.log('🎨 EditModal - Setting banner preview:', transformedData.bannerUrl?.substring(0, 100));
        setBannerPreview(transformedData.bannerUrl);
      }
    }
  }, [event, mode]);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  // Handle input changes
  const handleInputChange = (field, value, nestedField = null) => {
    console.log('Input changed:', { field, value, nestedField });
    
    if (nestedField) {
      setFormData(prev => {
        const updated = {
          ...prev,
          [nestedField]: {
            ...prev[nestedField],
            [field]: value
          }
        };
        console.log('Updated nested form data:', updated);
        return updated;
      });
    } else {
      setFormData(prev => {
        const updated = {
          ...prev,
          [field]: value
        };
        console.log('Updated form data:', updated);
        return updated;
      });
    }
  };

  // Handle banner upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB for file upload)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size too large! Please choose an image smaller than 5MB.');
        console.warn('🎨 Banner upload: File too large -', (file.size / 1024 / 1024).toFixed(2), 'MB');
        return;
      }

      console.log('🎨 Banner upload: Uploading file to server -', file.name, '(' + (file.size / 1024).toFixed(2) + ' KB)');
      
      try {
        // OPTION 1: Upload to server (recommended for production)
        const uploadAPI = await import('../../services/uploadAPI.js');
        const response = await uploadAPI.uploadBanner(file);
        
        console.log('🎨 Banner uploaded successfully:', response.data.url);
        
        // Use the server URL
        const serverUrl = response.data.fullUrl;
        setBannerPreview(serverUrl);
        handleInputChange('bannerUrl', serverUrl);
      } catch (error) {
        console.error('🎨 Banner upload failed, falling back to base64:', error);
        
        // OPTION 2: Fallback to base64 if server upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('🎨 Using base64 fallback');
          setBannerPreview(reader.result);
          handleInputChange('bannerUrl', reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Array manipulation helpers
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    console.log('Form submission started with data:', formData);
    setIsSubmitting(true);
    try {
      console.log('Calling onSave with formData:', formData);
      await onSave(formData);
      console.log('onSave completed successfully');
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'banner', label: 'Banner & Media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'location', label: 'Location', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'agenda', label: 'Agenda', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'speakers', label: 'Speakers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'sponsors', label: 'Sponsors', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'notifications', label: 'Event Updates', icon: 'M15 17h5l-5 5v-5z' }
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/80 via-black/70 to-slate-900/80 backdrop-blur-md transition-all duration-500 p-4 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div 
        className={`relative bg-white dark:bg-gray-900 w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500 border border-gray-200 dark:border-gray-700 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Modal Header with Proper Spacing */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white flex-shrink-0 shadow-xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-indigo-800/90"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30 shadow-lg flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold tracking-tight truncate">
                  {mode === 'create' ? 'Create New Event' : 'Edit Event'}
                </h2>
                <p className="text-xs text-white/90 truncate">
                  {mode === 'create' ? 'Design and configure your event details' : 'Update and enhance your event information'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95 flex-shrink-0 ml-3"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Tab Navigation with Reduced Height */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex px-4 min-w-max bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all duration-300 border-b-3 whitespace-nowrap group ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 shadow-lg transform scale-105'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:scale-102'
                  }`}
                  style={{ 
                    zIndex: activeTab === tab.id ? 20 : 10,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Tab Icon with Enhanced Styling */}
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                  </div>
                  <span className="tracking-wide">{tab.label}</span>
                  
                  {/* Active Tab Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Form Content with Better Spacing */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Simple Test Input - Remove after testing */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Test Input (Direct in Modal):</h4>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => {
                    console.log('DIRECT MODAL INPUT:', e.target.value);
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-red-300 rounded"
                  placeholder="Type here to test direct state update..."
                />
                <p className="text-sm text-red-600 mt-1">Current title: "{formData.title}"</p>
              </div>

              {/* Tab Content with Smooth Transitions */}
              <div className="relative">
                <div className={`${activeTab === 'basic' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <BasicInfoTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>

                <div className={`${activeTab === 'banner' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <BannerTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    bannerPreview={bannerPreview}
                    setBannerPreview={setBannerPreview}
                    bannerInputRef={bannerInputRef}
                    handleBannerUpload={handleBannerUpload}
                  />
                </div>

                <div className={`${activeTab === 'location' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <LocationTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>

                <div className={`${activeTab === 'agenda' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <AgendaTab
                    formData={formData}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayUpdate={handleArrayUpdate}
                    handleArrayRemove={handleArrayRemove}
                  />
                </div>

                <div className={`${activeTab === 'speakers' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <SpeakersTab
                    formData={formData}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayUpdate={handleArrayUpdate}
                    handleArrayRemove={handleArrayRemove}
                  />
                </div>

                <div className={`${activeTab === 'sponsors' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <SponsorsTab
                    formData={formData}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayUpdate={handleArrayUpdate}
                    handleArrayRemove={handleArrayRemove}
                  />
                </div>

                <div className={`${activeTab === 'notifications' ? 'block' : 'hidden'} animate-fadeIn`}>
                  <NotificationsTab
                    formData={formData}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayUpdate={handleArrayUpdate}
                    handleArrayRemove={handleArrayRemove}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Compact Modal Footer */}
        <div className="relative p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="relative flex items-center justify-between">
            {/* Compact Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}
              </div>
              <div className="flex gap-1">
                {tabs.map((tab, index) => (
                  <div
                    key={tab.id}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index <= tabs.findIndex(t => t.id === activeTab)
                        ? 'bg-indigo-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 text-sm ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 active:scale-95'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 text-sm ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white hover:shadow-xl transform hover:scale-105 active:scale-95 hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {mode === 'create' ? 'Create Event' : 'Save Changes'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default EditEventModal;
