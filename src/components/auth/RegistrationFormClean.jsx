import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { authAPI } from '../../services/apiEndpoints';

const RegistrationFormClean = ({ onProgress }) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('non-member');
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      userType: 'non-member',
      interestedInMembership: false,
      agreeToTerms: false
    }
  });

  const password = watch('password');
  const professionalStatus = watch('professionalStatus');
  const watchedFields = watch();

  // Handle password strength changes
  const handlePasswordStrengthChange = (strength, criteria) => {
    setPasswordStrength(strength);
    if (onProgress) {
      const overallProgress = Math.round((strength / 5) * 20); // Password contributes 20% to overall progress
      onProgress(overallProgress);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setRegistrationError('');
    
    try {
      // Prepare registration data according to backend schema
      const registrationData = {
        email: data.email,
        password: data.password,
        full_name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        company: data.company || null,
        job_title: data.jobTitle || null,
        role_name: userType === 'member' ? 'Member' : 
                   userType === 'student' ? 'Student' : 'Non-member',
        linkedin_url: data.linkedinProfile || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        bio: data.bio || null,
        certifications: data.certifications ? data.certifications.split(',').map(c => c.trim()) : [],
        interests: data.interests ? data.interests.split(',').map(i => i.trim()) : [],
        profile_image: profileImage || null
      };

      const response = await authAPI.register(registrationData);
      
      console.log('✅ Registration successful:', response);
      setRegistrationSuccess(true);
      
      // Show success message and redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please wait for admin approval before logging in.',
            email: data.email
          } 
        });
      }, 3000);
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      setRegistrationError(
        err.message || 
        'Registration failed. Please check your information and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // File validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or GIF)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {registrationSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Registration Successful!</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your account has been created and is pending admin approval. You'll be redirected to the login page shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {registrationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Registration Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{registrationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Profile Image Upload */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="relative inline-block group">
            {/* Main Profile Image Container */}
            <div className="relative w-32 h-32 mx-auto">
              {/* Background Circle with Gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full">
                      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-110 transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {/* Upload Overlay for Drag & Drop Effect */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-blue-400 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  Change Photo
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Upload Instructions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload your profile picture
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or GIF • Max size 5MB • Recommended 400x400px
          </p>
          
          {/* Upload Stats/Status */}
          {profileImage && (
            <div className="inline-flex items-center space-x-2 mt-3 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Photo uploaded successfully</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Basic Information */}
      <div className="space-y-5">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <input
              {...register('fullName', { required: 'Full name is required' })}
              type="text"
              className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Enter your full name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Enter your email"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <input
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$|^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
                  message: 'Please enter a valid phone number (e.g., +1234567890, (123) 456-7890, or 123-456-7890)'
                },
                minLength: {
                  value: 10,
                  message: 'Phone number must be at least 10 digits'
                },
                maxLength: {
                  value: 17,
                  message: 'Phone number cannot exceed 17 characters'
                },
                validate: {
                  validFormat: (value) => {
                    // Remove all non-digit characters for validation
                    const digitsOnly = value.replace(/\D/g, '');
                    
                    // Check if it has enough digits (10-15 is typical range)
                    if (digitsOnly.length < 10) {
                      return 'Phone number must contain at least 10 digits';
                    }
                    if (digitsOnly.length > 15) {
                      return 'Phone number cannot contain more than 15 digits';
                    }
                    
                    // US/Canada format validation
                    const usFormat = /^(\+?1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
                    if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
                      if (!usFormat.test(digitsOnly)) {
                        return 'Invalid US/Canada phone number format';
                      }
                    } else if (digitsOnly.length === 10) {
                      if (!usFormat.test('1' + digitsOnly)) {
                        return 'Invalid US phone number format';
                      }
                    }
                    
                    return true;
                  }
                }
              })}
              type="tel"
              className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Enter your phone number (e.g., +1 234-567-8900)"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone.message}
            </p>
          )}
          
          {/* Phone Format Helper */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>Accepted formats: +1 234-567-8900, (123) 456-7890, 123-456-7890, or 1234567890</p>
          </div>
        </div>

        {/* Professional Status Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Professional Status *
          </label>
          <div className="relative">
            <select
              {...register('professionalStatus', { required: 'Professional status is required' })}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
            >
              <option value="">Select your professional status</option>
              <option value="working-professional">Working Professional</option>
              <option value="student">Student</option>
              <option value="recent-graduate">Recent Graduate</option>
              <option value="unemployed">Currently Unemployed</option>
              <option value="retired">Retired</option>
              <option value="consultant">Consultant/Freelancer</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.professionalStatus && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.professionalStatus.message}
            </p>
          )}
        </div>

        {/* Student-specific fields */}
        {professionalStatus === 'student' && (
          <div className="space-y-5 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h4 className="font-semibold text-green-900 dark:text-green-300">Student Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  University/College *
                </label>
                <div className="relative">
                  <input
                    {...register('university', { 
                      required: professionalStatus === 'student' ? 'University/College is required for students' : false 
                    })}
                    type="text"
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter your university/college name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                    </svg>
                  </div>
                </div>
                {errors.university && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.university.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Degree Program *
                </label>
                <div className="relative">
                  <select
                    {...register('degreeProgram', { 
                      required: professionalStatus === 'student' ? 'Degree program is required for students' : false 
                    })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
                  >
                    <option value="">Select degree program</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD/Doctorate</option>
                    <option value="certification">Professional Certification</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.degreeProgram && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.degreeProgram.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Field of Study *
                </label>
                <div className="relative">
                  <select
                    {...register('fieldOfStudy', { 
                      required: professionalStatus === 'student' ? 'Field of study is required for students' : false 
                    })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
                  >
                    <option value="">Select field of study</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="information-systems">Information Systems</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="information-technology">Information Technology</option>
                    <option value="business-administration">Business Administration</option>
                    <option value="accounting">Accounting</option>
                    <option value="finance">Finance</option>
                    <option value="engineering">Engineering</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.fieldOfStudy && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.fieldOfStudy.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Expected Graduation Year *
                </label>
                <div className="relative">
                  <select
                    {...register('graduationYear', { 
                      required: professionalStatus === 'student' ? 'Expected graduation year is required for students' : false 
                    })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
                  >
                    <option value="">Select graduation year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.graduationYear && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.graduationYear.message}
                  </p>
                )}
              </div>
            </div>

            {/* Student Benefits Info */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h5 className="font-medium text-green-800 dark:text-green-300">Student Benefits</h5>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Students enjoy discounted membership rates, free access to select events, career development resources, and networking opportunities with industry professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Graduate-specific fields */}
        {professionalStatus === 'recent-graduate' && (
          <div className="space-y-5 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">Recent Graduate Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Graduation Date *
                </label>
                <div className="relative">
                  <input
                    {...register('graduationDate', { 
                      required: professionalStatus === 'recent-graduate' ? 'Graduation date is required for recent graduates' : false 
                    })}
                    type="month"
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.graduationDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.graduationDate.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Degree Obtained *
                </label>
                <div className="relative">
                  <select
                    {...register('degreeObtained', { 
                      required: professionalStatus === 'recent-graduate' ? 'Degree obtained is required for recent graduates' : false 
                    })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
                  >
                    <option value="">Select degree obtained</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD/Doctorate</option>
                    <option value="certification">Professional Certification</option>
                    <option value="diploma">Diploma</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.degreeObtained && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.degreeObtained.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Search Status *
                </label>
                <div className="relative">
                  <select
                    {...register('jobSearchStatus', { 
                      required: professionalStatus === 'recent-graduate' ? 'Job search status is required for recent graduates' : false 
                    })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
                  >
                    <option value="">Select job search status</option>
                    <option value="actively-searching">Actively Searching</option>
                    <option value="employed">Recently Employed</option>
                    <option value="considering-options">Considering Options</option>
                    <option value="pursuing-further-education">Pursuing Further Education</option>
                    <option value="taking-break">Taking a Break</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.jobSearchStatus && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.jobSearchStatus.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Previous Institution
                </label>
                <div className="relative">
                  <input
                    {...register('previousInstitution')}
                    type="text"
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="University/College name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Graduate Benefits Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h5 className="font-medium text-blue-800 dark:text-blue-300">Recent Graduate Benefits</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Recent graduates receive special pricing on membership, career coaching sessions, resume review services, and priority access to entry-level job postings from our corporate partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Years of Experience Field - Only for non-students */}
        {professionalStatus !== 'student' && (
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Years of Experience *
            </label>
            <div className="relative">
              <select
                {...register('yearsOfExperience', { 
                  required: professionalStatus !== 'student' ? 'Years of experience is required' : false 
                })}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
            >
              <option value="">Select your experience level</option>
              <option value="0-1">0-1 years (Entry Level)</option>
              <option value="2-5">2-5 years (Junior Level)</option>
              <option value="6-10">6-10 years (Mid Level)</option>
              <option value="11-15">11-15 years (Senior Level)</option>
              <option value="16-20">16-20 years (Expert Level)</option>
              <option value="20+">20+ years (Executive Level)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.yearsOfExperience && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>
        )}

        {/* Industry/Sector Field - Only for non-students */}
        {professionalStatus !== 'student' && (
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Industry/Sector *
            </label>
            <div className="relative">
              <select
                {...register('industry', { 
                  required: professionalStatus !== 'student' ? 'Industry/sector is required' : false 
                })}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 appearance-none"
            >
              <option value="">Select your industry</option>
              <option value="technology">Technology</option>
              <option value="financial-services">Financial Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="government">Government</option>
              <option value="education">Education</option>
              <option value="consulting">Consulting</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="telecommunications">Telecommunications</option>
              <option value="energy">Energy & Utilities</option>
              <option value="transportation">Transportation</option>
              <option value="non-profit">Non-Profit</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.industry && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.industry.message}
            </p>
          )}
        </div>
        )}

        {/* Password Field with Strength Meter */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                maxLength: {
                  value: 128,
                  message: 'Password cannot exceed 128 characters'
                },
                validate: {
                  hasUppercase: (value) => {
                    return /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter';
                  },
                  hasLowercase: (value) => {
                    return /[a-z]/.test(value) || 'Password must contain at least one lowercase letter';
                  },
                  hasNumber: (value) => {
                    return /\d/.test(value) || 'Password must contain at least one number';
                  },
                  hasSpecialChar: (value) => {
                    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) || 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)';
                  },
                  noCommonPatterns: (value) => {
                    const commonPatterns = [
                      /^password/i,
                      /^123456/,
                      /^qwerty/i,
                      /^abc123/i,
                      /^admin/i,
                      /^letmein/i,
                      /^welcome/i,
                      /(.)\1{3,}/, // repeated characters (aaaa, 1111, etc.)
                    ];
                    
                    for (const pattern of commonPatterns) {
                      if (pattern.test(value)) {
                        return 'Password contains common patterns. Please choose a more secure password.';
                      }
                    }
                    return true;
                  },
                  noPersonalInfo: (value) => {
                    const email = getValues('email')?.toLowerCase() || '';
                    const fullName = getValues('fullName')?.toLowerCase() || '';
                    const phone = getValues('phone')?.replace(/\D/g, '') || '';
                    
                    const valueLower = value.toLowerCase();
                    
                    // Check if password contains email username
                    if (email && valueLower.includes(email.split('@')[0])) {
                      return 'Password should not contain your email address';
                    }
                    
                    // Check if password contains parts of full name
                    if (fullName) {
                      const nameParts = fullName.split(' ').filter(part => part.length > 2);
                      for (const part of nameParts) {
                        if (valueLower.includes(part.toLowerCase())) {
                          return 'Password should not contain your name';
                        }
                      }
                    }
                    
                    // Check if password contains phone number
                    if (phone.length >= 4 && value.includes(phone.slice(-4))) {
                      return 'Password should not contain your phone number';
                    }
                    
                    return true;
                  }
                }
              })}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Create a strong password"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-all duration-200 hover:scale-110 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 animate-fadeIn group-hover:animate-iconPop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 animate-fadeIn group-hover:animate-iconPop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {showPassword ? "Hide password" : "Show password"}
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800 dark:border-b-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Password Strength Meter */}
          <PasswordStrengthMeter 
            password={password || ''} 
            onStrengthChange={handlePasswordStrengthChange}
          />
          
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        {/* Confirm Password Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: {
                  matchesPassword: (value) => {
                    const passwordValue = getValues('password');
                    if (!passwordValue) {
                      return 'Please enter a password first';
                    }
                    return value === passwordValue || 'Passwords do not match';
                  },
                  notEmpty: (value) => {
                    return value.trim() !== '' || 'Confirm password cannot be empty';
                  },
                  sameLength: (value) => {
                    const passwordValue = getValues('password');
                    if (passwordValue && value.length !== passwordValue.length && value === passwordValue) {
                      return true; // This should never happen, but just in case
                    }
                    return true;
                  }
                },
                deps: ['password'] // Re-validate when password changes
              })}
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Confirm your password"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-all duration-200 hover:scale-110 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5 animate-fadeIn group-hover:animate-iconPop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 animate-fadeIn group-hover:animate-iconPop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                  <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800 dark:border-b-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.confirmPassword.message}
            </p>
          )}
          
          {/* Password Security Guidelines */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Password Requirements</h5>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character (!@#$%^&*)</li>
                  <li>• Avoid common patterns and personal information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Membership Type Selection based on Professional Status */}
      {professionalStatus && professionalStatus !== 'student' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Membership Type *
          </label>
          
          {/* Working Professional Membership Options */}
          {professionalStatus === 'working-professional' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'professional-member' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="professional-member"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">ISACA Professional Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Full access to all professional benefits</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'guest' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="guest"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Guest/Non-Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Limited access to public events</div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Recent Graduate Membership Options */}
          {professionalStatus === 'recent-graduate' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'graduate-member' 
                  ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-400 dark:text-green-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="graduate-member"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Graduate Member Discount</div>
                    <div className="text-gray-500 dark:text-gray-400">Special pricing for recent graduates</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'guest' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="guest"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Guest/Non-Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Limited access to public events</div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Retired Membership Options */}
          {professionalStatus === 'retired' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'retired-member' 
                  ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:border-purple-400 dark:text-purple-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="retired-member"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Retired Member Discount</div>
                    <div className="text-gray-500 dark:text-gray-400">Special pricing for retired professionals</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'guest' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="guest"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Guest/Non-Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Limited access to public events</div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Unemployed Membership Options */}
          {professionalStatus === 'unemployed' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'unemployed-member' 
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-400 dark:text-yellow-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="unemployed-member"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Unemployed Member Discount</div>
                    <div className="text-gray-500 dark:text-gray-400">Special pricing for job seekers</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'guest' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="guest"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Guest/Non-Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Limited access to public events</div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Consultant/Freelancer & Entrepreneur Membership Options */}
          {(professionalStatus === 'consultant' || professionalStatus === 'entrepreneur') && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'professional-member' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="professional-member"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">ISACA Professional Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Full access + networking benefits</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                userType === 'guest' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300' 
                  : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
                <input
                  {...register('userType', { required: 'Please select membership type' })}
                  type="radio"
                  value="guest"
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="font-medium">Guest/Non-Member</div>
                    <div className="text-gray-500 dark:text-gray-400">Limited access to public events</div>
                  </div>
                </div>
              </label>
            </div>
          )}

          {errors.userType && (
            <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.userType.message}
            </p>
          )}
        </div>
      )}

      {/* Student Status Info - Show when student is selected */}
      {professionalStatus === 'student' && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-300">Student Membership - Automatic</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                As a student, you'll automatically receive student membership benefits including discounted rates, free access to educational events, and career development resources.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Fields */}
      {professionalStatus === 'student' ? (
        // Students don't need membership type selection - they get automatic student benefits
        null
      ) : (userType === 'professional-member' || userType === 'graduate-member' || userType === 'retired-member' || userType === 'unemployed-member') ? (
        <div className="space-y-5 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">
              {userType === 'professional-member' && 'Professional Member Information'}
              {userType === 'graduate-member' && 'Graduate Member Information'}
              {userType === 'retired-member' && 'Retired Member Information'}
              {userType === 'unemployed-member' && 'Unemployed Member Information'}
            </h4>
          </div>
          
          {/* ISACA Member ID for all member types */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {userType === 'professional-member' && 'ISACA Member ID *'}
              {userType === 'graduate-member' && 'ISACA Member ID (if existing) *'}
              {userType === 'retired-member' && 'ISACA Member ID *'}
              {userType === 'unemployed-member' && 'ISACA Member ID (if existing) *'}
            </label>
            <div className="relative">
              <input
                {...register('memberId', { 
                  required: (userType === 'professional-member' || userType === 'retired-member') 
                    ? 'Member ID is required' 
                    : 'Member ID is required for membership application'
                })}
                type="text"
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                placeholder={
                  (userType === 'professional-member' || userType === 'retired-member') 
                    ? "Enter your existing ISACA member ID" 
                    : "Enter existing ID or 'NEW' for new membership"
                }
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
            </div>
            {errors.memberId && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.memberId.message}
              </p>
            )}
          </div>

          {/* Special Benefits Information based on member type */}
          <div className={`p-4 rounded-lg border ${
            userType === 'graduate-member' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
            userType === 'retired-member' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' :
            userType === 'unemployed-member' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-start space-x-3">
              <svg className={`w-5 h-5 mt-0.5 ${
                userType === 'graduate-member' ? 'text-green-600' :
                userType === 'retired-member' ? 'text-purple-600' :
                userType === 'unemployed-member' ? 'text-yellow-600' :
                'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className={`font-medium ${
                  userType === 'graduate-member' ? 'text-green-800 dark:text-green-300' :
                  userType === 'retired-member' ? 'text-purple-800 dark:text-purple-300' :
                  userType === 'unemployed-member' ? 'text-yellow-800 dark:text-yellow-300' :
                  'text-blue-800 dark:text-blue-300'
                }`}>
                  {userType === 'professional-member' && 'Professional Member Benefits'}
                  {userType === 'graduate-member' && 'Graduate Member Benefits'}
                  {userType === 'retired-member' && 'Retired Member Benefits'}
                  {userType === 'unemployed-member' && 'Unemployed Member Benefits'}
                </h5>
                <p className={`text-sm mt-1 ${
                  userType === 'graduate-member' ? 'text-green-700 dark:text-green-400' :
                  userType === 'retired-member' ? 'text-purple-700 dark:text-purple-400' :
                  userType === 'unemployed-member' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-blue-700 dark:text-blue-400'
                }`}>
                  {userType === 'professional-member' && 'Full access to all events, resources, networking opportunities, and professional development programs.'}
                  {userType === 'graduate-member' && 'Special discounted rates, career coaching, resume review services, and priority access to entry-level opportunities.'}
                  {userType === 'retired-member' && 'Discounted membership rates, access to all events, and opportunities to mentor current professionals.'}
                  {userType === 'unemployed-member' && 'Reduced pricing, job search resources, networking events, and career transition support services.'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <div className="relative">
              <input
                {...register('memberSince')}
                type="date"
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : userType === 'guest' ? (
        <div className="space-y-5 p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h4 className="font-semibold text-gray-900 dark:text-white">Guest Information</h4>
          </div>
          
          {/* Guest Benefits Information */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-300">Guest Access</h5>
                <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                  As a guest, you'll have access to public events and can upgrade to full membership at any time to unlock additional benefits and resources.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {professionalStatus === 'recent-graduate' && 'Current Company (if employed)'}
              {professionalStatus === 'unemployed' && 'Previous/Current Company (if applicable)'}
              {professionalStatus === 'retired' && 'Previous Company (if applicable)'}
              {!['recent-graduate', 'unemployed', 'retired'].includes(professionalStatus) && 'Company *'}
            </label>
            <div className="relative">
              <input
                {...register('company', { 
                  required: !['recent-graduate', 'unemployed', 'retired'].includes(professionalStatus) 
                    ? 'Company is required' 
                    : false 
                })}
                type="text"
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                placeholder={
                  professionalStatus === 'recent-graduate' ? "Enter current company (if employed)" :
                  professionalStatus === 'unemployed' ? "Enter previous or current company (optional)" :
                  professionalStatus === 'retired' ? "Enter previous company (optional)" :
                  "Enter your company name"
                }
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            {errors.company && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.company.message}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {professionalStatus === 'recent-graduate' && 'Current Job Title (if employed)'}
              {professionalStatus === 'unemployed' && 'Previous/Target Job Title'}
              {professionalStatus === 'retired' && 'Previous Job Title (if applicable)'}
              {!['recent-graduate', 'unemployed', 'retired'].includes(professionalStatus) && 'Job Title *'}
            </label>
            <div className="relative">
              <input
                {...register('jobTitle', { 
                  required: !['recent-graduate', 'unemployed', 'retired'].includes(professionalStatus) 
                    ? 'Job title is required' 
                    : false 
                })}
                type="text"
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                placeholder={
                  professionalStatus === 'recent-graduate' ? "Enter current job title (if employed)" :
                  professionalStatus === 'unemployed' ? "Enter previous or target job title" :
                  professionalStatus === 'retired' ? "Enter previous job title (optional)" :
                  "Enter your job title"
                }
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
              </div>
            </div>
            {errors.jobTitle && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.jobTitle.message}
              </p>
            )}
          </div>
          
          {/* Employment Status Information */}
          {['recent-graduate', 'unemployed', 'retired'].includes(professionalStatus) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h5 className="font-medium text-blue-800 dark:text-blue-300">Employment Information</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    {professionalStatus === 'recent-graduate' && "Company and job title are optional if you're currently seeking employment. You can update this information later when you find a position."}
                    {professionalStatus === 'unemployed' && "You can provide your previous employer information or target role. These fields are optional and can be updated when you find new employment."}
                    {professionalStatus === 'retired' && "Company and job title information from your previous career are optional. This helps us understand your professional background."}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <input
              {...register('interestedInMembership')}
              type="checkbox"
              id="interestedInMembership"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="interestedInMembership" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              I'm interested in becoming an ISACA member
            </label>
          </div>
        </div>
      ) : professionalStatus && !userType ? (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5C3.312 16.333 4.274 18 5.814 18z" />
            </svg>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              Please select a membership type to continue with your registration.
            </p>
          </div>
        </div>
      ) : null}

      {/* Terms and Conditions */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
          <input
            {...register('agreeToTerms', {
              required: 'You must agree to the terms and conditions'
            })}
            type="checkbox"
            id="agreeToTerms"
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
          />
          <div>
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              I agree to the{' '}
              <a 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !watchedFields.agreeToTerms || passwordStrength < 3}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl group relative overflow-hidden ${
            isSubmitting || !watchedFields.agreeToTerms || passwordStrength < 3
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed transform-none shadow-sm'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500/25'
          }`}
        >
          {/* Animated Background for Strong Password */}
          {passwordStrength >= 4 && !isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 animate-pulse"></div>
          )}
          
          {isSubmitting ? (
            <div className="flex items-center justify-center relative z-10">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center justify-center relative z-10">
              {passwordStrength >= 4 && (
                <svg className="w-5 h-5 mr-2 text-green-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>Create Account</span>
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}
        </button>
        
        {/* Password Strength Warning */}
        {passwordStrength < 3 && password && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center animate-fadeIn">
            <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please create a stronger password to continue
          </p>
        )}
      </div>
    </form>
  );
};

export default RegistrationFormClean;