import React from 'react';

const AgendaTab = ({ formData, handleArrayAdd, handleArrayUpdate, handleArrayRemove }) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header Section with Proper Spacing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Agenda</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a detailed schedule for your event
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => handleArrayAdd('agenda', {
                id: Date.now().toString(),
                start: '',
                end: '',
                title: '',
                description: '',
                speakers: []
              })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-lg border border-indigo-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Agenda Item
            </button>
          </div>
        </div>
      </div>

      {/* Show message when no agenda items */}
      {(!formData.agenda || formData.agenda.length === 0) && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4">No agenda items yet</h4>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Add Agenda Item" to start building your schedule</p>
        </div>
      )}

      {/* Agenda Items List */}
      <div className="grid gap-4">
        {(formData.agenda || []).map((item, index) => (
          <div key={item.id || index} className="relative border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow">
            {/* Item Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Agenda Item {index + 1}</h4>
              </div>
              <button
                type="button"
                onClick={() => handleArrayRemove('agenda', index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                title="Remove this item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Time Inputs */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Time *
                </label>
                <input
                  type="time"
                  value={item.start || ''}
                  onChange={(e) => handleArrayUpdate('agenda', index, { ...item, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  End Time *
                </label>
                <input
                  type="time"
                  value={item.end || ''}
                  onChange={(e) => handleArrayUpdate('agenda', index, { ...item, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Session Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Session Title *
              </label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleArrayUpdate('agenda', index, { ...item, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Keynote: AI & Threats 2025"
                required
              />
            </div>

            {/* Session Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Session Description
              </label>
              <textarea
                value={item.description || ''}
                onChange={(e) => handleArrayUpdate('agenda', index, { ...item, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe what will happen in this session..."
              />
            </div>

            {/* Session Speakers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Session Speakers
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(formData.speakers || []).map((speaker) => (
                  <label key={speaker.id} className="flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(item.speakers || []).includes(speaker.id)}
                      onChange={(e) => {
                        const currentSpeakers = item.speakers || [];
                        const newSpeakers = e.target.checked
                          ? [...currentSpeakers, speaker.id]
                          : currentSpeakers.filter(id => id !== speaker.id);
                        handleArrayUpdate('agenda', index, { ...item, speakers: newSpeakers });
                      }}
                      className="h-4 w-4 text-primary-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {speaker.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {speaker.title} at {speaker.company}
                      </div>
                    </div>
                  </label>
                ))}
                {(!formData.speakers || formData.speakers.length === 0) && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    No speakers added yet. Add speakers in the Speakers tab first.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaTab;
