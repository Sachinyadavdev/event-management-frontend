/**
 * RegistrationPanel.jsx - Reusable Event Registration Component
 * 
 * Features:
 * - Configurable registration fields with validation
 * - Customizable pricing display and payment integration hooks
 * - Form validation with extensible rules
 * - Modal-based registration flow
 * - Integration with QR code generation
 * - Responsive design with accessibility features
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QRModal from './QRModal.jsx';

const RegistrationPanel = ({ 
  event,
  userRegistered = false,
  onRegister,
  showToast,
  config = {},
  customStyles = {},
  validationRules = {},
  apiEndpoint,
  authToken
}) => {
  const [showModal, setShowModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    ...config.defaultValues
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Default configuration
  const defaultConfig = {
    fields: ['firstName', 'lastName', 'email', 'company', 'phone'],
    requiredFields: ['firstName', 'lastName', 'email', 'company'],
    showPrice: true,
    enablePayment: true,
    developmentMode: !apiEndpoint,
    ...config
  };

  // Default validation rules
  const defaultValidationRules = {
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { required: true, pattern: /\S+@\S+\.\S+/, message: 'Email is invalid' },
    company: { required: true, minLength: 2 },
    phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Phone number is invalid' },
    ...validationRules
  };

  const validateForm = () => {
    const newErrors = {};
    
    defaultConfig.fields.forEach(field => {
      const value = registrationData[field]?.trim() || '';
      const rules = defaultValidationRules[field];
      
      if (!rules) return;
      
      // Required validation
      if (rules.required && !value) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        return;
      }
      
      // Pattern validation
      if (value && rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${field} format is invalid`;
        return;
      }
      
      // Min length validation
      if (value && rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
        return;
      }
      
      // Custom validation function
      if (value && rules.validate && !rules.validate(value)) {
        newErrors[field] = rules.message || `${field} is invalid`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (defaultConfig.developmentMode) {
        // Development mode - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRegistrationSuccess(true);
        onRegister?.();
        showToast?.('Registration successful! Check your email for confirmation. You can now access virtual meeting links.', 'success');
      } else {
        // Production mode - actual API call
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
          },
          body: JSON.stringify(registrationData)
        });
        
        if (response.ok) {
          const result = await response.json();
          setRegistrationSuccess(true);
          onRegister?.(result);
          showToast?.('Registration successful! Check your email for confirmation.', 'success');
        } else {
          throw new Error('Registration failed');
        }
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
      showToast?.('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      company: 'Company',
      phone: 'Phone Number',
      ...config.fieldLabels
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      firstName: 'Enter your first name',
      lastName: 'Enter your last name', 
      email: 'Enter your email address',
      company: 'Enter your company name',
      phone: 'Enter your phone number',
      ...config.fieldPlaceholders
    };
    return placeholders[field] || `Enter ${getFieldLabel(field).toLowerCase()}`;
  };

  const renderFormField = (field) => {
    const isRequired = defaultConfig.requiredFields.includes(field);
    
    return (
      <div key={field} className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {getFieldLabel(field)} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
          value={registrationData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={getFieldPlaceholder(field)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            errors[field] 
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          style={customStyles.input}
        />
        {errors[field] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field]}</p>
        )}
      </div>
    );
  };

  // Generate QR data for successful registration
  const qrData = registrationSuccess ? {
    eventId: event.id,
    eventTitle: event.title,
    eventDate: new Date(event.startsAt).toLocaleDateString(),
    attendeeEmail: registrationData.email,
    attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
    registrationId: `reg_${Date.now()}`, // TODO: Use real registration ID from API
    timestamp: new Date().toISOString()
  } : null;

  // Show QR Modal if registration is successful
  if (registrationSuccess) {
    return (
      <QRModal
        isOpen={true}
        qrData={qrData}
        onClose={() => {
          setRegistrationSuccess(false);
          setShowModal(false);
        }}
        downloadConfig={{
          filename: `ticket-${event.id}`,
          contentGenerator: (data) => `
            ISACA Silicon Valley Event Ticket
            ================================
            Event: ${data.eventTitle}
            Date: ${data.eventDate}
            Attendee: ${data.attendeeName}
            Email: ${data.attendeeEmail}
            Registration ID: ${data.registrationId}
          `
        }}
        customStyles={customStyles.qrModal}
      />
    );
  }

  // Registration form modal
  const registrationModal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Register for Event</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {defaultConfig.fields.map(field => renderFormField(field))}
            
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              style={customStyles.submitButton}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
        style={customStyles.container}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Event Registration
            </h3>
          </div>
          
          {/* Price Info */}
          {defaultConfig.showPrice && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {event.isPaid ? `$${event.price}` : 'Free'}
                </div>
                {event.isPaid && (
                  <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Per person
                  </div>
                )}
              </div>
              {!event.isPaid && (
                <div className="mt-1 flex items-center gap-1 text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">No cost to attend</span>
                </div>
              )}
            </div>
          )}
          
          {/* Seats availability */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              <span>{event.seatsLeft} seats left</span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {event.capacity - event.seatsLeft}/{event.capacity} registered
            </div>
          </div>
          
          {/* Registration Button */}
          <button
            onClick={() => setShowModal(true)}
            disabled={userRegistered || event.seatsLeft === 0}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
              userRegistered
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-not-allowed'
                : event.seatsLeft === 0
                ? 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-105'
            }`}
            style={customStyles.registerButton}
          >
            {userRegistered ? (
              <>
                <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ✅ Registered Successfully
              </>
            ) : event.seatsLeft === 0 ? (
              'Event Full'
            ) : (
              'Register Now'
            )}
          </button>
          
          {event.isPaid && defaultConfig.enablePayment && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
              Payment will be processed securely after registration
            </p>
          )}
        </div>
      </div>
      
      {/* Registration Modal */}
      {showModal && registrationModal}
    </>
  );
};

RegistrationPanel.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number,
    isPaid: PropTypes.bool.isRequired,
    seatsLeft: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
    startsAt: PropTypes.string.isRequired
  }).isRequired,
  userRegistered: PropTypes.bool,
  onRegister: PropTypes.func,
  showToast: PropTypes.func,
  config: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.string),
    requiredFields: PropTypes.arrayOf(PropTypes.string),
    defaultValues: PropTypes.object,
    showPrice: PropTypes.bool,
    enablePayment: PropTypes.bool,
    developmentMode: PropTypes.bool,
    fieldLabels: PropTypes.object,
    fieldPlaceholders: PropTypes.object
  }),
  customStyles: PropTypes.shape({
    container: PropTypes.object,
    input: PropTypes.object,
    submitButton: PropTypes.object,
    registerButton: PropTypes.object,
    qrModal: PropTypes.object
  }),
  validationRules: PropTypes.object,
  apiEndpoint: PropTypes.string,
  authToken: PropTypes.string
};

export default RegistrationPanel;