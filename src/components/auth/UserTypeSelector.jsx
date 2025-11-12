import React from 'react';

const UserTypeSelector = ({ userType, setUserType, register }) => {
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  return (
    <div className="user-type-selector">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Membership Status
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Member Option */}
        <label className={`
          relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${userType === 'member'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
          }
        `}>
          <input
            type="radio"
            value="member"
            {...register('userType', { required: true })}
            onChange={() => handleUserTypeChange('member')}
            className="sr-only"
          />
          <div className="text-center">
            <div className={`
              w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center
              ${userType === 'member' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }
            `}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Member</span>
            <p className="text-xs mt-1 opacity-75">Current ISACA member</p>
          </div>
          
          {/* Selected Indicator */}
          {userType === 'member' && (
            <div className="absolute top-2 right-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </label>

        {/* Non-Member Option */}
        <label className={`
          relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${userType === 'non-member'
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
          }
        `}>
          <input
            type="radio"
            value="non-member"
            {...register('userType', { required: true })}
            onChange={() => handleUserTypeChange('non-member')}
            className="sr-only"
          />
          <div className="text-center">
            <div className={`
              w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center
              ${userType === 'non-member' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }
            `}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium">Non-Member</span>
            <p className="text-xs mt-1 opacity-75">Not yet a member</p>
          </div>
          
          {/* Selected Indicator */}
          {userType === 'non-member' && (
            <div className="absolute top-2 right-2">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default UserTypeSelector;