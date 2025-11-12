import React from 'react';

const UserProfileModal = ({ isOpen, onClose, user, onEditUser }) => {
  if (!isOpen || !user) return null;

  // Handle different field names from mock data
  const userName = user.name || user.fullName || 'Unknown User';
  const userEmail = user.email || 'No email provided';

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMembershipTypeColor = (type) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'basic':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade animation */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal with scale and fade animation */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header with proper gradient and animations */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 border-b border-blue-500/20">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90"></div>
          <div className="absolute inset-0 bg-white/5"></div>
          
          {/* Header content */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Icon with glow effect */}
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30 shadow-lg">
                <svg className="w-4 h-4 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-sm">User Profile</h3>
            </div>
            
            {/* Close button with hover animations */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105 flex items-center justify-center text-white transition-all duration-200 ring-1 ring-white/30 hover:ring-white/50 shadow-lg group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          
          {/* Profile Header Section */}
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={userName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                    <span className="text-2xl font-bold text-white drop-shadow-sm">
                      {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                
                {/* Status indicator with pulse animation */}
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                  user.status === 'active' ? 'bg-green-500 animate-pulse' : 
                  user.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {user.status === 'active' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{userName}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {userEmail}
                </p>
                
                {/* Status and Membership badges with hover effects */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${getStatusColor(user.status)}`}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        user.status === 'active' ? 'bg-green-500 animate-pulse' : 
                        user.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      {user.status || 'Unknown'}
                    </div>
                  </span>
                  
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${getMembershipTypeColor(user.membershipType)}`}>
                    {user.membershipType || 'Basic'} Member
                  </span>
                  {user.eventsAttended > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {user.eventsAttended} Events
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Full Name:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{userName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white break-all">{userEmail}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.phone || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">ID:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white font-mono">{user.id || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Professional Details
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Department:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.department || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Position:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.position || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Company:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.company || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Location:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.location || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Experience:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">
                    {user.yearsExperience || user.experienceYears ? 
                      `${user.yearsExperience || user.experienceYears} years` : 'Not specified'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Membership Details
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.membershipType || 'Basic'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Start Date:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{formatDate(user.joinedDate)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Renewal:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{formatDate(user.renewalDate)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Events Attended:</span>
                  <span className="col-span-2 font-semibold text-blue-600 dark:text-blue-400">{user.eventsAttended || user.attendedEvents || 0}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status || 'Unknown'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Certification & CPE Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Certifications & CPE
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Certificates:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">
                    {user.certificates && user.certificates.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.certificates.map((cert, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded text-xs font-medium">
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 italic">No certificates</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">CPE Score:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        {user.cpeScore || user.cpePoints || 0}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">CPE Points</span>
                      {(user.cpeScore || user.cpePoints || 0) >= 40 && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">CPE Status:</span>
                  <span className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (user.cpeScore || user.cpePoints || 0) >= 40 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : (user.cpeScore || user.cpePoints || 0) >= 20
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {(user.cpeScore || user.cpePoints || 0) >= 40 ? 'Compliant' : 
                       (user.cpeScore || user.cpePoints || 0) >= 20 ? 'In Progress' : 'Non-Compliant'}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Last CPE Update:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{formatDate(user.lastCpeUpdate)}</span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Last Login:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{formatDate(user.lastLogin)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Role:</span>
                  <span className="col-span-2 text-gray-900 dark:text-white">{user.role || 'Member'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Verified:</span>
                  <span className="col-span-2">
                    {user.verified ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Not verified</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if (onEditUser) {
                    onEditUser(user);
                    onClose(); // Close the profile modal when opening edit modal
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;