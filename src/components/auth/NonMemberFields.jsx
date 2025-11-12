import React from 'react';
import FormField from './FormField';

const NonMemberFields = ({ register, errors }) => {
  return (
    <div className="non-member-fields">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        Guest Information
      </h3>
      
      <div className="space-y-6">
        {/* Referral Code */}
        <FormField
          label="Referral Code (Optional)"
          name="referralCode"
          type="text"
          placeholder="Enter referral code if you have one"
          register={register}
          validation={{
            pattern: {
              value: /^[A-Za-z0-9]{4,12}$/,
              message: 'Invalid referral code format'
            }
          }}
          error={errors.referralCode}
        />

        {/* Interest in Membership */}
        <div className="interest-checkbox">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="interestedInMembership"
              {...register('interestedInMembership')}
              className="mt-1 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="interestedInMembership" className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">I'm interested in ISACA membership</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get information about membership benefits and exclusive opportunities
              </p>
            </label>
          </div>
        </div>

        {/* Non-Member Info */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 dark:bg-indigo-800/30 rounded-full flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                Why Join ISACA?
              </h4>
              <ul className="text-xs text-indigo-700 dark:text-indigo-200 space-y-1">
                <li>• Access to industry-leading cybersecurity resources</li>
                <li>• Professional networking opportunities</li>
                <li>• Continuing education and certification programs</li>
                <li>• Career development and job opportunities</li>
                <li>• Discounts on events, training, and certifications</li>
              </ul>
              <div className="mt-3">
                <a 
                  href="/membership" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Learn more about membership
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Benefits */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-800/30 rounded-full flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Have a Referral Code?
              </h4>
              <p className="text-xs text-green-700 dark:text-green-200">
                Use a referral code from an existing member to get special benefits and discounts on your first event registration!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonMemberFields;