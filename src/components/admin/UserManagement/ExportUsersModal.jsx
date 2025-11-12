import React, { useState } from 'react';

const ExportUsersModal = ({ isOpen, onClose, users, filters }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'xlsx',
    fields: {
      basicInfo: true,
      contactInfo: true,
      professionalInfo: true,
      membershipInfo: true,
      timestamps: true,
      customFields: false
    },
    filters: {
      applyCurrentFilters: true,
      dateRange: 'all',
      customDateStart: '',
      customDateEnd: ''
    }
  });
  
  const [isExporting, setIsExporting] = useState(false);

  const availableFields = {
    basicInfo: [
      { key: 'id', label: 'User ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'status', label: 'Account Status' }
    ],
    contactInfo: [
      { key: 'phone', label: 'Phone Number' },
      { key: 'linkedinProfile', label: 'LinkedIn Profile' },
      { key: 'currentCompany', label: 'Current Company' },
      { key: 'jobTitle', label: 'Job Title' }
    ],
    professionalInfo: [
      { key: 'professionalStatus', label: 'Professional Status' },
      { key: 'yearsExperience', label: 'Years of Experience' },
      { key: 'industrySector', label: 'Industry Sector' },
      { key: 'specializations', label: 'Specializations' },
      { key: 'certifications', label: 'Certifications' },
      { key: 'bio', label: 'Professional Bio' }
    ],
    membershipInfo: [
      { key: 'membershipType', label: 'Membership Type' },
      { key: 'membershipExpiry', label: 'Membership Expiry' },
      { key: 'eventsAttended', label: 'Events Attended' },
      { key: 'receiveEmails', label: 'Email Notifications' }
    ],
    timestamps: [
      { key: 'createdAt', label: 'Registration Date' },
      { key: 'lastLogin', label: 'Last Login' },
      { key: 'updatedAt', label: 'Last Updated' }
    ],
    customFields: [
      { key: 'university', label: 'University (Students)' },
      { key: 'degreeProgram', label: 'Degree Program (Students)' },
      { key: 'fieldOfStudy', label: 'Field of Study (Students)' },
      { key: 'expectedGraduation', label: 'Expected Graduation (Students)' },
      { key: 'graduationDate', label: 'Graduation Date (Graduates)' },
      { key: 'degreeObtained', label: 'Degree Obtained (Graduates)' },
      { key: 'jobSearchStatus', label: 'Job Search Status (Graduates)' }
    ]
  };

  const handleFieldGroupToggle = (group) => {
    setExportOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [group]: !prev.fields[group]
      }
    }));
  };

  const getFilteredUsers = () => {
    let filteredUsers = [...users];

    if (exportOptions.filters.applyCurrentFilters) {
      // Apply current filters from parent component
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phone.includes(searchTerm)
        );
      }

      if (filters.membershipType) {
        filteredUsers = filteredUsers.filter(user => user.membershipType === filters.membershipType);
      }

      if (filters.professionalStatus) {
        filteredUsers = filteredUsers.filter(user => user.professionalStatus === filters.professionalStatus);
      }

      if (filters.industry) {
        filteredUsers = filteredUsers.filter(user => user.industrySector === filters.industry);
      }

      if (filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
    }

    // Apply date range filter
    if (exportOptions.filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (exportOptions.filters.dateRange) {
        case 'last30':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'lastYear':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          startDate = exportOptions.filters.customDateStart ? new Date(exportOptions.filters.customDateStart) : null;
          const endDate = exportOptions.filters.customDateEnd ? new Date(exportOptions.filters.customDateEnd) : null;
          
          filteredUsers = filteredUsers.filter(user => {
            const userDate = new Date(user.createdAt);
            if (startDate && userDate < startDate) return false;
            if (endDate && userDate > endDate) return false;
            return true;
          });
          return filteredUsers;
        default:
          return filteredUsers;
      }

      if (startDate) {
        filteredUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= startDate;
        });
      }
    }

    return filteredUsers;
  };

  const generateCSV = (data, selectedFields) => {
    const headers = selectedFields.map(field => field.label);
    const csvContent = [
      headers.join(','),
      ...data.map(user => 
        selectedFields.map(field => {
          let value = user[field.key] || '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const generateJSONData = (data, selectedFields) => {
    return data.map(user => {
      const filteredUser = {};
      selectedFields.forEach(field => {
        filteredUser[field.key] = user[field.key];
      });
      return filteredUser;
    });
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Get selected fields
      const selectedFields = [];
      Object.entries(exportOptions.fields).forEach(([group, isSelected]) => {
        if (isSelected && availableFields[group]) {
          selectedFields.push(...availableFields[group]);
        }
      });

      // Remove duplicates
      const uniqueFields = selectedFields.filter((field, index, self) => 
        index === self.findIndex(f => f.key === field.key)
      );

      // Get filtered data
      const filteredUsers = getFilteredUsers();
      
      if (filteredUsers.length === 0) {
        alert('No users match the selected criteria.');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      
      if (exportOptions.format === 'csv') {
        const csvContent = generateCSV(filteredUsers, uniqueFields);
        downloadFile(csvContent, `users_export_${timestamp}.csv`, 'text/csv;charset=utf-8;');
      } else if (exportOptions.format === 'json') {
        const jsonData = generateJSONData(filteredUsers, uniqueFields);
        downloadFile(JSON.stringify(jsonData, null, 2), `users_export_${timestamp}.json`, 'application/json');
      } else if (exportOptions.format === 'xlsx') {
        // For Excel format, we'll simulate the export with CSV for now
        // In a real application, you'd use a library like SheetJS or similar
        const csvContent = generateCSV(filteredUsers, uniqueFields);
        downloadFile(csvContent, `users_export_${timestamp}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }

      // Show success message and close modal
      alert(`Successfully exported ${filteredUsers.length} users!`);
      onClose();
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export users. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const filteredCount = getFilteredUsers().length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Export Users</h2>
                  <p className="text-white/90 text-sm">
                    Export user data in multiple formats
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* Export Format */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Export Format
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'xlsx', label: 'Excel (.xlsx)', icon: '📊' },
                  { value: 'csv', label: 'CSV (.csv)', icon: '📋' },
                  { value: 'json', label: 'JSON (.json)', icon: '🔧' }
                ].map((format) => (
                  <label
                    key={format.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportOptions.format === format.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={exportOptions.format === format.value}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{format.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {format.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Data Fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Data Fields to Export
              </h3>
              <div className="space-y-3">
                {Object.entries(availableFields).map(([group, fields]) => (
                  <div
                    key={group}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {group.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({fields.length} fields)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={exportOptions.fields[group]}
                        onChange={() => handleFieldGroupToggle(group)}
                        className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                      />
                    </label>
                    
                    {exportOptions.fields[group] && (
                      <div className="mt-3 pl-4 border-l-2 border-green-200 dark:border-green-800">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                          {fields.map((field) => (
                            <div key={field.key} className="flex items-center">
                              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {field.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Export Filters
              </h3>
              
              <div className="space-y-4">
                {/* Apply Current Filters */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.filters.applyCurrentFilters}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      filters: { ...prev.filters, applyCurrentFilters: e.target.checked }
                    }))}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Apply current search and filter settings
                  </span>
                </label>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Date Range
                  </label>
                  <select
                    value={exportOptions.filters.dateRange}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      filters: { ...prev.filters, dateRange: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Time</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="lastYear">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                {exportOptions.filters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.filters.customDateStart}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          filters: { ...prev.filters, customDateStart: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.filters.customDateEnd}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          filters: { ...prev.filters, customDateEnd: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Preview */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Export Preview
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Format: {exportOptions.format.toUpperCase()}</p>
                <p>• Records to export: <span className="font-medium text-green-600">{filteredCount}</span></p>
                <p>• Field groups: {Object.values(exportOptions.fields).filter(Boolean).length} selected</p>
                <p>• Filters: {exportOptions.filters.applyCurrentFilters ? 'Applied' : 'Not applied'}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredCount} users will be exported
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isExporting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting || filteredCount === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isExporting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Users
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportUsersModal;