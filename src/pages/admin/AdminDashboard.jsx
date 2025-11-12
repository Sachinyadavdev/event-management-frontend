// Enhanced Admin Dashboard Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/apiEndpoints';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await dashboardAPI.getStats();
        
        // Transform backend data to frontend format
        const transformedStats = [
          { 
            name: 'Total Members', 
            value: data.totalUsers?.toString() || '0', 
            change: '+12%', // Can be calculated from historical data if available
            changeType: 'increase',
            icon: '👥',
            trend: [40, 45, 42, 48, 52, 55, data.totalUsers || 0]
          },
          { 
            name: 'Active Events', 
            value: data.upcomingEvents?.toString() || '0', 
            change: `${data.upcomingEvents > data.totalEvents / 2 ? '+' : ''}${data.upcomingEvents}`, 
            changeType: 'increase',
            icon: '📅',
            trend: [6, 7, 6, 8, 7, 8, data.upcomingEvents || 0]
          },
          { 
            name: 'Total Events', 
            value: data.totalEvents?.toString() || '0', 
            change: '+5.4%', 
            changeType: 'increase',
            icon: '🎯',
            trend: [10, 11, 10, 12, 12, 12, data.totalEvents || 0]
          },
          { 
            name: 'Total Registrations', 
            value: data.totalRegistrations?.toString() || '0', 
            change: `+${data.totalRegistrations}`, 
            changeType: 'increase',
            icon: '📝',
            trend: [30, 25, 28, 22, 26, 25, data.totalRegistrations || 0]
          },
        ];
        
        setStats(transformedStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const recentActivities = [
    { 
      id: 1, 
      type: 'member', 
      message: 'New member John Doe registered', 
      time: '2 hours ago',
      avatar: '👤',
      priority: 'normal'
    },
    { 
      id: 2, 
      type: 'event', 
      message: 'Cybersecurity Workshop scheduled for March 15', 
      time: '4 hours ago',
      avatar: '🎯',
      priority: 'high'
    },
    { 
      id: 3, 
      type: 'payment', 
      message: 'Payment received from Jane Smith ($150)', 
      time: '6 hours ago',
      avatar: '💳',
      priority: 'normal'
    },
    { 
      id: 4, 
      type: 'member', 
      message: 'Member profile updated - Mike Johnson', 
      time: '1 day ago',
      avatar: '✏️',
      priority: 'low'
    },
    { 
      id: 5, 
      type: 'system', 
      message: 'Monthly newsletter sent to 1,200 members', 
      time: '2 days ago',
      avatar: '📧',
      priority: 'normal'
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Cybersecurity Best Practices Workshop',
      date: 'March 15, 2025',
      time: '2:00 PM - 5:00 PM',
      registered: 45,
      capacity: 60,
      status: 'active',
      location: 'Silicon Valley Convention Center'
    },
    {
      id: 2,
      title: 'Risk Management Seminar',
      date: 'March 22, 2025',
      time: '6:00 PM - 8:00 PM',
      registered: 32,
      capacity: 50,
      status: 'planning',
      location: 'Online Webinar'
    },
    {
      id: 3,
      title: 'Annual ISACA Conference',
      date: 'April 10, 2025',
      time: '9:00 AM - 6:00 PM',
      registered: 120,
      capacity: 200,
      status: 'featured',
      location: 'San Francisco Marriott'
    }
  ];

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Schedule new event',
      icon: '📅',
      color: 'bg-blue-500 hover:bg-blue-600',
      route: '/admin/events'
    },
    {
      title: 'Add Member',
      description: 'Register new member',
      icon: '👤',
      color: 'bg-green-500 hover:bg-green-600',
      route: '/admin/users'
    },
    {
      title: 'Send Newsletter',
      description: 'Broadcast message',
      icon: '📧',
      color: 'bg-purple-500 hover:bg-purple-600',
      route: '/admin/content'
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: '📊',
      color: 'bg-orange-500 hover:bg-orange-600',
      route: '/admin/settings'
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Welcome back, Admin! 👋</h2>
            <p className="mt-2 text-blue-100 text-lg">
              Here's what's happening with your ISACA Silicon Valley chapter
            </p>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-sm">Total Active</div>
            <div className="text-2xl font-bold">1,245 Members</div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Overview</h3>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Failed to load statistics</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat, index) => (
          <div 
            key={stat.name} 
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/25 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="mt-4">
                <div className="flex items-end space-x-1 h-8">
                  {stat.trend.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        stat.changeType === 'increase' ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'
                      }`}
                      style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                <Link 
                  to="/admin/activities" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        activity.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                        activity.priority === 'normal' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {activity.avatar}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.message}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        {activity.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.route}
                  className={`block w-full ${action.color} text-white px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{action.icon}</span>
                    <div>
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Member Stats */}
          <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Stats</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Members</span>
                <span className="font-semibold text-gray-900 dark:text-white">1,180</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">New This Month</span>
                <span className="font-semibold text-green-600 dark:text-green-400">+24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Renewals</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">65</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/admin/users"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Manage Members →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
            <Link 
              to="/admin/events" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Manage Events
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        event.status === 'planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                        {event.status === 'featured' ? 'Featured' : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📅 {event.date} • ⏰ {event.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📍 {event.location}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{event.registered}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">/ {event.capacity} registered</span>
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {Math.round((event.registered / event.capacity) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-32"></div>
    
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-xl h-32"></div>
      ))}
    </div>
    
    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-gray-300 dark:bg-gray-700 rounded-xl h-96"></div>
      <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-96"></div>
    </div>
  </div>
);

export default AdminDashboard;