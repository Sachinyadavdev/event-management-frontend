// Agenda Management Component for Events
import React, { useState } from 'react';

const AgendaForm = ({ agenda = [], speakers = [], onUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    start: '',
    end: '',
    title: '',
    description: '',
    speakers: [],
    type: 'session'
  });

  const addAgendaItem = () => {
    if (!newItem.title.trim() || !newItem.start || !newItem.end) return;
    
    const item = {
      ...newItem,
      id: Date.now().toString()
    };
    
    const sortedAgenda = [...agenda, item].sort((a, b) => 
      new Date(`2000-01-01 ${a.start}`) - new Date(`2000-01-01 ${b.start}`)
    );
    
    onUpdate(sortedAgenda);
    setNewItem({
      start: '',
      end: '',
      title: '',
      description: '',
      speakers: [],
      type: 'session'
    });
  };

  const updateAgendaItem = (id, updatedItem) => {
    const updated = agenda.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ).sort((a, b) => 
      new Date(`2000-01-01 ${a.start}`) - new Date(`2000-01-01 ${b.start}`)
    );
    onUpdate(updated);
    setEditingItem(null);
  };

  const removeAgendaItem = (id) => {
    const filtered = agenda.filter(item => item.id !== id);
    onUpdate(filtered);
  };

  const duplicateAgendaItem = (item) => {
    const duplicated = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`
    };
    onUpdate([...agenda, duplicated]);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const AgendaItemCard = ({ item, isEditing, onEdit, onSave, onCancel, onRemove, onDuplicate }) => {
    const [editData, setEditData] = useState(item);

    const handleSpeakerToggle = (speakerId) => {
      const currentSpeakers = editData.speakers || [];
      const updatedSpeakers = currentSpeakers.includes(speakerId)
        ? currentSpeakers.filter(id => id !== speakerId)
        : [...currentSpeakers, speakerId];
      setEditData({ ...editData, speakers: updatedSpeakers });
    };

    if (isEditing) {
      return (
        <div className="border border-blue-300 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={editData.start}
                onChange={(e) => setEditData({...editData, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={editData.end}
                onChange={(e) => setEditData({...editData, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={editData.type}
              onChange={(e) => setEditData({...editData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="session">Session</option>
              <option value="break">Break</option>
              <option value="lunch">Lunch</option>
              <option value="networking">Networking</option>
              <option value="keynote">Keynote</option>
              <option value="panel">Panel Discussion</option>
              <option value="workshop">Workshop</option>
              <option value="qa">Q&A</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {speakers.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speakers
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {speakers.map((speaker) => (
                  <label key={speaker.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(editData.speakers || []).includes(speaker.id)}
                      onChange={() => handleSpeakerToggle(speaker.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {speaker.name} {speaker.title && `- ${speaker.title}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(editData)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    const getTypeIcon = (type) => {
      const icons = {
        session: '📋',
        break: '☕',
        lunch: '🍽️',
        networking: '🤝',
        keynote: '🎤',
        panel: '👥',
        workshop: '🛠️',
        qa: '❓'
      };
      return icons[type] || '📋';
    };

    const getTypeColor = (type) => {
      const colors = {
        session: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        break: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        lunch: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        networking: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        keynote: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        panel: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        workshop: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        qa: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      };
      return colors[type] || colors.session;
    };

    const getDuration = () => {
      if (!item.start || !item.end) return '';
      const start = new Date(`2000-01-01 ${item.start}`);
      const end = new Date(`2000-01-01 ${item.end}`);
      const diffMs = end - start;
      const diffMins = Math.round(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      
      if (hours === 0) return `${minutes}m`;
      if (minutes === 0) return `${hours}h`;
      return `${hours}h ${minutes}m`;
    };

    return (
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(item.type)}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatTime(item.start)} - {formatTime(item.end)} 
                {getDuration() && <span className="ml-1">({getDuration()})</span>}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {item.title}
            </h4>
            
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {item.description}
              </p>
            )}
            
            {item.speakers && item.speakers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.speakers.map(speakerId => {
                  const speaker = speakers.find(s => s.id === speakerId);
                  return speaker ? (
                    <span key={speakerId} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      👤 {speaker.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
          
          <div className="flex space-x-1 ml-4">
            <button
              onClick={() => onDuplicate()}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="Duplicate item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="Edit item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onRemove}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Remove item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Event Agenda</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {agenda.length} item{agenda.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add New Agenda Item Form */}
      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add Agenda Item</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="time"
            placeholder="Start time"
            value={newItem.start}
            onChange={(e) => setNewItem({...newItem, start: e.target.value})}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="time"
            placeholder="End time"
            value={newItem.end}
            onChange={(e) => setNewItem({...newItem, end: e.target.value})}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Session title *"
            value={newItem.title}
            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="session">Session</option>
            <option value="break">Break</option>
            <option value="lunch">Lunch</option>
            <option value="networking">Networking</option>
            <option value="keynote">Keynote</option>
            <option value="panel">Panel Discussion</option>
            <option value="workshop">Workshop</option>
            <option value="qa">Q&A</option>
          </select>
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={addAgendaItem}
            disabled={!newItem.title.trim() || !newItem.start || !newItem.end}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Agenda Timeline */}
      <div className="space-y-4">
        {agenda.map((item) => (
          <AgendaItemCard
            key={item.id}
            item={item}
            isEditing={editingItem === item.id}
            onEdit={() => setEditingItem(item.id)}
            onSave={(updatedItem) => updateAgendaItem(item.id, updatedItem)}
            onCancel={() => setEditingItem(null)}
            onRemove={() => removeAgendaItem(item.id)}
            onDuplicate={() => duplicateAgendaItem(item)}
          />
        ))}
      </div>

      {agenda.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No agenda items yet</p>
          <p className="text-sm">Add agenda items to organize your event schedule</p>
        </div>
      )}
    </div>
  );
};

export default AgendaForm;