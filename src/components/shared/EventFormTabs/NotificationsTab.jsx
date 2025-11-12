import React from 'react';

const NotificationsTab = ({ formData, handleArrayAdd, handleArrayUpdate, handleArrayRemove }) => {
  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A10.015 10.015 0 004 10c0 5.523 4.477 10 10 10a10.015 10.015 0 005.172-.828l-1.414-1.414A8.015 8.015 0 0115 18a8 8 0 01-8-8 8.015 8.015 0 011.414-3.758L4.828 4.828z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Event Updates & Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Create and manage important announcements for your event attendees.<br/>
                <span className="text-xs text-gray-500 dark:text-gray-400">Updates will be displayed on the event details page in chronological order.</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleArrayAdd('notifications', {
              id: Date.now().toString(),
              title: '',
              body: '',
              createdAt: new Date().toISOString()
            })}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Update
          </button>
        </div>
      </div>

      {/* Empty State */}
      {(!formData.notifications || formData.notifications.length === 0) && (
        <div className="relative text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-indigo-500 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-purple-500 rounded-full"></div>
            <div className="absolute bottom-4 right-12 w-10 h-10 bg-blue-400 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4.828 4.828A10.015 10.015 0 004 10c0 5.523 4.477 10 10 10a10.015 10.015 0 005.172-.828l-1.414-1.414A8.015 8.015 0 0115 18a8 8 0 01-8-8 8.015 8.015 0 011.414-3.758L4.828 4.828z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Event Updates Yet</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
              Keep your attendees informed with important announcements, schedule changes, and event highlights.
            </p>
            <button
              type="button"
              onClick={() => handleArrayAdd('notifications', {
                id: Date.now().toString(),
                title: '',
                body: '',
                createdAt: new Date().toISOString()
              })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Update
            </button>
          </div>
        </div>
      )}
      
      {/* Notifications List */}
      <div className="space-y-6">
        {(formData.notifications || []).map((notification, index) => (
          <div key={notification.id || index} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {notification.title || 'Untitled Update'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Update #{index + 1}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleArrayRemove('notifications', index)}
                  className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group/delete"
                  title="Remove this notification"
                >
                  <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    Update Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={notification.title || ''}
                    onChange={(e) => handleArrayUpdate('notifications', index, { ...notification, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g., Schedule Change, Parking Update, Important Announcement"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-md">
                      <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Update Message
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={notification.body || ''}
                    onChange={(e) => handleArrayUpdate('notifications', index, { ...notification, body: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    placeholder="Provide detailed information about this update..."
                    rows={4}
                    required
                  />
                </div>

                {/* Date Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-center w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                      <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Publication Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={(() => {
                      if (!notification.createdAt) return '';
                      const date = new Date(notification.createdAt);
                      const offsetMs = date.getTimezoneOffset() * 60 * 1000;
                      const localDate = new Date(date.getTime() - offsetMs);
                      return localDate.toISOString().slice(0, 16);
                    })()}
                    onChange={(e) => handleArrayUpdate('notifications', index, { 
                      ...notification, 
                      createdAt: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() 
                    })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    This date will be shown to attendees as when the update was published
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
