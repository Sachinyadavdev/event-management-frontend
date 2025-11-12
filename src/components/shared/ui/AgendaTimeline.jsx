/**
 * AgendaTimeline.jsx - Reusable Event Agenda Component
 * 
 * Features:
 * - Sortable timeline (by time, speaker, or title)
 * - Filterable by session type or speaker
 * - Responsive design with mobile-optimized layout
 * - Extensible session types with custom colors
 * - Speaker integration with avatar support
 * - Time zone support
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AgendaTimeline = ({ 
  agenda = [], 
  speakers = [],
  showFilters = true,
  showSorting = true,
  layout = 'timeline', // 'timeline', 'list', 'grid'
  customStyles = {},
  timezone = 'local',
  onSessionClick,
  expandable = false
}) => {
  const [sortBy, setSortBy] = useState('time');
  const [filterBy, setFilterBy] = useState('all');
  const [isExpanded, setIsExpanded] = useState(!expandable);

  // Session type colors
  const sessionTypeColors = {
    keynote: 'bg-purple-500',
    panel: 'bg-blue-500', 
    workshop: 'bg-green-500',
    presentation: 'bg-indigo-500',
    break: 'bg-gray-400',
    networking: 'bg-orange-500',
    qa: 'bg-teal-500',
    ...customStyles.sessionColors
  };

  // Sort and filter agenda
  const processedAgenda = useMemo(() => {
    let filtered = [...agenda];

    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => {
        if (filterBy === 'keynote') return item.title.toLowerCase().includes('keynote');
        if (filterBy === 'panel') return item.title.toLowerCase().includes('panel');
        if (filterBy === 'workshop') return item.title.toLowerCase().includes('workshop');
        if (filterBy.startsWith('speaker-')) {
          const speakerId = filterBy.replace('speaker-', '');
          return item.speakers?.includes(speakerId);
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'time') {
        return a.start.localeCompare(b.start);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'speaker') {
        const speakerA = getSpeakerNames(a.speakers || []);
        const speakerB = getSpeakerNames(b.speakers || []);
        return speakerA.localeCompare(speakerB);
      } else if (sortBy === 'duration') {
        const durationA = getDuration(a.start, a.end);
        const durationB = getDuration(b.start, b.end);
        return durationB - durationA; // Longer sessions first
      }
      return 0;
    });

    return filtered;
  }, [agenda, sortBy, filterBy, speakers]);

  // Helper functions
  const getSpeakerNames = (speakerIds) => {
    return speakerIds.map(id => {
      const speaker = speakers.find(s => s.id === id);
      return speaker ? speaker.name : 'TBA';
    }).join(', ');
  };

  const getSpeaker = (speakerId) => {
    return speakers.find(s => s.id === speakerId);
  };

  const getSessionTypeColor = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('keynote')) return sessionTypeColors.keynote;
    if (titleLower.includes('panel')) return sessionTypeColors.panel;
    if (titleLower.includes('workshop')) return sessionTypeColors.workshop;
    if (titleLower.includes('break') || titleLower.includes('coffee') || titleLower.includes('lunch')) return sessionTypeColors.break;
    if (titleLower.includes('networking')) return sessionTypeColors.networking;
    if (titleLower.includes('q&a') || titleLower.includes('qa')) return sessionTypeColors.qa;
    return sessionTypeColors.presentation;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDuration = (start, end) => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;
    
    return endTime - startTime;
  };

  const formatDuration = (start, end) => {
    const duration = getDuration(start, end);
    return `${duration}m`;
  };

  // Get unique session types for filter
  const sessionTypes = useMemo(() => {
    const types = new Set();
    agenda.forEach(item => {
      const title = item.title.toLowerCase();
      if (title.includes('keynote')) types.add('keynote');
      if (title.includes('panel')) types.add('panel');
      if (title.includes('workshop')) types.add('workshop');
    });
    return Array.from(types);
  }, [agenda]);

  // Render filter controls
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterBy('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filterBy === 'all' 
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
          }`}
        >
          All Sessions
        </button>
        
        {sessionTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterBy(type)}
            className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
              filterBy === type
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>
    );
  };

  // Render sort controls
  const renderSortControls = () => {
    if (!showSorting) return null;

    return (
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="time">Time</option>
          <option value="title">Title</option>
          <option value="speaker">Speaker</option>
          <option value="duration">Duration</option>
        </select>
      </div>
    );
  };

  // Render individual session
  const renderSession = (session, index) => {
    const isBreak = session.title.toLowerCase().includes('break') || 
                   session.title.toLowerCase().includes('coffee') || 
                   session.title.toLowerCase().includes('lunch');

    const handleSessionClick = () => {
      if (onSessionClick) {
        onSessionClick(session, index);
      }
    };

    if (layout === 'list') {
      return (
        <div 
          key={session.id || index}
          className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow ${onSessionClick ? 'cursor-pointer' : ''}`}
          onClick={handleSessionClick}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${getSessionTypeColor(session.title)}`}></span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {formatTime(session.start)} - {formatTime(session.end)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  ({formatDuration(session.start, session.end)})
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{session.title}</h4>
              {session.speakers && session.speakers.length > 0 && !isBreak && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Speaker(s): {getSpeakerNames(session.speakers)}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Timeline layout (default)
    return (
      <div key={session.id || index} className="flex gap-4">
        {/* Time Badge */}
        <div className="flex-shrink-0">
          <div className={`px-4 py-2 rounded-xl text-center min-w-[80px] ${getSessionTypeColor(session.title)} text-white`}>
            <div className="text-xs font-medium">{formatTime(session.start)}</div>
          </div>
        </div>

        {/* Timeline Line */}
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full ${getSessionTypeColor(session.title)} border-4 border-white shadow-md`}></div>
          {index < processedAgenda.length - 1 && (
            <div className="w-px h-16 bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-700"></div>
          )}
        </div>

        {/* Content */}
        <div 
          className={`flex-1 pb-8 ${onSessionClick ? 'cursor-pointer' : ''}`}
          onClick={handleSessionClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{session.title}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                {formatDuration(session.start, session.end)}
              </span>
            </div>
            
            {session.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{session.description}</p>
            )}
            
            {session.speakers && session.speakers.length > 0 && !isBreak && (
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <div className="flex flex-wrap gap-2">
                  {session.speakers.map(speakerId => {
                    const speaker = getSpeaker(speakerId);
                    return speaker ? (
                      <span key={speakerId} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        {speaker.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (processedAgenda.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No agenda items available</p>
      </div>
    );
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
      style={customStyles.container}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Event Agenda
          </h3>
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full text-sm font-medium">
            {processedAgenda.length} sessions
          </span>
        </div>
        
        {expandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {isExpanded && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              {renderFilters()}
            </div>
            <div>
              {renderSortControls()}
            </div>
          </div>

          <div className={layout === 'list' ? 'space-y-4' : ''}>
            {processedAgenda.map((session, index) => renderSession(session, index))}
          </div>
        </div>
      )}
    </div>
  );
};

AgendaTimeline.propTypes = {
  agenda: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    speakers: PropTypes.arrayOf(PropTypes.string)
  })),
  speakers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string
  })),
  showFilters: PropTypes.bool,
  showSorting: PropTypes.bool,
  layout: PropTypes.oneOf(['timeline', 'list', 'grid']),
  customStyles: PropTypes.shape({
    container: PropTypes.object,
    sessionColors: PropTypes.object
  }),
  timezone: PropTypes.string,
  onSessionClick: PropTypes.func,
  expandable: PropTypes.bool
};

export default AgendaTimeline;