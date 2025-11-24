// Enhanced Events Management with Modular Components
import React, { useState, useEffect } from 'react';
import EditEventModal from '../shared/EditEventModal';
import EventList from '../events/EventList';
import { eventsAPI } from '../../services/apiEndpoints';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getAll();
      
      if (response.success) {
        // Transform API response to match component structure
        const transformedEvents = response.data.map(event => ({
          id: event.id,
          title: event.event_title || event.title,
          shortDescription: event.short_description || event.shortDescription,
          descriptionHtml: event.event_description || event.descriptionHtml,
          category: event.event_category || event.category,
          startsAt: event.event_date || event.startsAt,
          endsAt: event.end_date || event.endsAt,
          timezone: event.timezone,
          mode: event.venue?.mode || 'in_person',
          venue: event.venue,
          virtualLinks: event.virtualLinks,
          capacity: event.max_capacity || event.capacity,
          seatsLeft: event.available_seats || event.seatsLeft,
          isPaid: event.is_paid || event.isPaid,
          price: event.pricing || event.price,
          status: event.event_status || event.status,
          visibility: event.visibility,
          hostedBy: event.hosted_by || event.hostedBy,
          cpScore: event.cpe_credits || event.cpScore,
          cpType: event.cpType,
          bannerUrl: event.media?.banner_image || event.bannerUrl,
          speakers: event.speakers || [],
          agenda: event.agenda || [],
          sponsors: event.sponsors || [],
          notifications: event.notifications || [],
          featured: event.is_featured || event.featured,
          allowPhotography: event.photography_allowed || event.allowPhotography,
          codeOfConduct: event.code_of_conduct_required || event.codeOfConduct,
          tags: event.event_tags || event.tags,
          registeredCount: event.registered_count || 0
        }));
        
        setEvents(transformedEvents);
      } else {
        setError(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Transform form data to API format
      const apiData = transformFormDataToAPI(eventData);
      
      const response = await eventsAPI.create(apiData);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        setIsCreateModalOpen(false);
        
        // Show success notification
        showNotification('success', 'Event created successfully!');
      } else {
        setError(response.message || 'Failed to create event');
        showNotification('error', response.message || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
      showNotification('error', err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (event) => {
    try {
      console.log('📝 Loading event for editing:', event.id);
      // Fetch full event details
      const response = await eventsAPI.getById(event.id);
      if (response.success) {
        const eventData = response.data;
        console.log('📝 Full event data from API:', eventData);
        console.log('🎨 Banner data:', {
          banner_image: eventData.media?.banner_image,
          overlay_color: eventData.media?.overlay_settings,
          overlay_opacity: eventData.media?.overlay_opacity
        });
        
        // Transform API response to match EditEventModal expected format
        const transformedEvent = {
          id: eventData.id,
          title: eventData.event_title || '',
          hostedBy: eventData.hosted_by || '',
          status: eventData.event_status || 'upcoming',
          category: eventData.event_category || 'panel',
          startsAt: eventData.event_date && eventData.start_time 
            ? `${eventData.event_date.split('T')[0]}T${eventData.start_time}`
            : '',
          endsAt: eventData.event_date && eventData.end_time 
            ? `${eventData.event_date.split('T')[0]}T${eventData.end_time}`
            : '',
          mode: eventData.venue?.mode || 'in_person',
          venue: {
            name: eventData.venue?.venue_name || '',
            address: eventData.venue?.full_address || '',
            mapEmbedUrl: eventData.venue?.google_maps_url || '',
            lat: eventData.venue?.latitude || null,
            lng: eventData.venue?.longitude || null
          },
          virtualLinks: eventData.virtualLinks || {},
          price: {
            member: parseFloat(eventData.member_price || 0),
            nonMember: parseFloat(eventData.non_member_price || 0)
          },
          maxCapacity: parseInt(eventData.max_attendees || eventData.max_capacity || 0),
          cpScore: parseFloat(eventData.cpe_hours || eventData.cpe_credits || 0),
          tags: eventData.event_tags || [],
          shortDescription: eventData.short_description || '',
          descriptionHtml: eventData.event_description || '',
          bannerUrl: eventData.media?.banner_image || eventData.banner_image || '',
          bannerOverlay: {
            color: eventData.media?.overlay_settings || eventData.banner_overlay_color || '#000000',
            opacity: parseFloat(eventData.media?.overlay_opacity || eventData.banner_overlay_opacity || 0.3)
          },
          agenda: eventData.agenda || [],
          speakers: eventData.speakers || [],
          sponsors: eventData.sponsors || [],
          notifications: eventData.notifications || [],
          featured: eventData.is_featured || false,
          allowPhotography: eventData.photography_allowed || false,
          codeOfConduct: eventData.code_of_conduct_required || false
        };
        
        console.log('📝 Transformed event for modal:', transformedEvent);
        console.log('🎨 Banner URL for modal:', transformedEvent.bannerUrl);
        console.log('🎨 Banner Overlay for modal:', transformedEvent.bannerOverlay);
        
        setSelectedEvent(transformedEvent);
        setIsEditModalOpen(true);
      } else {
        showNotification('error', 'Failed to load event details');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      showNotification('error', 'Failed to load event details');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Transform form data to API format
      const apiData = transformFormDataToAPI(eventData);
      
      const response = await eventsAPI.update(selectedEvent.id, apiData);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        
        // Show success notification
        showNotification('success', 'Event updated successfully!');
      } else {
        setError(response.message || 'Failed to update event');
        showNotification('error', response.message || 'Failed to update event');
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
      showNotification('error', err.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await eventsAPI.delete(eventId);
      
      if (response.success) {
        // Refresh events list
        await fetchEvents();
        showNotification('success', 'Event deleted successfully!');
      } else {
        showNotification('error', response.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      showNotification('error', err.message || 'Failed to delete event');
    }
  };

  const handleDuplicateEvent = async (event) => {
    try {
      // Fetch full event details
      const response = await eventsAPI.getById(event.id);
      
      if (response.success) {
        const eventData = response.data;
        const duplicatedData = {
          ...eventData,
          event_title: `${eventData.event_title || eventData.title} (Copy)`,
          title: `${eventData.event_title || eventData.title} (Copy)`,
          event_status: 'draft',
          status: 'draft'
        };
        
        // Remove ID to create new event
        delete duplicatedData.id;
        
        const createResponse = await eventsAPI.create(transformFormDataToAPI(duplicatedData));
        
        if (createResponse.success) {
          await fetchEvents();
          showNotification('success', 'Event duplicated successfully!');
        } else {
          showNotification('error', createResponse.message || 'Failed to duplicate event');
        }
      }
    } catch (err) {
      console.error('Error duplicating event:', err);
      showNotification('error', err.message || 'Failed to duplicate event');
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const response = await eventsAPI.update(eventId, { event_status: newStatus, status: newStatus });
      
      if (response.success) {
        await fetchEvents();
        showNotification('success', `Event status changed to ${newStatus}`);
      } else {
        showNotification('error', response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  // Transform form data to API format
  const transformFormDataToAPI = (formData) => {
    console.log('📤 Transforming form data to API format:', formData);
    console.log('🎨 Banner URL:', formData.bannerUrl);
    console.log('🎨 Banner Overlay:', formData.bannerOverlay);
    
    const apiData = {
      event_title: formData.title || formData.event_title,
      short_description: formData.shortDescription || formData.short_description,
      event_description: formData.descriptionHtml || formData.event_description,
      event_category: formData.category || formData.event_category,
      event_date: formData.startsAt || formData.event_date,
      start_time: formData.startTime || formData.start_time,
      end_date: formData.endsAt || formData.end_date,
      end_time: formData.endTime || formData.end_time,
      timezone: formData.timezone,
      venue: formData.venue,
      virtualLinks: formData.virtualLinks,
      max_capacity: formData.maxCapacity || formData.capacity || formData.max_capacity,
      is_paid: formData.isPaid !== undefined ? formData.isPaid : formData.is_paid,
      pricing: formData.price || formData.pricing,
      event_status: formData.status || formData.event_status,
      visibility: formData.visibility,
      hosted_by: formData.hostedBy || formData.hosted_by,
      cpe_credits: formData.cpScore || formData.cpe_credits,
      event_tags: formData.tags || formData.event_tags,
      speakers: formData.speakers,
      agenda: formData.agenda,
      sponsors: formData.sponsors,
      notifications: formData.notifications,
      is_featured: formData.featured !== undefined ? formData.featured : formData.is_featured,
      photography_allowed: formData.allowPhotography !== undefined ? formData.allowPhotography : formData.photography_allowed,
      code_of_conduct_required: formData.codeOfConduct !== undefined ? formData.codeOfConduct : formData.code_of_conduct_required,
      banner_image: formData.bannerUrl || formData.banner_image,
      banner_overlay_color: formData.bannerOverlay?.color || formData.bannerOverlayColor || formData.banner_overlay_color,
      banner_overlay_opacity: formData.bannerOverlay?.opacity !== undefined ? formData.bannerOverlay.opacity : (formData.bannerOverlayOpacity || formData.banner_overlay_opacity)
    };
    
    console.log('📤 Transformed API data:', apiData);
    console.log('🎨 API Banner Image:', apiData.banner_image);
    console.log('🎨 API Overlay Color:', apiData.banner_overlay_color);
    console.log('🎨 API Overlay Opacity:', apiData.banner_overlay_opacity);
    
    return apiData;
  };

  // Show notification (you can replace with your notification system)
  const showNotification = (type, message) => {
    // Simple console log for now - replace with toast/notification component
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You can integrate with a toast library here
    // Example: toast[type](message);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // List view only - modals handle create/edit
  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your ISACA chapter events, speakers, and registrations
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: 'blue' },
          { label: 'Published', value: events.filter(e => e.status === 'published').length, color: 'green' },
          { label: 'Upcoming', value: events.filter(e => new Date(e.startsAt) > new Date()).length, color: 'orange' },
          { label: 'Draft', value: events.filter(e => e.status === 'draft').length, color: 'gray' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md bg-${stat.color}-500 flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{stat.value}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.label}
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      <EventList
        events={events}
        loading={loading}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
        onStatusChange={handleStatusChange}
        showActions={true}
      />

      {/* Create Event Modal */}
      <EditEventModal
        isOpen={isCreateModalOpen}
        onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
        mode="create"
        isSubmitting={isSubmitting}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }
        }}
        onSave={handleUpdateEvent}
        event={selectedEvent}
        mode="edit"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EventsManagement;