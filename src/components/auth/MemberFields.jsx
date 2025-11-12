import React from 'react';
import FormField from './FormField';

const MemberFields = ({ register, errors }) => {
  return (
    <div className="member-fields">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        Member Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Membership ID"
          name="membershipId"
          type="text"
          placeholder="e.g., ISACA123456"
          register={register}
          validation={{
            required: 'Membership ID is required for members',
            pattern: {
              value: /^[A-Za-z0-9]{6,20}$/,
              message: 'Invalid membership ID format'
            }
          }}
          error={errors.membershipId}
          required
        />

        <FormField
          label="Organization"
          name="organization"
          type="text"
          placeholder="Your current organization"
          register={register}
          validation={{
            required: 'Organization is required for members'
          }}
          error={errors.organization}
          required
        />

        <FormField
          label="Job Title/Designation"
          name="designation"
          type="text"
          placeholder="e.g., IT Security Manager"
          register={register}
          validation={{
            required: 'Designation is required for members'
          }}
          error={errors.designation}
          required
        />

        <FormField
          label="Membership Expiry Date"
          name="membershipExpiry"
          type="date"
          register={register}
          validation={{
            required: 'Membership expiry date is required',
            validate: value => {
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || 'Membership appears to be expired';
            }
          }}
          error={errors.membershipExpiry}
          required
        />
      </div>

      {/* Member Benefits Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-800/30 rounded-full flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Member Benefits
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
              <li>• Discounted event registration fees</li>
              <li>• Access to exclusive member-only events</li>
              <li>• Priority registration for popular sessions</li>
              <li>• Digital certificates and CPE credits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberFields;