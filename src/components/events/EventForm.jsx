// Comprehensive Event Form Component
import React, { useState, useEffect } from 'react';

const EventForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitButtonText = "Create Event"
}) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    shortDescription: '',
    descriptionHtml: '',
    category: 'workshop',
    
    // Date & Time
    startsAt: '',
    endsAt: '',
    timezone: 'America/Los_Angeles',
    
    // Location & Mode
    mode: 'in_person', // 'in_person', 'virtual', 'hybrid'
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      coordinates: { lat: null, lng: null }
    },
    virtualLinks: {
      zoom: '',
      googleMeet: '',
      teams: '',
      other: '',
      password: '',
      instructions: ''
    },
    
    // Capacity & Registration
    capacity: 50,
    seatsLeft: 50,
    allowWaitlist: true,
    registrationDeadline: '',
    
    // Pricing
    isPaid: false,
    price: {
      member: 0,
      nonMember: 0
    },
    currency: 'USD',
    
    // Content & Media
    bannerUrl: '',
    bannerOverlay: {
      color: '#000000',
      opacity: 0.3
    },
    gallery: [],
    
    // Educational Credits
    cpScore: 0,
    cpType: 'technical', // 'technical', 'business', 'leadership'
    certificatesEnabled: false,
    
    // Host & Organization
    hostedBy: 'ISACA Silicon Valley',
    contactEmail: '',
    contactPhone: '',
    
    // Speakers & Agenda
    speakers: [],
    agenda: [],
    
    // Sponsors
    sponsors: [],
    
    // Status & Visibility
    status: 'draft', // 'draft', 'published', 'cancelled', 'completed'
    visibility: 'public', // 'public', 'members_only', 'private'
    featured: false,
    
    // Notifications & Communications
    notifications: [],
    emailReminders: {
      enabled: true,
      schedule: ['7_days', '1_day', '1_hour']
    },
    
    // Additional Settings
    allowPhotography: true,
    codeOfConduct: true,
    accessibilityNotes: '',
    specialRequirements: '',
    tags: [],
    
    // Registration Questions
    customQuestions: [],
    
    // Analytics & Tracking
    trackingEnabled: true,
    
    // Related Events
    relatedEvents: []
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Initialize form with provided data
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        venue: { ...prevData.venue, ...(initialData.venue || {}) },
        virtualLinks: { ...prevData.virtualLinks, ...(initialData.virtualLinks || {}) },
        price: { ...prevData.price, ...(initialData.price || {}) },
        bannerOverlay: { ...prevData.bannerOverlay, ...(initialData.bannerOverlay || {}) },
        emailReminders: { ...prevData.emailReminders, ...(initialData.emailReminders || {}) }
      }));
    }
  }, [initialData]);

  const handleInputChange = (field, value, nestedField = null) => {
    setFormData(prev => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [nestedField]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
        
      case 2: // Date & Time
        if (!formData.startsAt) newErrors.startsAt = 'Start date and time is required';
        if (!formData.endsAt) newErrors.endsAt = 'End date and time is required';
        if (new Date(formData.startsAt) >= new Date(formData.endsAt)) {
          newErrors.endsAt = 'End time must be after start time';
        }
        break;
        
      case 3: // Location & Mode
        if (formData.mode === 'in_person' || formData.mode === 'hybrid') {
          if (!formData.venue.name.trim()) newErrors['venue.name'] = 'Venue name is required';
          if (!formData.venue.address.trim()) newErrors['venue.address'] = 'Venue address is required';
        }
        if (formData.mode === 'virtual' || formData.mode === 'hybrid') {
          const hasVirtualLink = formData.virtualLinks.zoom || 
                                formData.virtualLinks.googleMeet || 
                                formData.virtualLinks.teams || 
                                formData.virtualLinks.other;
          if (!hasVirtualLink) {
            newErrors['virtualLinks.general'] = 'At least one virtual meeting link is required';
          }
        }
        break;
        
      case 4: // Capacity & Pricing
        if (!formData.capacity || formData.capacity < 1) {
          newErrors.capacity = 'Capacity must be at least 1';
        }
        if (formData.isPaid) {
          if (formData.price.member < 0) newErrors['price.member'] = 'Member price cannot be negative';
          if (formData.price.nonMember < 0) newErrors['price.nonMember'] = 'Non-member price cannot be negative';
        }
        break;
        
      case 5: // Content & Credits
        if (formData.cpScore < 0 || formData.cpScore > 24) {
          newErrors.cpScore = 'CP score must be between 0 and 24';
        }
        break;
        
      case 6: // Review & Settings
        if (!formData.hostedBy.trim()) newErrors.hostedBy = 'Host organization is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps
    let isValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      // Calculate seatsLeft if not provided
      const eventData = {
        ...formData,
        seatsLeft: formData.seatsLeft || formData.capacity,
        // Ensure required nested objects exist
        venue: formData.mode === 'virtual' ? null : formData.venue,
        virtualLinks: (formData.mode === 'virtual' || formData.mode === 'hybrid') ? formData.virtualLinks : null
      };
      
      onSubmit(eventData);
    }
  };

  const addSpeaker = () => {
    const newSpeaker = {
      id: Date.now(),
      name: '',
      title: '',
      company: '',
      bio: '',
      photo: '',
      linkedin: '',
      twitter: ''
    };
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }));
  };

  const updateSpeaker = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) => 
        i === index ? { ...speaker, [field]: value } : speaker
      )
    }));
  };

  const removeSpeaker = (index) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const addAgendaItem = () => {
    const newAgendaItem = {
      id: Date.now(),
      start: '',
      end: '',
      title: '',
      description: '',
      speakers: [],
      type: 'session'
    };
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, newAgendaItem]
    }));
  };

  const updateAgendaItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderDateTimeSettings();
      case 3:
        return renderLocationMode();
      case 4:
        return renderCapacityPricing();
      case 5:
        return renderContentCredits();
      case 6:
        return renderReviewSettings();
      default:
        return null;
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Enter event title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Brief description for event listings"
        />
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Detailed Description
        </label>
        <textarea
          value={formData.descriptionHtml}
          onChange={(e) => handleInputChange('descriptionHtml', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Detailed event description (supports HTML)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="webinar">Webinar</option>
          <option value="conference">Conference</option>
          <option value="meeting">Meeting</option>
          <option value="networking">Networking</option>
          <option value="training">Training</option>
          <option value="certification">Certification</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Banner Image URL
        </label>
        <input
          type="url"
          value={formData.bannerUrl}
          onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/banner.jpg"
        />
      </div>
    </div>
  );

  const renderDateTimeSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Date & Time Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.startsAt}
            onChange={(e) => handleInputChange('startsAt', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.startsAt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.startsAt && <p className="text-red-500 text-sm mt-1">{errors.startsAt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.endsAt}
            onChange={(e) => handleInputChange('endsAt', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.endsAt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.endsAt && <p className="text-red-500 text-sm mt-1">{errors.endsAt}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timezone
        </label>
        <select
          value={formData.timezone}
          onChange={(e) => handleInputChange('timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Registration Deadline
        </label>
        <input
          type="datetime-local"
          value={formData.registrationDeadline}
          onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-sm text-gray-500 mt-1">Leave empty to allow registration until event starts</p>
      </div>
    </div>
  );

  const renderLocationMode = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location & Mode</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Event Mode *
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'in_person', label: 'In-Person', icon: '📍' },
            { value: 'virtual', label: 'Virtual', icon: '💻' },
            { value: 'hybrid', label: 'Hybrid', icon: '🌐' }
          ].map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleInputChange('mode', mode.value)}
              className={`p-4 border rounded-lg text-center transition-colors ${
                formData.mode === mode.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-medium">{mode.label}</div>
            </button>
          ))}
        </div>
      </div>

      {(formData.mode === 'in_person' || formData.mode === 'hybrid') && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white">Venue Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              value={formData.venue.name}
              onChange={(e) => handleInputChange('venue', e.target.value, 'name')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors['venue.name'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Silicon Valley Convention Center"
            />
            {errors['venue.name'] && <p className="text-red-500 text-sm mt-1">{errors['venue.name']}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.venue.address}
              onChange={(e) => handleInputChange('venue', e.target.value, 'address')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors['venue.address'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="123 Main Street"
            />
            {errors['venue.address'] && <p className="text-red-500 text-sm mt-1">{errors['venue.address']}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.venue.city}
                onChange={(e) => handleInputChange('venue', e.target.value, 'city')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="San Jose"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.venue.state}
                onChange={(e) => handleInputChange('venue', e.target.value, 'state')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.venue.zipCode}
                onChange={(e) => handleInputChange('venue', e.target.value, 'zipCode')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="95112"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.venue.country}
                onChange={(e) => handleInputChange('venue', e.target.value, 'country')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="USA"
              />
            </div>
          </div>
        </div>
      )}

      {(formData.mode === 'virtual' || formData.mode === 'hybrid') && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white">Virtual Meeting Links</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zoom Link
              </label>
              <input
                type="url"
                value={formData.virtualLinks.zoom}
                onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'zoom')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://zoom.us/j/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Meet Link
              </label>
              <input
                type="url"
                value={formData.virtualLinks.googleMeet}
                onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'googleMeet')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Microsoft Teams Link
              </label>
              <input
                type="url"
                value={formData.virtualLinks.teams}
                onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'teams')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://teams.microsoft.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Other Platform Link
              </label>
              <input
                type="url"
                value={formData.virtualLinks.other}
                onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'other')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting Password
            </label>
            <input
              type="text"
              value={formData.virtualLinks.password}
              onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'password')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Optional meeting password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Virtual Meeting Instructions
            </label>
            <textarea
              value={formData.virtualLinks.instructions}
              onChange={(e) => handleInputChange('virtualLinks', e.target.value, 'instructions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Special instructions for joining the virtual event"
            />
          </div>

          {errors['virtualLinks.general'] && (
            <p className="text-red-500 text-sm">{errors['virtualLinks.general']}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderCapacityPricing = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Capacity & Pricing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Capacity *
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
            min="1"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.capacity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowWaitlist"
            checked={formData.allowWaitlist}
            onChange={(e) => handleInputChange('allowWaitlist', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allowWaitlist" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Allow waitlist when event is full
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="isPaid"
            checked={formData.isPaid}
            onChange={(e) => handleInputChange('isPaid', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            This is a paid event
          </label>
        </div>

        {formData.isPaid && (
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price.member}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0, 'member')}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors['price.member'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors['price.member'] && <p className="text-red-500 text-sm mt-1">{errors['price.member']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Non-Member Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price.nonMember}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0, 'nonMember')}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors['price.nonMember'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors['price.nonMember'] && <p className="text-red-500 text-sm mt-1">{errors['price.nonMember']}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderContentCredits = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content & Educational Credits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Continuing Professional (CP) Score
          </label>
          <input
            type="number"
            value={formData.cpScore}
            onChange={(e) => handleInputChange('cpScore', parseInt(e.target.value) || 0)}
            min="0"
            max="24"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.cpScore ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.cpScore && <p className="text-red-500 text-sm mt-1">{errors.cpScore}</p>}
          <p className="text-sm text-gray-500 mt-1">Maximum 24 CP hours per event</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CP Type
          </label>
          <select
            value={formData.cpType}
            onChange={(e) => handleInputChange('cpType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="certificatesEnabled"
          checked={formData.certificatesEnabled}
          onChange={(e) => handleInputChange('certificatesEnabled', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="certificatesEnabled" className="text-sm text-gray-700 dark:text-gray-300">
          Enable automatic certificate generation
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Host Organization
        </label>
        <input
          type="text"
          value={formData.hostedBy}
          onChange={(e) => handleInputChange('hostedBy', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            errors.hostedBy ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="ISACA Silicon Valley"
        />
        {errors.hostedBy && <p className="text-red-500 text-sm mt-1">{errors.hostedBy}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="events@isacasv.org"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>
  );

  const renderReviewSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Review & Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Visibility
          </label>
          <select
            value={formData.visibility}
            onChange={(e) => handleInputChange('visibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="public">Public</option>
            <option value="members_only">Members Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
            Feature this event on homepage
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="allowPhotography"
            checked={formData.allowPhotography}
            onChange={(e) => handleInputChange('allowPhotography', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allowPhotography" className="text-sm text-gray-700 dark:text-gray-300">
            Allow photography and recordings
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="codeOfConduct"
            checked={formData.codeOfConduct}
            onChange={(e) => handleInputChange('codeOfConduct', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="codeOfConduct" className="text-sm text-gray-700 dark:text-gray-300">
            Require agreement to code of conduct
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Accessibility Notes
        </label>
        <textarea
          value={formData.accessibilityNotes}
          onChange={(e) => handleInputChange('accessibilityNotes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Information about accessibility accommodations"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Special Requirements
        </label>
        <textarea
          value={formData.specialRequirements}
          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Any special requirements or instructions for attendees"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : i + 1 < currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {i + 1 < currentStep ? '✓' : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  i + 1 < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : submitButtonText}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;