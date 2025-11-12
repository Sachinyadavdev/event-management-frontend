import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from './FormField';
import ProfileImageUpload from './ProfileImageUpload';
import UserTypeSelector from './UserTypeSelector';
import MemberFields from './MemberFields';
import NonMemberFields from './NonMemberFields';
import '../../styles/registration.css';
import '../../styles/mobile.css';

const RegistrationForm = ({ onProgress }) => {
  const [userType, setUserType] = useState('non-member');
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [completedFields, setCompletedFields] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
    reset,
    trigger
  } = useForm({
    defaultValues: {
      userType: 'non-member',
      interestedInMembership: false,
      agreeToTerms: false
    },
    mode: 'onChange'
  });

  const password = watch('password');
  const watchedFields = watch();

  // Calculate progress based on completed fields
  useEffect(() => {
    const requiredFields = ['fullName', 'email', 'password', 'confirmPassword', 'phone'];
    const additionalFields = userType === 'member' ? ['memberId', 'memberSince'] : ['company', 'jobTitle'];
    const allFields = [...requiredFields, ...additionalFields, 'agreeToTerms'];
    
    const completed = allFields.filter(field => {
      const value = watchedFields[field];
      return value && value !== '' && !errors[field];
    }).length;
    
    setCompletedFields(completed);
    const progressPercentage = Math.round((completed / allFields.length) * 100);
    onProgress?.(progressPercentage);
  }, [watchedFields, errors, userType, onProgress]);

  // Auto-advance form step based on completion
  useEffect(() => {
    if (watchedFields.fullName && watchedFields.email && !errors.fullName && !errors.email) {
      setFormStep(2);
    }
    if (watchedFields.password && watchedFields.confirmPassword && !errors.password && !errors.confirmPassword) {
      setFormStep(3);
    }
  }, [watchedFields, errors]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const formData = {
      ...data,
      profileImage: profileImage,
      timestamp: new Date().toISOString()
    };
    
    console.log('📋 Registration Form Data:', formData);
    console.log('🖼️ Profile Image:', profileImage);
    
    // Here you would typically send the data to your API
    alert('Registration successful! Check console for form data.');
    
    // Reset form after successful submission
    reset();
    setProfileImage(null);
    setUserType('non-member');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
        <div className="px-8 py-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-8">
            <ProfileImageUpload 
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                register={register}
                validation={{ required: 'Full name is required' }}
                error={errors.fullName}
                required
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                register={register}
                validation={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                error={errors.email}
                required
              />

              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                register={register}
                validation={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number'
                  }
                }}
                error={errors.phoneNumber}
                required
              />

              <div className="md:col-span-1">
                <UserTypeSelector
                  userType={userType}
                  setUserType={setUserType}
                  register={register}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                register={register}
                validation={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: 'Password must include uppercase, lowercase, number, and special character'
                  }
                }}
                error={errors.password}
                required
              />

              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                register={register}
                validation={{
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                }}
                error={errors.confirmPassword}
                required
              />
            </div>
          </div>

          {/* Conditional User Type Fields */}
          <div className="mt-8 space-y-6">
            {userType === 'member' ? (
              <MemberFields register={register} errors={errors} />
            ) : (
              <NonMemberFields register={register} errors={errors} />
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/50 dark:to-blue-900/30 border-t border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
          {/* Form completion indicator */}
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${completedFields >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Form {Math.round((completedFields / 7) * 100)}% complete</span>
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${completedFields >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !watchedFields.agreeToTerms}
            className={`submit-button w-full py-5 px-8 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden ${
              isSubmitting || !watchedFields.agreeToTerms
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Creating Your Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-lg tracking-wide">Join ISACA Silicon Valley</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1L3 8l4 4 10-10-7-1z" clipRule="evenodd"/>
              </svg>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;