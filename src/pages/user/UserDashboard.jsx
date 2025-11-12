import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { eventsAPI, certificatesAPI, notificationsAPI, registrationsAPI } from '../../services/apiEndpoints';

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    registeredEvents: [],
    certificates: [],
    notifications: [],
    stats: {
      eventsAttended: 0,
      upcomingEvents: 0,
      cpeCredits: 0,
      certificates: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all dashboard data in parallel
        const [eventsRes, certificatesRes, notificationsRes] = await Promise.all([
          registrationsAPI.getMy().catch(() => ({ data: [] })),
          certificatesAPI.getMy().catch(() => ({ data: [] })),
          notificationsAPI.getAll({ limit: 5 }).catch(() => ({ data: [] }))
        ]);

        // Calculate stats
        const upcomingEvents = eventsRes.data?.filter(reg => 
          new Date(reg.event_date) > new Date() && reg.status === 'confirmed'
        ).length || 0;

        const eventsAttended = eventsRes.data?.filter(reg => 
          new Date(reg.event_date) < new Date() && reg.status === 'attended'
        ).length || 0;

        const totalCPE = certificatesRes.data?.reduce((sum, cert) => 
          sum + (cert.cpe_credits || 0), 0
        ) || 0;

        setDashboardData({
          registeredEvents: eventsRes.data || [],
          certificates: certificatesRes.data || [],
          notifications: notificationsRes.data || [],
          stats: {
            eventsAttended,
            upcomingEvents,
            cpeCredits: totalCPE,
            certificates: certificatesRes.data?.length || 0
          }
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-8 shadow-lg">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Member'}! 👋</h1>
          <p className="mt-2 text-purple-100">Here's an overview of your ISACA journey</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading data</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Events Attended"
            value={dashboardData.stats.eventsAttended}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Upcoming Events"
            value={dashboardData.stats.upcomingEvents}
            icon="📅"
            color="blue"
          />
          <StatCard
            title="CPE Credits"
            value={dashboardData.stats.cpeCredits}
            icon="🎓"
            color="purple"
          />
          <StatCard
            title="Certificates"
            value={dashboardData.stats.certificates}
            icon="🏆"
            color="yellow"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registered Events */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Events</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.registeredEvents.length} total
                </span>
              </div>
              
              {dashboardData.registeredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-500 dark:text-gray-400">No events registered yet</p>
                  <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.registeredEvents.slice(0, 5).map((event) => (
                    <EventCard key={event.registration_id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Certificates</h2>
              {dashboardData.certificates.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No certificates yet</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.certificates.slice(0, 3).map((cert) => (
                    <div key={cert.certificate_id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl">🏆</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {cert.event_title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {cert.cpe_credits} CPE Credits
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
              {dashboardData.notifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No new notifications</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.notifications.map((notif) => (
                    <div key={notif.notification_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-pink-600',
    yellow: 'from-yellow-500 to-orange-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// EventCard Component
const EventCard = ({ event }) => {
  const isUpcoming = new Date(event.event_date) > new Date();
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    attended: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {event.event_title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(event.event_date).toLocaleDateString()} • {event.event_type}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[event.status] || statusColors.pending}`}>
          {event.status || 'pending'}
        </span>
      </div>
    </div>
  );
};

export default UserDashboard;
