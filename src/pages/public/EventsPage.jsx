// Events Page
import React, { useState, useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout.jsx';
import EventCard from '../../components/shared/ui/EventCard.jsx';
import { eventsAPI } from '../../services/apiEndpoints';

const EventsPage = () => {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events from backend API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch ALL events from backend (no status filter on API call)
        const response = await eventsAPI.getAll({ 
          limit: 100 // Get all events
        });
        
        // Transform backend data to frontend format
        const transformedEvents = (response.data || []).map(event => {
          console.log('🎨 Event data transformation:', {
            id: event.id,
            title: event.event_title,
            media: event.media,
            banner_image: event.banner_image,
            finalBannerImage: event.media?.banner_image || event.banner_image
          });
          
          return {
            id: event.id,
            slug: event.event_slug || event.id, // Use slug for URL, fallback to ID
            title: event.event_title,
          date: event.event_date?.split('T')[0] || event.event_date,
          time: event.start_time || '00:00',
          duration: `${event.duration_hours || 2} hours`,
          location: event.is_virtual ? 'Virtual Event' : event.venue_name || 'TBA',
          address: event.venue_address || '',
          description: event.event_description,
          category: event.event_category || 'Event',
          price: { 
            member: event.member_price || 0, 
            nonMember: event.non_member_price || 0 
          },
          maxAttendees: event.max_attendees || 100,
          currentAttendees: event.registered_count || 0,
          image: event.media?.banner_image || event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
          bannerImage: event.media?.banner_image || event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
          speakers: event.speakers || [],
          sponsors: event.sponsors || [],
          tags: event.event_tags || [],
          level: event.difficulty_level || 'All Levels',
          cpe: event.cpe_hours || 0,
          virtual: event.is_virtual || false,
          status: event.event_status || 'upcoming',
          venue: event.venue_name || 'Virtual Platform',
          mode: event.is_virtual ? 'Virtual' : 'In-Person',
          hostedBy: 'ISACA Silicon Valley',
          virtualLink: event.virtual_link || null
        };
        });
        
        setEvents(transformedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Remove statusFilter dependency - load all events once

  const allEvents = events;

  // Filter events by status first, then by category
  const statusFilteredEvents = allEvents.filter(event => event.status === statusFilter);
  const filteredEvents = filter === 'all' 
    ? statusFilteredEvents 
    : statusFilteredEvents.filter(event => event.category.toLowerCase() === filter);

  const categories = ['all', 'workshop', 'webinar', 'training', 'summit', 'networking'];
  const statusOptions = [
    { key: 'upcoming', label: 'Upcoming', count: allEvents.filter(e => e.status === 'upcoming').length },
    { key: 'ongoing', label: 'Ongoing', count: allEvents.filter(e => e.status === 'ongoing').length },
    { key: 'completed', label: 'Completed', count: allEvents.filter(e => e.status === 'completed').length }
  ];
  
  // Calculate category counts based on currently selected status
  const getCategoryCount = (category) => {
    if (category === 'all') return statusFilteredEvents.length;
    return statusFilteredEvents.filter(e => e.category.toLowerCase() === category).length;
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Events
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive calendar of educational workshops, networking events, certification prep sessions, and professional development opportunities
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Failed to load events</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        ) : (
          <>

        {/* Status Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex border border-gray-200 dark:border-gray-700">
              {statusOptions.map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    statusFilter === status.key
                      ? 'bg-primary-600 dark:bg-gray-600 text-white dark:text-white shadow-sm border border-primary-700 dark:border-primary-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {status.label}
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    statusFilter === status.key
                      ? 'bg-primary-500 dark:bg-primary-800 text-white dark:text-primary-200'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Events' : category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-xs">
                  ({getCategoryCount(category)})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredEvents.length} {statusFilter} {filteredEvents.length === 1 ? 'event' : 'events'}
            {filter !== 'all' && ` in ${filter} category`}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userType="guest"
              context="events-page"
              showSpeakers={true}
              showSponsors={true}
              showTags={true}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no events in the {filter} category at the moment.
            </p>
          </div>
        )}

        {/* Enhanced Animated Stats Section */}
        <div className="mt-16 relative">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-indigo-500/10 to-purple-500/10 dark:from-primary-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 rounded-2xl blur-3xl animate-pulse"></div>
          
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {/* Floating background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-indigo-400/20 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-bounce delay-500"></div>
            
            {/* Stats Grid */}
            <div className="relative grid md:grid-cols-4 gap-8">
              {/* Total Events */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="relative text-center p-6 rounded-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  {/* Number with counting animation */}
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {allEvents.length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Total Events
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transform origin-left animate-pulse" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>

              {/* Virtual Events */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="relative text-center p-6 rounded-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800 dark:to-emerald-900 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  {/* Number */}
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {allEvents.filter(e => e.virtual).length}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Virtual Events
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform origin-left animate-pulse" style={{width: `${(allEvents.filter(e => e.virtual).length / allEvents.length) * 100}%`}}></div>
                  </div>
                </div>
              </div>

              {/* Total CPE Hours */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="relative text-center p-6 rounded-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-900 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-8 h-8 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  {/* Number */}
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {allEvents.reduce((sum, e) => sum + e.cpe, 0)}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Total CPE Hours
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transform origin-left animate-pulse" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>

              {/* Total Attendees */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="relative text-center p-6 rounded-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-800 dark:to-pink-900 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  {/* Number */}
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {allEvents.reduce((sum, e) => sum + e.currentAttendees, 0)}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Total Attendees
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform origin-left animate-pulse" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 dark:from-primary-800 dark:via-primary-900 dark:to-indigo-900 rounded-2xl shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute bottom-6 right-6 w-20 h-20 bg-white/5 rounded-full blur-md animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-16 w-12 h-12 bg-white/10 rounded-full blur-sm animate-pulse delay-500"></div>
            
            <div className="relative px-8 py-12 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Connected with ISACA Silicon Valley
              </h2>
              
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join our community to get notified about upcoming events, exclusive member benefits, 
                and professional development opportunities in governance, risk management, and cybersecurity.
              </p>

              {/* Enhanced Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10h-5"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Event Updates</h3>
                  <p className="text-white/80 text-sm">Get notified about new events and registration openings</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Member Benefits</h3>
                  <p className="text-white/80 text-sm">Access exclusive content and discounted event pricing</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Career Growth</h3>
                  <p className="text-white/80 text-sm">Professional development and networking opportunities</p>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-white hover:bg-gray-50 text-primary-600 px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10h-5"/>
                  </svg>
                  Subscribe to Updates
                </button>
                <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Become a Member
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </PublicLayout>
  );
};

export default EventsPage;