import React, { useState } from 'react';

const UserFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const membershipTypes = [
    { value: 'premium', label: 'Premium' },
    { value: 'basic', label: 'Basic' },
    { value: 'student', label: 'Student' },
    { value: 'trial', label: 'Trial' }
  ];

  const professionalStatuses = [
    { value: 'working-professional', label: 'Working Professional' },
    { value: 'student', label: 'Student' },
    { value: 'recent-graduate', label: 'Recent Graduate' },
    { value: 'career-changer', label: 'Career Changer' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'entrepreneur', label: 'Entrepreneur' }
  ];

  const industries = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Government', label: 'Government' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const handleInputChange = (field, value) => {
    const newFilters = { ...tempFilters };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newFilters[parent] = { ...newFilters[parent], [child]: value };
    } else {
      newFilters[field] = value;
    }
    
    setTempFilters(newFilters);
    
    // Apply search filter immediately for better UX
    if (field === 'search') {
      onFilterChange(newFilters);
    }
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      membershipType: '',
      professionalStatus: '',
      industry: '',
      status: 'all',
      dateRange: { start: '', end: '' }
    };
    setTempFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.membershipType ||
      filters.professionalStatus ||
      filters.industry ||
      filters.status !== 'all' ||
      filters.dateRange.start ||
      filters.dateRange.end
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Basic Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={tempFilters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={tempFilters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Membership Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Membership Type
            </label>
            <select
              value={tempFilters.membershipType}
              onChange={(e) => handleInputChange('membershipType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">All Memberships</option>
              {membershipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Advanced Filters */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>

          <div className="flex items-center gap-3">
            {hasActiveFilters() && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Object.values(filters).filter(Boolean).length} filter(s) active
              </span>
            )}
            
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Clear All
            </button>
            
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Professional Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Professional Status
              </label>
              <select
                value={tempFilters.professionalStatus}
                onChange={(e) => handleInputChange('professionalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="">All Statuses</option>
                {professionalStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry Sector
              </label>
              <select
                value={tempFilters.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Date From
              </label>
              <input
                type="date"
                value={tempFilters.dateRange.start}
                onChange={(e) => handleInputChange('dateRange.start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Date To
              </label>
              <input
                type="date"
                value={tempFilters.dateRange.end}
                onChange={(e) => handleInputChange('dateRange.end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...tempFilters, status: 'pending' };
                  setTempFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                Pending Approval
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...tempFilters, membershipType: 'premium' };
                  setTempFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
              >
                Premium Members
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
                  const newFilters = {
                    ...tempFilters,
                    dateRange: {
                      start: thirtyDaysAgo.toISOString().split('T')[0],
                      end: today.toISOString().split('T')[0]
                    }
                  };
                  setTempFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                New This Month
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...tempFilters, professionalStatus: 'student' };
                  setTempFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;