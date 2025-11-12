// Enhanced Events Management with Modular Components
import React, { useState, useEffect } from 'react';
import EditEventModal from '../shared/EditEventModal';
import EventList from '../events/EventList';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events data - replace with API call
  const mockEvents = [
    {
      id: '1',
      title: "Cybersecurity Best Practices Workshop",
      shortDescription: "Learn about the latest cybersecurity threats and defenses in this hands-on workshop.",
      descriptionHtml: "<p>Join us for an intensive workshop covering modern cybersecurity challenges...</p>",
      category: "workshop",
      startsAt: "2024-12-15T10:00:00",
      endsAt: "2024-12-15T17:00:00",
      timezone: "America/Los_Angeles",
      mode: "in_person",
      venue: {
        name: "Silicon Valley Convention Center",
        address: "5001 Great America Parkway",
        city: "Santa Clara",
        state: "CA",
        zipCode: "95054",
        country: "USA"
      },
      capacity: 60,
      seatsLeft: 15,
      isPaid: true,
      price: {
        member: 75,
        nonMember: 125
      },
      status: "published",
      visibility: "public",
      hostedBy: "ISACA Silicon Valley",
      cpScore: 6,
      cpType: "technical",
      bannerUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
      speakers: [
        {
          id: "speaker1",
          name: "John Smith",
          title: "CISO",
          company: "TechCorp Inc.",
          bio: "John has over 15 years of experience in cybersecurity...",
          photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          linkedin: "https://linkedin.com/in/johnsmith"
        }
      ],
      agenda: [
        {
          id: "agenda1",
          start: "10:00",
          end: "10:30",
          title: "Registration & Welcome",
          type: "networking",
          speakers: []
        },
        {
          id: "agenda2",
          start: "10:30",
          end: "12:00",
          title: "Cybersecurity Fundamentals",
          type: "session",
          speakers: ["speaker1"],
          description: "Overview of current threat landscape"
        }
      ],
      featured: true,
      allowPhotography: true,
      codeOfConduct: true
    },
    {
      id: '2',
      title: "Risk Management Seminar",
      shortDescription: "Understanding modern risk management strategies for digital transformation.",
      category: "seminar",
      startsAt: "2024-12-20T14:00:00",
      endsAt: "2024-12-20T17:00:00",
      mode: "virtual",
      virtualLinks: {
        zoom: "https://zoom.us/j/123456789",
        password: "risk2024"
      },
      capacity: 100,
      seatsLeft: 25,
      isPaid: true,
      price: {
        member: 50,
        nonMember: 100
      },
      status: "published",
      hostedBy: "ISACA Silicon Valley",
      cpScore: 3,
      speakers: [],
      agenda: []
    },
    {
      id: '3',
      title: "Annual Chapter Meeting",
      shortDescription: "Annual chapter meeting and networking event with board elections.",
      category: "meeting",
      startsAt: "2024-11-30T18:00:00",
      endsAt: "2024-11-30T21:00:00",
      mode: "hybrid",
      venue: {
        name: "Marriott Hotel",
        address: "301 S Market St",
        city: "San Jose",
        state: "CA",
        zipCode: "95113",
        country: "USA"
      },
      virtualLinks: {
        zoom: "https://zoom.us/j/987654321"
      },
      capacity: 200,
      seatsLeft: 20,
      isPaid: false,
      price: { member: 0, nonMember: 0 },
      status: "completed",
      hostedBy: "ISACA Silicon Valley",
      cpScore: 0,
      speakers: [],
      agenda: []
    }
  ];
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      seatsLeft: eventData.capacity
    };
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setIsCreateModalOpen(false);
    // Show success notification
    console.log('Event created successfully:', newEvent);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = (eventData) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : event
      )
    );
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    // Show success notification
    console.log('Event updated successfully:', eventData);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      // Show success notification
      console.log('Event deleted successfully');
    }
  };

  const handleDuplicateEvent = (event) => {
    const duplicatedEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      status: 'draft',
      seatsLeft: event.capacity
    };
    setEvents(prevEvents => [duplicatedEvent, ...prevEvents]);
    // Show success notification
    console.log('Event duplicated successfully:', duplicatedEvent);
  };

  const handleStatusChange = (eventId, newStatus) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
    // Show success notification
    console.log(`Event status changed to: ${newStatus}`);
  };

  // List view only - modals handle create/edit
  return (
    <div className="space-y-6">
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
        mode="create"
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleUpdateEvent}
        event={selectedEvent}
        mode="edit"
      />
    </div>
  );
};

export default EventsManagement;