// Event List Component with Advanced Filtering and Management
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const EventList = ({ 
  events = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onStatusChange,
  showActions = true,
  view = 'grid' // 'grid' or 'list'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(events.map(event => event.category))];
    return cats.filter(Boolean);
  }, [events]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.hostedBy?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.startsAt || a.date);
          bValue = new Date(b.startsAt || b.date);
          break;
        case 'capacity':
          aValue = a.capacity || 0;
          bValue = b.capacity || 0;
          break;
        case 'registered':
          aValue = (a.capacity - a.seatsLeft) || a.registered || 0;
          bValue = (b.capacity - b.seatsLeft) || b.registered || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [events, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredAndSortedEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredAndSortedEvents.map(event => event.id));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    selectedEvents.forEach(eventId => {
      onStatusChange && onStatusChange(eventId, newStatus);
    });
    setSelectedEvents([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) {
      selectedEvents.forEach(eventId => {
        onDelete && onDelete(eventId);
      });
      setSelectedEvents([]);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      ongoing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return styles[status] || styles.draft;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRegistrationProgress = (event) => {
    const registered = (event.capacity - event.seatsLeft) || event.registered || 0;
    const capacity = event.capacity || 50;
    return Math.round((registered / capacity) * 100);
  };

  const EventCard = ({ event }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Event Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        {event.bannerUrl ? (
          <img 
            src={event.bannerUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-white/80">
              {event.category === 'workshop' ? '🛠️' :
               event.category === 'seminar' ? '📋' :
               event.category === 'webinar' ? '💻' :
               event.category === 'conference' ? '🎤' :
               event.category === 'networking' ? '🤝' : '📅'}
            </span>
          </div>
        )}
        
        {/* Selection Checkbox */}
        {showActions && (
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              checked={selectedEvents.includes(event.id)}
              onChange={() => handleSelectEvent(event.id)}
              className="w-5 h-5 rounded border-white/50 bg-white/20 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
          </span>
        </div>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                {event.mode === 'virtual' ? '💻' : event.mode === 'hybrid' ? '🌐' : '📍'}
                {event.mode === 'virtual' ? 'Virtual' : event.mode === 'hybrid' ? 'Hybrid' : 'In-Person'}
              </span>
              {event.isPaid && (
                <span className="bg-green-500/80 px-2 py-1 rounded text-xs font-bold">
                  {typeof event.price === 'object' 
                    ? `$${event.price.member}+` 
                    : event.price > 0 
                      ? `$${event.price}` 
                      : 'Free'
                  }
                </span>
              )}
            </div>
            {event.cpScore > 0 && (
              <span className="bg-purple-500/80 px-2 py-1 rounded text-xs font-bold">
                {event.cpScore} CP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hosted by {event.hostedBy || 'ISACA Silicon Valley'}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {event.shortDescription || event.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.startsAt || event.date)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(event.startsAt || event.time)}
          </div>
        </div>

        {/* Registration Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Registration</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {(event.capacity - event.seatsLeft) || event.registered || 0} / {event.capacity || 50}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getRegistrationProgress(event)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit && onEdit(event)}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                title="Edit event"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDuplicate && onDuplicate(event)}
                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                title="Duplicate event"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete && onDelete(event.id)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title="Delete event"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <Link
              to={`/events/${event.id}`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Details
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
        
        {/* Loading skeleton for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-t-lg"></div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg p-6">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events by title, description, or host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date-asc">Date (Earliest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="registered-desc">Most Registered</option>
            <option value="capacity-desc">Largest Capacity</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && showActions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedEvents.length === filteredAndSortedEvents.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <select
                onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                value=""
                className="text-sm px-3 py-1 border border-blue-300 dark:border-blue-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-blue-900/40 dark:text-blue-100"
              >
                <option value="">Change Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedEvents.length} of {events.length} events
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
          <button
            onClick={() => {}} // view toggle would go here
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Grid view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h4v4H4V6zM10 6h4v4h-4V6zM16 6h4v4h-4V6zM4 12h4v4H4v-4zM10 12h4v4h-4v-4zM16 12h4v4h-4v-4z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredAndSortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {events.length === 0 
              ? "No events have been created yet. Create your first event to get started!"
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;