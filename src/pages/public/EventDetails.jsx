/*
 * EventDetails.jsx - Individual Event Details Page
 * 
 * INTEGRATION NOTES FOR DEVELOPERS:
 * ================================
 * 1. Auth Tokens: Replace placeholder auth headers in fetch() calls with real JWT tokens
 * 2. Ticket Generation: Connect POST /api/events/:id/register to real payment gateway
 * 3. Map API Keys: Replace Google Maps embed URL with your API key
 * 4. QR Code Generation: Implement real QR signing service for ticket verification
 * 5. File Uploads: Connect certificate download to real file storage service
 * 6. Email Service: Connect registration success to email notification service
 * 
 * TODO: Add real error boundaries, analytics tracking, and performance monitoring
 */

// Helper function to get display price - defined at top level for global access
const getDisplayPrice = (event) => {
  if (!event || !event.hasOwnProperty('isPaid')) return 'Free';
  if (!event.isPaid) return 'Free';
  
  // Handle both old and new price structures
  if (typeof event.price === 'object' && event.price !== null) {
    const memberPrice = event.price.member || 0;
    const nonMemberPrice = event.price.nonMember || 0;
    
    if (memberPrice === nonMemberPrice) {
      return `$${memberPrice}`;
    } else {
      return `$${memberPrice} Members / $${nonMemberPrice} Non-Members`;
    }
  } else {
    // Legacy price structure (single number)
    return `$${event.price || 0}`;
  }
};

// Helper function for compact price display (for badges)
const getCompactDisplayPrice = (event) => {
  if (!event || !event.hasOwnProperty('isPaid')) return 'Free';
  if (!event.isPaid) return 'Free';
  
  // Handle both old and new price structures
  if (typeof event.price === 'object' && event.price !== null) {
    const memberPrice = event.price.member || 0;
    const nonMemberPrice = event.price.nonMember || 0;
    
    if (memberPrice === nonMemberPrice) {
      return `$${memberPrice}`;
    } else {
      return `$${memberPrice}/$${nonMemberPrice}`;
    }
  } else {
    // Legacy price structure (single number)
    return `$${event.price || 0}`;
  }
};

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import PublicLayout from '../../components/public/PublicLayout.jsx';
import Button from '../../components/shared/ui/Button.jsx';
import EventCard from '../../components/shared/ui/EventCard.jsx';
import EditEventModal from '../../components/shared/EditEventModal.jsx';
import { useToast } from '../../hooks/useToast.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { eventsAPI } from '../../services/apiEndpoints';

// Helper function to format event date
function formatEventDate(startDate, endDate) {
  if (!startDate) return 'Date TBD';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const dateOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  
  const timeOptions = { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  };
  
  const formattedDate = start.toLocaleDateString('en-US', dateOptions);
  const formattedStartTime = start.toLocaleTimeString('en-US', timeOptions);
  
  if (end) {
    const formattedEndTime = end.toLocaleTimeString('en-US', timeOptions);
    // Check if same day
    if (start.toDateString() === end.toDateString()) {
      return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
    } else {
      const formattedEndDate = end.toLocaleDateString('en-US', dateOptions);
      return `${formattedDate} ${formattedStartTime} - ${formattedEndDate} ${formattedEndTime}`;
    }
  }
  
  return `${formattedDate}, ${formattedStartTime}`;
}

// Inline CSS for custom styles
const customStyles = `
  .hero-gradient {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9));
  }
  
  .badge-shine {
    background: linear-gradient(135deg, #8B5CF6, #06B6D4);
    position: relative;
    overflow: hidden;
  }
  
  .badge-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shine 2s infinite;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
  
  .focus-ring:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  
  .timeline-line {
    background: linear-gradient(to bottom, #E5E7EB, #3B82F6, #E5E7EB);
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// EventHero Component
const EventHero = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="relative h-96 overflow-hidden rounded-xl mb-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'})`
        }}
      />
      
      {/* Dynamic Color Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: event.bannerOverlay?.color && event.bannerOverlay?.opacity 
            ? `${event.bannerOverlay.color}${Math.round(event.bannerOverlay.opacity * 255).toString(16).padStart(2, '0')}`
            : 'rgba(0, 0, 0, 0.3)' // Fallback overlay
        }}
      />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 text-white">
        {/* Badges Row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Mode Badge */}
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {event.mode === 'in_person' ? '?? In-Person' : '?? Virtual'}
          </span>
          
          {/* Price Badge */}
          <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-sm font-bold" title={typeof event.price === 'object' && event.price !== null && event.price.member !== event.price.nonMember ? `$${event.price.member} for Members / $${event.price.nonMember} for Non-Members` : undefined}>
            {getCompactDisplayPrice(event)}
          </span>
          
          {/* CP Score Badge */}
          {event.cpScore > 0 && (
            <span className="badge-shine px-3 py-1 rounded-full text-sm font-bold text-white">
              {event.cpScore} CP
            </span>
          )}
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
          {event.title}
        </h1>
        
        {/* Hosted By */}
        <p className="text-xl text-blue-100 mb-4">
          Hosted by <span className="font-semibold">{event.hostedBy}</span>
        </p>
        
        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.startsAt)}
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Panel Component
const RegistrationPanel = ({ event, onRegister, showToast, userRegistered }) => {
  const [showModal, setShowModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!registrationData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!registrationData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!registrationData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registrationData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
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
      // TODO: Replace with real API call when backend is ready
      // For now, simulate successful registration in development
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful response
      setRegistrationSuccess(true);
      onRegister?.();
      showToast?.('Registration successful! Check your email for confirmation. You can now access virtual meeting links.', 'success');
      
      // Close the modal after a short delay
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      
      // TODO: Uncomment when backend API is ready
      // const response = await fetch(`/api/events/${event.id}/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`,
      //   },
      //   body: JSON.stringify(registrationData)
      // });
      // 
      // if (response.ok) {
      //   setRegistrationSuccess(true);
      //   onRegister?.();
      //   showToast?.('Registration successful! Check your email for confirmation.', 'success');
      // } else {
      //   throw new Error('Registration failed');
      // }
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

  if (registrationSuccess) {
    return <QRModal event={event} registrationData={registrationData} onClose={() => {
      setRegistrationSuccess(false);
      setShowModal(false);
    }} />;
  }

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
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
          
          {/* Enhanced Price Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800">
            {event.isPaid && typeof event.price === 'object' && event.price !== null && event.price.member !== event.price.nonMember ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Registration Pricing
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${event.price.member}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      ISACA Members
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ${event.price.nonMember}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Non-Members
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Join ISACA to save ${event.price.nonMember - event.price.member} on this event!
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {getDisplayPrice(event)}
                </div>
                {event.isPaid && (
                  <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Per person
                  </div>
                )}
              </div>
            )}
            {!event.isPaid && (
              <div className="mt-1 flex items-center gap-1 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm font-medium">No registration fee</span>
              </div>
            )}
          </div>
          
          {/* Enhanced Seats Availability */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Seats Available</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.seatsLeft}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  of {event.capacity} total
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                    event.seatsLeft === 0 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : event.seatsLeft < event.capacity * 0.2 
                        ? 'bg-gradient-to-r from-orange-400 to-red-500'
                        : event.seatsLeft < event.capacity * 0.5
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-r from-green-400 to-indigo-500'
                  }`}
                  style={{ width: `${((event.capacity - event.seatsLeft) / event.capacity) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              {/* Availability Status */}
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className={`flex items-center gap-1 font-medium ${
                  event.seatsLeft === 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : event.seatsLeft < event.capacity * 0.2 
                      ? 'text-orange-600 dark:text-orange-400'
                      : event.seatsLeft < event.capacity * 0.5
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    event.seatsLeft === 0 
                      ? 'bg-red-500' 
                      : event.seatsLeft < event.capacity * 0.2 
                        ? 'bg-orange-500'
                        : event.seatsLeft < event.capacity * 0.5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                  } animate-pulse`}></div>
                  <span>
                    {event.seatsLeft === 0 
                      ? 'Fully Booked' 
                      : event.seatsLeft < event.capacity * 0.2 
                        ? 'Almost Full'
                        : event.seatsLeft < event.capacity * 0.5
                          ? 'Limited Seats'
                          : 'Good Availability'
                    }
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {Math.round(((event.capacity - event.seatsLeft) / event.capacity) * 100)}% filled
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Register Button */}
          <div className="space-y-3">
            <Button 
              className={`w-full font-semibold py-3 px-5 rounded-lg text-base transition-all duration-300 transform focus-ring relative overflow-hidden ${
                userRegistered
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-default shadow-md'
                  : event.seatsLeft === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5'
              }`}
              onClick={() => !userRegistered && setShowModal(true)}
              disabled={event.seatsLeft === 0 || userRegistered}
              aria-label={userRegistered ? 'Already registered' : `Register for ${event.title}`}
            >
              {userRegistered ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  ? Registered Successfully
                </div>
              ) : event.seatsLeft === 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                  </svg>
                  Event Full
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Register Now
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
              
              {/* Button shine effect */}
              {event.seatsLeft > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700"></div>
              )}
            </Button>
            
            {/* Security and urgency indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Secure registration</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>Instant confirmation</span>
              </div>
              {event.seatsLeft < event.capacity * 0.3 && event.seatsLeft > 0 && (
                <div className="flex items-center gap-1 text-orange-500 animate-pulse">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">Limited time</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Register for Event
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={registrationData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                      errors.firstName 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={registrationData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                      errors.lastName 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={registrationData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                    errors.company 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.company && (
                  <p className="text-sm text-red-500 mt-1">{errors.company}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus-ring dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {errors.submit && (
                <p className="text-sm text-red-500">{errors.submit}</p>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : `Register ${event.isPaid ? `(${getDisplayPrice(event)})` : ''}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// QR Modal Component  
const QRModal = ({ event, registrationData, onClose }) => {
  const [qrCodeImage, setQrCodeImage] = useState('');
  const qrData = {
    eventId: event.id,
    attendeeEmail: registrationData.email,
    attendeeName: `${registrationData.firstName} ${registrationData.lastName}`,
    registrationId: `reg_${Date.now()}`, // TODO: Use real registration ID
    timestamp: new Date().toISOString()
  };

  // Generate QR code when component mounts
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrString = JSON.stringify(qrData);
        const qrImageUrl = await QRCode.toDataURL(qrString, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeImage(qrImageUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, []);

  const downloadTicket = () => {
    // TODO: Generate real PDF ticket
    const ticketData = `
      ISACA Silicon Valley Event Ticket
      ================================
      Event: ${event.title}
      Date: ${new Date(event.startsAt).toLocaleDateString()}
      Attendee: ${qrData.attendeeName}
      Email: ${qrData.attendeeEmail}
      Registration ID: ${qrData.registrationId}
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${event.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md relative animate-scale-in shadow-2xl">
        {/* Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Registration Successful!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your ticket has been generated. Save this QR code for event check-in.
          </p>
          
          {/* QR Code */}
          <div className="w-52 h-52 bg-white border-4 border-gray-200 dark:border-gray-600 mx-auto mb-6 rounded-lg flex items-center justify-center p-3 shadow-lg">
            {qrCodeImage ? (
              <img 
                src={qrCodeImage} 
                alt="Registration QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-500 animate-pulse">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H9V11M15,11H17V13H15V11M19,5H21V9H19V5M1,5H9V13H1V5M15,1H23V9H15V1M17,3H21V7H17V3M1,15H9V23H1V15M3,17H7V21H3V17Z" />
                </svg>
                <p className="text-sm">Generating QR Code...</p>
              </div>
            )}
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">QR Code Generated</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">ID: {qrData.registrationId}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={downloadTicket}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Ticket
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600"
            >
              Close
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            A confirmation email has been sent to {registrationData.email}
          </p>
        </div>
      </div>
    </div>
  );
};

// Agenda Timeline Component
const AgendaTimeline = ({ agenda, speakers }) => {
  const [sortBy, setSortBy] = useState('time'); // 'time' or 'speaker'
  
  const sortedAgenda = [...agenda].sort((a, b) => {
    if (sortBy === 'time') {
      return a.start.localeCompare(b.start);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const getSpeakerNames = (speakerIds) => {
    return speakerIds.map(id => {
      const speaker = speakers.find(s => s.id === id);
      return speaker ? speaker.name : 'TBA';
    }).join(', ');
  };

  const getSessionTypeColor = (title) => {
    if (title.toLowerCase().includes('keynote')) return 'bg-purple-500';
    if (title.toLowerCase().includes('panel')) return 'bg-blue-500';
    if (title.toLowerCase().includes('workshop')) return 'bg-green-500';
    if (title.toLowerCase().includes('networking')) return 'bg-orange-500';
    return 'bg-indigo-500';
  };

  const getSessionTypeIcon = (title) => {
    if (title.toLowerCase().includes('keynote')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      );
    }
    if (title.toLowerCase().includes('panel')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17 20a2 2 0 01-2-2V8a2 2 0 012-2h1a2 2 0 012 2v10a2 2 0 01-2 2h-1zM9 20a2 2 0 01-2-2V4a2 2 0 012-2h1a2 2 0 012 2v14a2 2 0 01-2 2H9zM1 20a2 2 0 01-2-2V12a2 2 0 012-2h1a2 2 0 012 2v6a2 2 0 01-2 2H1z"/>
        </svg>
      );
    }
    if (title.toLowerCase().includes('workshop')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
      );
    }
    if (title.toLowerCase().includes('networking')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          Event Agenda
        </h3>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="time">Sort by Time</option>
          <option value="speaker">Sort by Title</option>
        </select>
      </div>
      
      <div className="relative">
        {/* Enhanced Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-400 rounded-full" />
        
        <div className="space-y-8">
          {sortedAgenda.map((session, index) => {
            const isLast = index === sortedAgenda.length - 1;
            return (
              <div key={index} className="relative flex items-start group">
                {/* Enhanced Time Badge */}
                <div className={`relative flex-shrink-0 w-16 h-16 ${getSessionTypeColor(session.title)} text-white rounded-xl flex flex-col items-center justify-center text-xs font-bold shadow-lg transform group-hover:scale-105 transition-all duration-200 z-20`}>
                  <div className="mb-1">{getSessionTypeIcon(session.title)}</div>
                  <div className="leading-none">{session.start}</div>
                </div>
                
                {/* Connection Line to Content */}
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-transparent mt-8 z-10" />
                
                {/* Enhanced Session Content */}
                <div className="flex-1 ml-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 group-hover:transform group-hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {session.start} - {session.end}
                        </span>
                      </div>
                    </div>
                    
                    {session.speakers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          Speaker(s): {getSpeakerNames(session.speakers)}
                        </span>
                      </div>
                    )}
                    
                    {/* Duration indicator */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Duration: {(() => {
                          const startTime = session.start.split(':');
                          const endTime = session.end.split(':');
                          const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
                          const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
                          const duration = endMinutes - startMinutes;
                          const hours = Math.floor(duration / 60);
                          const minutes = duration % 60;
                          return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                        })()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot connector */}
                {!isLast && (
                  <div className="absolute left-8 top-16 w-1 h-8 bg-gradient-to-b from-indigo-300 to-indigo-200 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Speakers List Component
const SpeakersList = ({ speakers }) => {
  if (!speakers || speakers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Speakers</h2>
            <p className="text-white/80 text-sm">Meet our expert panel</p>
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="p-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {speakers.map((speaker, index) => (
            <div 
              key={speaker.id} 
              className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
              style={{ 
                opacity: 0,
                animation: `slideInUp 0.6s ease-out ${index * 0.15}s forwards`
              }}
            >
              {/* Speaker Photo */}
              <div className="relative mb-4">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={speaker.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                    alt={speaker.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                    }}
                  />
                  <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300"></div>
                </div>
              </div>
              
              {/* Speaker Info */}
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {speaker.name}
                </h4>
                
                <div className="mb-3">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {speaker.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {speaker.company}
                  </p>
                </div>
                
                {/* Bio */}
                {speaker.bio && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                    {speaker.bio}
                  </p>
                )}
                
                {/* LinkedIn Button */}
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`View ${speaker.name}'s LinkedIn profile`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sponsors Grid Component
const SponsorsGrid = ({ sponsors }) => {
  // Safety check: return null if no sponsors or not an array
  if (!sponsors || !Array.isArray(sponsors) || sponsors.length === 0) {
    return null;
  }

  const getLevelStyles = (level) => {
    switch (level.toLowerCase()) {
      case 'platinum': 
        return {
          badge: 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white',
          card: 'border border-gray-300 hover:border-gray-400',
          icon: 'PLATINUM',
          bgGradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
        };
      case 'gold': 
        return {
          badge: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white',
          card: 'border border-yellow-200 hover:border-yellow-300',
          icon: 'GOLD',
          bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
        };
      case 'silver': 
        return {
          badge: 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white',
          card: 'border border-gray-200 hover:border-gray-300',
          icon: 'SILVER',
          bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-700/20 dark:to-slate-700/20'
        };
      case 'bronze': 
        return {
          badge: 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white',
          card: 'border border-amber-200 hover:border-amber-300',
          icon: 'BRONZE',
          bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
        };
      case 'custom': 
        return {
          badge: 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white',
          card: 'border border-purple-200 hover:border-purple-300',
          icon: 'CUSTOM',
          bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20'
        };
      default: 
        return {
          badge: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white',
          card: 'border border-blue-200 hover:border-blue-300',
          icon: 'SPONSOR',
          bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
        };
    }
  };

  // Group sponsors by level for better organization
  const groupedSponsors = (sponsors || []).reduce((acc, sponsor) => {
    const level = (sponsor.level || 'gold').toLowerCase();
    if (!acc[level]) acc[level] = [];
    acc[level].push(sponsor);
    return acc;
  }, {});

  // Define level order for display - include custom
  const levelOrder = ['platinum', 'gold', 'silver', 'bronze', 'custom'];
  const orderedLevels = levelOrder.filter(level => groupedSponsors[level]);
  
  // Also include any other levels not in the standard order
  const remainingLevels = Object.keys(groupedSponsors).filter(level => !levelOrder.includes(level));
  orderedLevels.push(...remainingLevels);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Event Sponsors</h2>
            <p className="text-white/70 text-xs">Thank you to our partners</p>
          </div>
        </div>
      </div>

      {/* Compact Sponsors by Level */}
      <div className="p-6 space-y-5">
        {orderedLevels.map((level) => {
          const styles = getLevelStyles(level);
          const levelSponsors = groupedSponsors[level];
          const isTopLevel = level === 'platinum' || level === 'gold';

          return (
            <div key={level} className="space-y-3">
              {/* Compact Level Header */}
              <div className="flex items-center gap-2">
                <span className={`${styles.badge} px-3 py-1 rounded-lg text-xs font-bold tracking-wide`}>
                  {level === 'custom' && levelSponsors[0]?.customLabel 
                    ? levelSponsors[0].customLabel.toUpperCase()
                    : styles.icon
                  }
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-600 dark:via-gray-700 dark:to-transparent"></div>
              </div>

              {/* Compact Sponsors Grid - Horizontal Layout */}
              <div className={`grid gap-3 ${
                isTopLevel 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {levelSponsors.map((sponsor, index) => (
                  <div 
                    key={sponsor.id || `${sponsor.name}-${index}`}
                    className={`group bg-gradient-to-br ${styles.bgGradient} ${styles.card} rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]`}
                    style={{ 
                      opacity: 0,
                      animation: `slideInUp 0.4s ease-out ${index * 0.05}s forwards`
                    }}
                  >
                    {/* Horizontal Layout */}
                    <div className="flex items-center gap-4">
                      {/* Logo Container */}
                      <div className={`bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm flex-shrink-0 ${
                        isTopLevel ? 'w-16 h-12' : 'w-12 h-10'
                      }`}>
                        <img
                          src={sponsor.logo || `https://placehold.co/120x60/6366F1/FFFFFF/png?text=${encodeURIComponent(sponsor.name)}`}
                          alt={`${sponsor.name} logo`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/120x60/6366F1/FFFFFF/png?text=${encodeURIComponent(sponsor.name)}`;
                          }}
                        />
                      </div>

                      {/* Sponsor Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 ${
                          isTopLevel ? 'text-sm' : 'text-sm'
                        }`}>
                          {sponsor.name}
                        </h4>

                        {/* Website Link - Compact */}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline transition-colors duration-200 mt-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit
                          </a>
                        )}

                        {/* Custom Label - Compact */}
                        {level === 'custom' && sponsor.customLabel && (
                          <div className="mt-1">
                            <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 px-2 py-0.5 rounded text-xs font-medium">
                              {sponsor.customLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
          <span className="font-medium text-xs">Thank you to all our sponsors!</span>
        </div>
      </div>
    </div>
  );
};

// Event Description Component
const EventDescription = ({ descriptionHtml, shortDescription }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        About This Event
      </h3>
      
      <div className="prose dark:prose-invert max-w-none">
        {descriptionHtml ? (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: descriptionHtml // TODO: Sanitize HTML in production
            }} 
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            {shortDescription}
          </p>
        )}
      </div>
    </div>
  );
};

// Venue Map Component
const VenueMap = ({ venue, onAddressCopy }) => {
  if (!venue) return null;

  const handleCopyAddress = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(venue.address);
        if (onAddressCopy) {
          onAddressCopy();
        }
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = venue.address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        if (document.execCommand('copy')) {
          if (onAddressCopy) {
            onAddressCopy();
          }
        } else {
          throw new Error('Copy command failed');
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy address:', err);
      // Show error feedback if available
      if (onAddressCopy) {
        // Call with error parameter if needed
        onAddressCopy();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Event Location
      </h3>
      
      <div className="space-y-4">
        {/* Venue Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{venue.name}</h4>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{venue.address}</p>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {venue.mapEmbedUrl ? (
            <iframe
              src={venue.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map to ${venue.name}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Map Loading...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
          
          <button
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Address
          </button>
        </div>
      </div>
    </div>
  );
};

// Notifications List Component
const NotificationsList = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Event Updates
      </h3>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="border-l-4 border-primary-600 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
              {notification.body}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Related Events Carousel Component
const RelatedEventsCarousel = ({ relatedEvents }) => {
  if (!relatedEvents || relatedEvents.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        You Might Also Like
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {relatedEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-80">
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <EventCard 
                  event={event}
                  userType="guest"
                  context="related"
                  showSpeakers={false}
                  showSponsors={false}
                  showTags={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Virtual Meeting Links Component (Only for registered users)
const VirtualMeetingLinks = ({ event, userRegistered }) => {
  // Only show for virtual/hybrid events and registered users
  if (!userRegistered || (event.mode !== 'virtual' && event.mode !== 'hybrid')) {
    return null;
  }

  // Check if any virtual links exist
  const hasVirtualLinks = event.virtualLinks && (
    event.virtualLinks.zoom || 
    event.virtualLinks.googleMeet || 
    event.virtualLinks.teams || 
    event.virtualLinks.other
  );

  if (!hasVirtualLinks) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Virtual Meeting Access</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Join the event online</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Registered
          </span>
        </div>
      </div>

      {/* Meeting Links */}
      <div className="space-y-4">
        {event.virtualLinks.zoom && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.5 8.5C6.5 7.67 7.17 7 8 7s1.5.67 1.5 1.5S8.83 10 8 10 6.5 9.33 6.5 8.5M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Zoom Meeting</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Primary meeting platform</p>
              </div>
            </div>
            <a
              href={event.virtualLinks.zoom}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Join Zoom
            </a>
          </div>
        )}

        {event.virtualLinks.googleMeet && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Google Meet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alternative platform</p>
              </div>
            </div>
            <a
              href={event.virtualLinks.googleMeet}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Join Meet
            </a>
          </div>
        )}

        {event.virtualLinks.teams && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Microsoft Teams</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Teams meeting</p>
              </div>
            </div>
            <a
              href={event.virtualLinks.teams}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Join Teams
            </a>
          </div>
        )}

        {event.virtualLinks.other && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Other Platform</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Additional meeting link</p>
              </div>
            </div>
            <a
              href={event.virtualLinks.other}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Join Meeting
            </a>
          </div>
        )}
      </div>

      {/* Meeting Password */}
      {event.virtualLinks.password && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Meeting Password</h4>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-600">
            <code className="text-lg font-mono font-bold text-gray-900 dark:text-white">{event.virtualLinks.password}</code>
          </div>
        </div>
      )}

      {/* Virtual Instructions */}
      {event.virtualLinks.instructions && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">Special Instructions</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{event.virtualLinks.instructions}</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Security Notice:</strong> These meeting links are exclusive to registered attendees. Please do not share them publicly.
          </p>
        </div>
      </div>
    </div>
  );
};

// Certificates Panel Component (shown after event completion)
const CertificatesPanel = ({ event, userRegistered }) => {
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  
  if (!userRegistered || new Date(event.endsAt) > new Date()) {
    return null;
  }

  const downloadCertificate = async () => {
    // TODO: Connect to real certificate generation service
    setCertificateGenerated(true);
    
    // Simulate certificate download
    const certificateData = `
      Certificate of Attendance
      ========================
      This certifies that [Attendee Name] has successfully attended
      ${event.title}
      
      Hosted by: ${event.hostedBy}
      Date: ${new Date(event.startsAt).toLocaleDateString()}
      CPE Hours: ${event.cpScore}
    `;
    
    const blob = new Blob([certificateData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${event.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Certificate Available
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Congratulations! You've successfully completed this event. Download your certificate of attendance.
      </p>
      
      <Button
        onClick={downloadCertificate}
        className="bg-green-600 hover:bg-green-700 text-white"
        disabled={certificateGenerated}
      >
        {certificateGenerated ? 'Certificate Downloaded' : 'Download Certificate'}
      </Button>
    </div>
  );
};

// Share Buttons Component
const ShareButtons = ({ event, showToast }) => {
  const currentUrl = window.location.href;
  const shareText = `Check out this event: ${event.title}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      showToast('Failed to copy link. Please try again.', 'error');
    }
  };

  const addToGoogleCalendar = () => {
    try {
      // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ format)
      const formatGoogleCalendarDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      };

      const startDate = formatGoogleCalendarDate(event.startsAt);
      const endDate = formatGoogleCalendarDate(event.endsAt);
      
      // Create event description with details
      const description = [
        event.description || 'Join us for this exciting event!',
        '',
        `Hosted by: ${event.hostedBy}`,
        `Mode: ${event.mode === 'in_person' ? 'In-Person' : event.mode === 'virtual' ? 'Virtual' : 'Hybrid'}`,
        '',
        `More details: ${currentUrl}`
      ].join('\\n');

      // Create location string
      const location = event.mode === 'virtual' 
        ? 'Virtual Event' 
        : event.venue 
          ? `${event.venue.name}, ${event.venue.address}` 
          : 'Location TBA';

      // Build Google Calendar URL
      const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
      googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
      googleCalendarUrl.searchParams.set('text', event.title);
      googleCalendarUrl.searchParams.set('dates', `${startDate}/${endDate}`);
      googleCalendarUrl.searchParams.set('details', description);
      googleCalendarUrl.searchParams.set('location', location);
      googleCalendarUrl.searchParams.set('ctz', Intl.DateTimeFormat().resolvedOptions().timeZone);

      // Open Google Calendar in new tab
      window.open(googleCalendarUrl.toString(), '_blank');
      showToast('Opening Google Calendar...', 'success');
    } catch (err) {
      console.error('Failed to add to Google Calendar:', err);
      showToast('Failed to add to calendar. Please try again.', 'error');
    }
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Event: ${event.title}`);
    const body = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Share & Save This Event
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm mx-auto">
            Don't miss out! Add to your calendar or share with others
          </p>
        </div>
        
        {/* Featured Calendar Button */}
        <div className="mb-6">
          <Button
            onClick={addToGoogleCalendar}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group"
            aria-label="Add event to Google Calendar"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold">Add to Google Calendar</div>
                <div className="text-sm text-white/80">Never miss this event</div>
              </div>
              <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Button>
        </div>
        
        {/* Share Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 bg-gray-50 dark:bg-gray-800 rounded-full py-1">Share with others</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Copy Link */}
            <Button
              onClick={copyUrl}
              className="group bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center"
              aria-label="Copy event URL"
            >
              <div className="p-2 bg-gray-200 dark:bg-gray-600 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/70 rounded-lg mr-3 transition-colors">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Copy Link</span>
            </Button>
            
            {/* Email */}
            <Button
              onClick={shareEmail}
              className="group bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-400 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center"
              aria-label="Share via email"
            >
              <div className="p-2 bg-gray-200 dark:bg-gray-600 group-hover:bg-red-100 dark:group-hover:bg-red-900/70 rounded-lg mr-3 transition-colors">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Email</span>
            </Button>
          </div>
          
          {/* Social Media Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Twitter */}
            <Button
              onClick={shareTwitter}
              className="group bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center shadow-md"
              aria-label="Share on Twitter"
            >
              <div className="p-2 bg-white/25 rounded-lg mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <span className="text-sm font-bold">Twitter</span>
            </Button>
            
            {/* LinkedIn */}
            <Button
              onClick={shareLinkedIn}
              className="group bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center shadow-md"
              aria-label="Share on LinkedIn"
            >
              <div className="p-2 bg-white/25 rounded-lg mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-sm font-bold">LinkedIn</span>
            </Button>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Secure sharing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Quick & easy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              <span className="font-medium">Spread the word</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main EventDetails Component
const EventDetails = () => {
  const { id } = useParams();
  const toastHook = useToast();
  const authHook = useAuth();
  
  // Safely extract values with fallbacks
  const success = toastHook?.success || ((msg) => console.log('Success:', msg));
  const showError = toastHook?.error || ((msg) => console.error('Error:', msg));
  const checkIsAdmin = authHook?.isAdmin || (() => false);
  const isAuthenticated = authHook?.isAuthenticated || false;
  
  // Helper function to match ShareButtons expected interface
  const showToast = (message, type) => {
    switch (type) {
      case 'success':
        success(message);
        break;
      case 'error':
        showError(message);
        break;
      default:
        success(message);
    }
  };

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Admin control - check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && (typeof checkIsAdmin === 'function' ? checkIsAdmin() : false);

  // Handle edit save functionality
  const handleEditSave = async (updatedData) => {
    try {
      console.log('Raw form data received:', updatedData);
      
      // 👥 DEBUG: Check speakers data from form
      console.log('👥 SPEAKERS DEBUG:');
      console.log('- speakers array:', updatedData.speakers);
      console.log('- speakers length:', updatedData.speakers?.length || 0);
      console.log('- first speaker:', updatedData.speakers?.[0]);
      console.log('- speakers JSON:', JSON.stringify(updatedData.speakers, null, 2));
      
      // 🏢 DEBUG: Check venue data from form
      console.log('🏢 VENUE DEBUG:');
      console.log('- venue object:', updatedData.venue);
      console.log('- venue.name:', updatedData.venue?.name);
      console.log('- venue.address:', updatedData.venue?.address);
      console.log('- mode:', updatedData.mode);
      
      // 🔧 SAFE DATE EXTRACTION FUNCTIONS - CRITICAL FOR TIMEZONE FIX
      const extractSafeDateForAPI = (dateTimeString) => {
        if (!dateTimeString) return null;
        console.log('🔧 extractSafeDateForAPI input:', dateTimeString);
        
        // Always extract just the date part - no timezone conversion
        const datePart = dateTimeString.split('T')[0];
        console.log('🔧 extractSafeDateForAPI output:', datePart);
        return datePart;
      };
      
      const extractSafeTimeForAPI = (dateTimeString) => {
        if (!dateTimeString) return null;
        console.log('🔧 extractSafeTimeForAPI input:', dateTimeString);
        
        const timePart = dateTimeString.split('T')[1];
        if (!timePart) return '00:00:00';
        
        // Remove milliseconds and ensure HH:MM:SS format
        const cleanTime = timePart.split('.')[0];
        const timeForAPI = cleanTime.length === 5 ? `${cleanTime}:00` : cleanTime;
        console.log('🔧 extractSafeTimeForAPI output:', timeForAPI);
        return timeForAPI;
      };

      // Transform frontend form data to backend API format
      const backendData = {
        event_title: updatedData.title || '',
        hosted_by: updatedData.hostedBy || '',
        event_status: updatedData.status || 'upcoming',
        event_category: updatedData.category || 'event',
        event_date: extractSafeDateForAPI(updatedData.startsAt),
        start_time: extractSafeTimeForAPI(updatedData.startsAt),
        end_time: extractSafeTimeForAPI(updatedData.endsAt),
        member_price: parseFloat(updatedData.price?.member || 0),
        non_member_price: parseFloat(updatedData.price?.nonMember || 0),
        max_attendees: parseInt(updatedData.maxCapacity || 0),
        cpe_hours: parseFloat(updatedData.cpScore || 0),
        event_tags: Array.isArray(updatedData.tags) ? updatedData.tags : [],
        event_description: updatedData.descriptionHtml || updatedData.shortDescription || '',
        
        // 🏢 VENUE DATA
        venue_name: updatedData.venue?.name || '',
        full_address: updatedData.venue?.address || '',
        google_maps_url: updatedData.venue?.mapEmbedUrl || '',
        mode: updatedData.mode || 'in_person',
        
        // 🎨 BANNER & MEDIA DATA
        banner_image: updatedData.bannerUrl || '',
        banner_overlay_color: updatedData.bannerOverlay?.color || '#000000',
        banner_overlay_opacity: updatedData.bannerOverlay?.opacity || 0.3,
        
        // 📋 AGENDA DATA
        agenda: updatedData.agenda || [],
        
        // 👥 SPEAKERS DATA
        speakers: updatedData.speakers || [],
        
        // 🏢 SPONSORS DATA
        sponsors: updatedData.sponsors || [],
        
        // 📢 EVENT UPDATES DATA
        notifications: updatedData.notifications || []
      };

      console.log('Transformed backend data (without banner):', { ...backendData, banner_image: backendData.banner_image ? `[${backendData.banner_image.length} chars]` : 'empty' });
      console.log('🏢 SPONSORS SAVE - Sponsors data being sent:', updatedData.sponsors);
      console.log('📢 NOTIFICATIONS SAVE - Event updates data being sent:', updatedData.notifications);

      // Banner processing debug
      console.log('🎨 Banner save data:', {
        hasBanner: !!updatedData.bannerUrl,
        bannerLength: updatedData.bannerUrl?.length || 0,
        color: updatedData.bannerOverlay?.color,
        opacity: updatedData.bannerOverlay?.opacity,
        opacityType: typeof updatedData.bannerOverlay?.opacity
      });

      // Date processing debug
      console.log('Event save - Date extracted:', backendData.event_date, 'Time:', backendData.start_time);

      // Call the API to update event
      const response = await eventsAPI.update(id, backendData);

      console.log('API response:', response);

      if (response.success) {
        // Re-fetch the updated event to get the complete data
        const updatedEvent = await eventsAPI.getById(id);
        console.log('Fetched updated event:', updatedEvent);
        
        // Transform backend response to frontend format
        const transformedEvent = {
          ...event, // Keep existing event data
          id: updatedEvent.data.id,
          title: updatedEvent.data.event_title,
          hostedBy: updatedEvent.data.hosted_by,
          status: updatedEvent.data.event_status,
          category: updatedEvent.data.event_category,
          date: updatedEvent.data.event_date?.split('T')[0] || '',
          startsAt: updatedEvent.data.event_date && updatedEvent.data.start_time 
            ? `${updatedEvent.data.event_date.split('T')[0]}T${updatedEvent.data.start_time}`
            : event.startsAt,
          endsAt: updatedEvent.data.event_date && updatedEvent.data.end_time 
            ? `${updatedEvent.data.event_date.split('T')[0]}T${updatedEvent.data.end_time}`
            : event.endsAt,
          price: {
            member: parseFloat(updatedEvent.data.member_price || 0),
            nonMember: parseFloat(updatedEvent.data.non_member_price || 0)
          },
          maxCapacity: parseInt(updatedEvent.data.max_attendees || 0),
          cpScore: parseFloat(updatedEvent.data.cpe_hours || 0),
          tags: updatedEvent.data.event_tags || [],
          description: updatedEvent.data.event_description || '',
          descriptionHtml: updatedEvent.data.event_description || '',
          
          // 🏢 VENUE DATA - Transform from backend response
          venue: updatedEvent.data.venue ? {
            name: updatedEvent.data.venue.venue_name || '',
            address: updatedEvent.data.venue.full_address || '',
            mapEmbedUrl: updatedEvent.data.venue.google_maps_url || '',
            lat: updatedEvent.data.venue.latitude || null,
            lng: updatedEvent.data.venue.longitude || null
          } : event.venue,
          mode: updatedEvent.data.venue?.mode || event.mode || 'in_person',
          
          // 📋 AGENDA DATA - Transform from backend response
          agenda: (updatedEvent.data.agenda || []).map(a => ({
            id: a.id,
            title: a.session_title,
            description: a.session_description,
            start: a.start_time,
            end: a.end_time,
            startTime: a.start_time, // Support both formats
            endTime: a.end_time,     // Support both formats
            speakers: Array.isArray(a.session_speakers) ? a.session_speakers : []
          })),
          
          // 👥 SPEAKERS DATA - Transform from backend response
          speakers: updatedEvent.data.speakers || [],
          
          // 🏢 SPONSORS DATA - Transform from backend response
          sponsors: updatedEvent.data.sponsors || []
        };

        console.log('Setting updated event:', transformedEvent);
        console.log('🏢 Sponsors in updated event:', updatedEvent.data.sponsors);
        setEvent(transformedEvent);
        setIsEditModalOpen(false);
        success('Event updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      showError(error.message || 'Failed to update event. Please try again.');
      throw error; // Re-throw to let modal handle the error state
    }
  };

  // Mock event data - replace with real API call
  const mockEvent = {
    id: id || "evt_123",
    title: "Cybersecurity Panel: AI & Threats 2025",
    category: "Panel Discussion",
    hostedBy: "ISACA Silicon Valley Chapter",
    bannerUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop",
    bannerOverlay: { color: '#1f2937', opacity: 0.6 }, // Dark gray overlay with 60% opacity
    startsAt: "2025-11-12T09:30:00Z",
    endsAt: "2025-11-12T16:30:00Z",
    mode: "virtual",
    venue: {
      name: "Virtual Event Platform",
      address: "Online",
      lat: 37.3382,
      lng: -121.8863,
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01116148467422!3d37.33233377983014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb59127ce078f%3A0x18e2c3493f20264b!2sSan%20Jose%2C%20CA!5e0!3m2!1sen!2sus!4v1635724012345!5m2!1sen!2sus"
    },
    virtualLinks: {
      zoom: "https://zoom.us/j/123456789?pwd=YWJjZGVmZ2hpams",
      googleMeet: "https://meet.google.com/abc-defg-hij",
      teams: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_example",
      password: "SecureEvent2025",
      instructions: "Please join the meeting 15 minutes early for a tech check. Download the Zoom app for the best experience. The session will be recorded for registered attendees who cannot attend live."
    },
    price: {
      member: 35.00,
      nonMember: 50.00
    },
    currency: "USD",
    isPaid: true,
    maxCapacity: 2000,
    capacity: 2000, // Keep for backward compatibility
    seatsLeft: 42, // 42 seats remaining
    // This means 1958 seats are taken (2000 - 42 = 1958)
    // Percentage filled should be: (1958/2000) * 100 = 97.9% = 98%
    cpScore: 10,
    tags: ["cybersecurity", "AI", "panel"],
    shortDescription: "A deep-dive panel on AI-enabled threats and defense strategies.",
    descriptionHtml: "<p>Join us for an insightful panel discussion on the intersection of artificial intelligence and cybersecurity threats. Our expert speakers will explore the latest developments in AI-powered attacks and the innovative defense strategies being developed to counter them.</p><p>This event is perfect for cybersecurity professionals, IT managers, and anyone interested in understanding the evolving threat landscape in the age of AI.</p>",
    agenda: [
      { 
        start: "09:30", 
        end: "10:15", 
        title: "Keynote: AI Threats in 2025", 
        description: "Explore the evolving landscape of AI-powered cybersecurity threats and learn how organizations can prepare for emerging challenges in artificial intelligence security.",
        speakers: ["spk_1"] 
      },
      { 
        start: "10:30", 
        end: "12:00", 
        title: "Panel: Defensive Strategies", 
        description: "Join industry experts as they discuss cutting-edge defensive strategies, best practices for threat detection, and innovative approaches to organizational cybersecurity.",
        speakers: ["spk_1", "spk_2", "spk_3"] 
      },
      { 
        start: "13:00", 
        end: "14:30", 
        title: "Workshop: Hands-on Defense", 
        description: "Get hands-on experience with the latest cybersecurity tools and techniques. This interactive workshop covers practical implementation of defense mechanisms.",
        speakers: ["spk_1", "spk_2"] 
      },
      { 
        start: "15:00", 
        end: "16:30", 
        title: "Q&A and Networking", 
        description: "Connect with fellow professionals, ask questions to our expert speakers, and build valuable relationships in the cybersecurity community.",
        speakers: [] 
      }
    ],
    speakers: [
      {
        id: "spk_1",
        name: "Alice Kumar",
        title: "CTO",
        company: "SecureCorp",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
        linkedin: "https://www.linkedin.com/in/alicek",
        bio: "Expert on ML-secure systems with 15+ years experience in cybersecurity and artificial intelligence."
      },
      {
        id: "spk_2",
        name: "Bob Lee",
        title: "Head of Research",
        company: "CyberSys",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        linkedin: "https://www.linkedin.com/in/bobl",
        bio: "Threat intelligence lead specializing in advanced persistent threats and AI-powered attack detection."
      },
      {
        id: "spk_3",
        name: "Carol Zhang",
        title: "Security Architect",
        company: "TechDefense",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        linkedin: "https://www.linkedin.com/in/carolz",
        bio: "Cybersecurity architect focused on building resilient systems against emerging AI threats."
      }
    ],
    sponsors: [
      { 
        id: "s1", 
        name: "MegaSecure Inc", 
        logo: "https://placehold.co/120x60/3B82F6/FFFFFF/png?text=MegaSecure", 
        level: "platinum",
        website: "https://megasecure.com",
        customLabel: ""
      },
      { 
        id: "s2", 
        name: "CloudOps Solutions", 
        logo: "https://placehold.co/120x60/10B981/FFFFFF/png?text=CloudOps", 
        level: "gold",
        website: "https://cloudops.com",
        customLabel: ""
      },
      { 
        id: "s3", 
        name: "SecureNet Technologies", 
        logo: "https://placehold.co/120x60/F59E0B/FFFFFF/png?text=SecureNet", 
        level: "silver",
        website: "https://securenet.com",
        customLabel: ""
      },
      { 
        id: "s4", 
        name: "CyberGuard Systems", 
        logo: "https://placehold.co/120x60/EF4444/FFFFFF/png?text=CyberGuard", 
        level: "bronze",
        website: "https://cyberguard.com",
        customLabel: ""
      },
      { 
        id: "s5", 
        name: "AI Defense Labs", 
        logo: "https://placehold.co/120x60/8B5CF6/FFFFFF/png?text=AI+Defense", 
        level: "custom",
        website: "https://aidefense.com",
        customLabel: "Innovation Partner"
      }
    ],
    notifications: [
      {
        id: "n1",
        title: "Schedule Update",
        body: "Panel time changed to 10:30 AM to accommodate keynote speaker travel.",
        createdAt: "2025-10-02T08:00:00Z"
      },
      {
        id: "n2",
        title: "Parking Information",
        body: "Free parking is available in the adjacent lot. Please allow extra time for security check-in.",
        createdAt: "2025-10-01T14:30:00Z"
      }
    ],
    relatedEvents: [
      {
        id: "evt_124",
        title: "Advanced Threat Detection Workshop",
        date: "2025-11-20",
        time: "14:00",
        duration: "4 hours",
        location: "Virtual Event",
        category: 'Workshop',
        price: { member: 25, nonMember: 75 },
        maxAttendees: 50,
        currentAttendees: 32,
        image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop',
        tags: ['Threat Detection', 'Workshop'],
        level: 'Advanced',
        cpe: 4,
        mode: 'Virtual',
        virtual: true,
        status: 'upcoming'
      }
    ]
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // Fetch event from backend API
        const response = await eventsAPI.getById(id);
        const backendData = response.data || response;
        
        // Debug sponsors data from backend
        console.log('🏢 SPONSORS DEBUG - Backend sponsors data:');
        console.log('- Full backend data:', backendData);
        console.log('- Sponsors array:', backendData.sponsors);
        console.log('- Sponsors type:', typeof backendData.sponsors);
        console.log('- Sponsors length:', backendData.sponsors?.length);
        
        // Debug venue data from backend
        console.log('🏢 FRONTEND DEBUG - Backend venue data:');
        console.log('- Full backend data:', backendData);
        console.log('- Venue object:', backendData.venue);
        console.log('- venue_name:', backendData.venue?.venue_name);
        console.log('- full_address:', backendData.venue?.full_address);
        
        // Calculate seats left
        const maxCapacity = backendData.max_attendees || 100;
        const registeredCount = backendData.registered_count || 0;
        const seatsLeft = maxCapacity - registeredCount;
        
        // Transform backend data to frontend format
        const eventData = {
          id: backendData.id,
          slug: backendData.event_slug || backendData.id,
          title: backendData.event_title,
          category: backendData.event_category || 'Event',
          hostedBy: backendData.hosted_by || 'ISACA Silicon Valley',
          
          // Banner and visual
          bannerUrl: (() => {
            const url = backendData.media?.banner_image || backendData.banner_image || backendData.media?.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop';
            console.log('🎨 Loading banner URL:', url?.substring(0, 100));
            return url;
          })(),
          bannerImage: backendData.media?.banner_image || backendData.banner_image || backendData.media?.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
          bannerOverlay: { 
            color: backendData.media?.overlay_settings || '#1f2937', 
            opacity: backendData.media?.overlay_opacity || 0.6 
          },
          
          // Date and time - extract date part from timestamp
          startsAt: backendData.event_date && backendData.start_time ? 
            `${backendData.event_date.split('T')[0]}T${backendData.start_time}` : 
            new Date().toISOString(),
          endsAt: backendData.event_date && backendData.end_time ? 
            `${backendData.event_date.split('T')[0]}T${backendData.end_time}` : 
            new Date().toISOString(),
          date: backendData.event_date ? backendData.event_date.split('T')[0] : new Date().toISOString().split('T')[0],
          time: backendData.start_time || '00:00',
          endTime: backendData.end_time,
          duration: backendData.duration_hours ? `${backendData.duration_hours} hours` : '2 hours',
          
          // Location and mode
          mode: backendData.is_virtual ? 'virtual' : 'in-person',
          virtual: backendData.is_virtual || false,
          venue: backendData.is_virtual ? {
            name: 'Virtual Event Platform',
            address: 'Online',
            lat: 37.3382,
            lng: -121.8863,
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01116148467422!3d37.33233377983014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb59127ce078f%3A0x18e2c3493f20264b!2sSan%20Jose%2C%20CA!5e0!3m2!1sen!2sus!4v1635724012345!5m2!1sen!2sus'
          } : {
            name: backendData.venue?.venue_name || backendData.venue_name || 'TBA',
            address: backendData.venue?.full_address || backendData.venue?.address || backendData.venue_address || '',
            lat: backendData.venue?.latitude || 37.3382,
            lng: backendData.venue?.longitude || -121.8863,
            mapEmbedUrl: backendData.venue?.google_maps_url || backendData.venue?.map_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01116148467422!3d37.33233377983014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb59127ce078f%3A0x18e2c3493f20264b!2sSan%20Jose%2C%20CA!5e0!3m2!1sen!2sus!4v1635724012345!5m2!1sen!2sus'
          },
          location: backendData.is_virtual ? 'Virtual Event' : (backendData.venue?.venue_name || backendData.venue_name || 'TBA'),
          address: backendData.venue?.full_address || backendData.venue?.address || backendData.venue_address || '',
          
          // Virtual links
          virtualLinks: backendData.is_virtual && backendData.virtual_links ? {
            zoom: backendData.virtual_links.zoom_link || backendData.virtual_link || '',
            googleMeet: backendData.virtual_links.google_meet_link || '',
            teams: backendData.virtual_links.teams_link || '',
            password: backendData.virtual_links.meeting_password || '',
            instructions: backendData.virtual_links.instructions || 'Please join the meeting 15 minutes early for a tech check.'
          } : null,
          virtualLink: backendData.virtual_link || null,
          virtualPlatform: backendData.virtual_platform || 'Zoom',
          
          // Pricing
          isPaid: (backendData.member_price > 0 || backendData.non_member_price > 0),
          price: {
            member: backendData.member_price || 0,
            nonMember: backendData.non_member_price || 0
          },
          currency: 'USD',
          
          // Capacity and registration
          maxCapacity: maxCapacity,
          capacity: maxCapacity,
          seatsLeft: seatsLeft,
          registeredCount: registeredCount,
          currentAttendees: registeredCount,
          
          // Status and metadata
          status: backendData.event_status || 'upcoming',
          level: backendData.difficulty_level || 'All Levels',
          tags: backendData.event_tags || [],
          cpScore: backendData.cpe_hours || 0,
          cpeCredits: backendData.cpe_hours || 0,
          
          // Descriptions
          shortDescription: backendData.event_description || backendData.short_description || '',
          descriptionHtml: backendData.detailed_description || backendData.event_description || '<p>Event details coming soon.</p>',
          
          // Speakers - use the backend transformed data directly since it's already in the correct format
          speakers: backendData.speakers || [],
          
          // Sponsors
          sponsors: (backendData.sponsors || []).map(sp => ({
            id: sp.id || `s${sp.sponsor_id}`,
            name: sp.sponsor_name || sp.name || 'Sponsor',
            logo: sp.logo_url || sp.logo || `https://placehold.co/120x60/3B82F6/FFFFFF/png?text=${encodeURIComponent(sp.sponsor_name || 'Sponsor')}`,
            level: sp.sponsorship_level || sp.level || 'bronze',
            website: sp.website_url || sp.website || '#',
            customLabel: sp.custom_label || ''
          })),
          
          // Agenda
          agenda: (backendData.agenda || []).map(a => ({
            id: a.id || Date.now().toString() + Math.random(),
            start: a.start_time || a.start || '00:00',
            end: a.end_time || a.end || '00:00',
            title: a.session_title || a.title || 'Session',
            description: a.session_description || a.description || '',
            speakers: a.speaker_ids || a.session_speakers || []
          })),
          
          // Additional fields
          prerequisites: backendData.prerequisites || [],
          learningObjectives: backendData.learning_objectives || [],
          materials: backendData.materials || [],
          notifications: backendData.notifications || [],
          
          // Related events (if available from backend)
          relatedEvents: (backendData.related_events || []).map(e => ({
            id: e.id,
            title: e.event_title || e.title,
            date: e.event_date || e.date,
            time: e.start_time || e.time || '00:00',
            duration: e.duration_hours ? `${e.duration_hours} hours` : '2 hours',
            location: e.is_virtual ? 'Virtual Event' : (e.venue_name || 'TBA'),
            category: e.event_category || e.category || 'Event',
            price: { 
              member: e.member_price || 0, 
              nonMember: e.non_member_price || 0 
            },
            maxAttendees: e.max_attendees || 100,
            currentAttendees: e.registered_count || 0,
            image: e.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
            tags: e.event_tags || [],
            level: e.difficulty_level || 'All Levels',
            cpe: e.cpe_hours || 0,
            mode: e.is_virtual ? 'Virtual' : 'In-Person',
            virtual: e.is_virtual || false,
            status: e.event_status || 'upcoming'
          }))
        };
        
        console.log('🏢 SPONSORS DEBUG - Transformed sponsors:', eventData.sponsors);
        console.log('🏢 SPONSORS DEBUG - Sponsors count:', eventData.sponsors?.length);
        
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        console.log('⚠️ API failed, using fallback mock data for event:', id);
        
        // Create mock event data when backend API fails
        const mockEvent = {
          id: id,
          slug: id,
          title: id.includes('cloud') ? '🔥 UPDATED: Cloud Security Fundamentals 🔥' : `Demo Event: ${id.replace(/-/g, ' ')}`,
          category: 'Workshop',
          hostedBy: 'ISACA Silicon Valley Chapter',
          bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
          bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
          bannerOverlay: { color: '#1f2937', opacity: 0.6 },
          startsAt: '2025-11-15T09:00:00Z',
          endsAt: '2025-11-15T17:00:00Z',
          mode: 'in_person',
          venue: {
            name: 'San Jose Convention Center',
            address: '150 W San Carlos St, San Jose, CA 95113',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414',
            lat: 37.3323,
            lng: -121.8863
          },
          price: { member: 25.00, nonMember: 35.00 },
          currency: 'USD',
          isPaid: true,
          maxCapacity: 100,
          seatsLeft: 25,
          cpScore: 8,
          tags: ['cloud security', 'workshop'],
          shortDescription: '🚀 UPDATED MOCK DATA - Changes are working! 🚀',
          descriptionHtml: '<p><strong style="color: red; font-size: 20px;">🔄 FILE UPDATED SUCCESSFULLY! If you can see this red text, the changes are working!</strong></p><p>This is mock data displayed because the backend server is not running. Start the backend to see real data.</p>',
          agenda: [
            { 
              id: '1',
              start: '09:00',
              end: '10:30',
              title: 'Cloud Security Fundamentals',
              description: 'Introduction to cloud security concepts and best practices',
              speakers: ['spk_1', 'spk_2']
            },
            { 
              id: '2',
              start: '10:45',
              end: '12:00',
              title: 'Advanced Threat Detection',
              description: 'Interactive workshop on identifying and mitigating advanced threats',
              speakers: ['spk_3']
            }
          ],
          speakers: [
            {
              id: 'spk_1',
              name: 'Dr. Sarah Chen',
              title: 'Chief Security Officer',
              company: 'CyberTech Solutions',
              photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              bio: 'Leading expert in cloud security with 15+ years of experience in cybersecurity and risk management.',
              linkedin: 'https://linkedin.com/in/sarah-chen'
            },
            {
              id: 'spk_2', 
              name: 'Michael Rodriguez',
              title: 'Security Architect',
              company: 'SecureCloud Inc',
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              bio: 'Specialized in enterprise security architecture and cloud infrastructure protection.',
              linkedin: 'https://linkedin.com/in/michael-rodriguez'
            },
            {
              id: 'spk_3',
              name: 'Emily Johnson',
              title: 'VP of Information Security', 
              company: 'TechGuard Corp',
              photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
              bio: 'Expert in compliance frameworks and security governance with CISSP and CISA certifications.',
              linkedin: 'https://linkedin.com/in/emily-johnson'
            }
          ],
          sponsors: [],
          notifications: [],
          virtualLinks: null,
          status: 'upcoming',
          requirements: [],
          whatYouWillLearn: []
        };
        
        setEvent(mockEvent);
        console.log('✅ Mock data loaded successfully for event:', id);
        console.log('📋 Mock speakers loaded:', mockEvent.speakers?.length || 0);
        console.log('🔄 EventDetails.jsx updated at:', new Date().toLocaleTimeString());
        console.log('👥 SPEAKERS DATA:', mockEvent.speakers);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Update page title and meta description
  useEffect(() => {
    if (event) {
      document.title = `${event.title} | ISACA Silicon Valley`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', event.shortDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = event.shortDescription;
        document.head.appendChild(meta);
      }
    }
    
    return () => {
      document.title = 'ISACA Silicon Valley';
    };
  }, [event]);

  const handleRegistration = () => {
    // Simulate successful registration for development
    setUserRegistered(true);
    showToast('Successfully registered for the event! You can now access virtual meeting links.', 'success');
    
    // TODO: Replace with real API call when backend is ready
    // try {
    //   const response = await fetch(`/api/events/${event.id}/register`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${authToken}`,
    //     },
    //     body: JSON.stringify(userRegistrationData)
    //   });
    //   
    //   if (!response.ok) {
    //     throw new Error('Registration failed');
    //   }
    //   
    //   if (response.ok) {
    //     setUserRegistered(true);
    //     showToast('Registration successful!', 'success');
    //   }
    // } catch (error) {
    //   showToast('Registration failed. Please try again.', 'error');
    // }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl" />
              </div>
              <div>
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600 dark:text-gray-400">
            No event data available
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Main render - show event details and edit modal for admins
  return (
    <PublicLayout>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Admin Edit Button */}
      {isAdmin && (
        <div className="fixed top-20 right-6 z-40">
          <div className="relative">
            <button
              onClick={() => setIsEditModalOpen(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                Edit Event
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full">
                  <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/events" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Events
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {event.category && (
            <>
              <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                {event.category}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-gray-900 dark:text-white font-medium">{event.title}</span>
        </nav>

        {/* Event Banner with Overlay */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Banner Overlay */}
          {event.bannerOverlay && (
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: event.bannerOverlay.color || '#000000',
                opacity: event.bannerOverlay.opacity || 0.3
              }}
            />
          )}
          
          {/* Event Title & Basic Info Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="max-w-4xl">
                {/* Badges - CPE Score, Mode, Price */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* CPE Credits Badge */}
                  {event.cpScore > 0 && (
                    <div className="badge-shine px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg backdrop-blur-sm bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span>{event.cpScore} CPE</span>
                    </div>
                  )}
                  
                  {/* Event Mode Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5 ${
                    event.mode === 'virtual' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                      : event.mode === 'hybrid'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}>
                    {event.mode === 'virtual' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Virtual</span>
                      </>
                    ) : event.mode === 'hybrid' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span>Hybrid</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>In-Person</span>
                      </>
                    )}
                  </div>
                  
                  {/* Price Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5 ${
                    event.isPaid 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  }`}>
                    {event.isPaid ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{getCompactDisplayPrice(event)}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>FREE</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Event Category */}
                {event.category && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-semibold uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {event.category}
                    </span>
                  </div>
                )}
                
                <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatEventDate(event.startsAt, event.endsAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.mode === 'virtual' ? 'Virtual Event' : event.venue?.name || 'TBD'}</span>
                  </div>
                  {event.hostedBy && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">Hosted by:</span>
                      <span className="font-semibold">{event.hostedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details & Category */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Event Overview</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                {event.category && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                      Category
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {event.category}
                    </div>
                  </div>
                )}

                {/* Event Type */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    Format
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {event.mode}
                  </div>
                </div>

                {/* Duration */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Duration
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {(() => {
                      const start = new Date(event.startsAt);
                      const end = new Date(event.endsAt);
                      const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
                      return `${duration} hrs`;
                    })()}
                  </div>
                </div>

                {/* CPE Credits */}
                {event.cpScore > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                      CPE Credits
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {event.cpScore} Credits
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Row */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Topics
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(event.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.descriptionHtml || event.shortDescription }}
              />
            </div>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center animate-pulse">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Event Agenda</h2>
                      <p className="text-white/80 text-sm">Your journey through the day</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-8">
                  <div className="relative">
                    {/* Animated Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 rounded-full"></div>
                    <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse opacity-60"></div>
                    
                    <div className="space-y-8">
                      {(event.agenda || []).map((item, index) => {
                        // Detect session type from title
                        const title = (item.title || '').toLowerCase();
                        const sessionType = title.includes('keynote') ? 'keynote'
                          : title.includes('panel') ? 'panel'
                          : title.includes('workshop') ? 'workshop'
                          : title.includes('networking') || title.includes('q&a') ? 'networking'
                          : 'session';
                        
                        const sessionConfig = {
                          keynote: {
                            colors: 'from-purple-500 to-pink-500',
                            bgColors: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                            borderColors: 'border-purple-200 dark:border-purple-700',
                            badgeColors: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200',
                            icon: 'KEY',
                            label: 'Keynote'
                          },
                          panel: {
                            colors: 'from-blue-500 to-indigo-500',
                            bgColors: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
                            borderColors: 'border-blue-200 dark:border-blue-700',
                            badgeColors: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200',
                            icon: 'PANEL',
                            label: 'Panel Discussion'
                          },
                          workshop: {
                            colors: 'from-emerald-500 to-teal-500',
                            bgColors: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
                            borderColors: 'border-emerald-200 dark:border-emerald-700',
                            badgeColors: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200',
                            icon: 'WORK',
                            label: 'Workshop'
                          },
                          networking: {
                            colors: 'from-amber-500 to-orange-500',
                            bgColors: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
                            borderColors: 'border-amber-200 dark:border-amber-700',
                            badgeColors: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200',
                            icon: 'NET',
                            label: 'Networking'
                          },
                          session: {
                            colors: 'from-gray-500 to-slate-500',
                            bgColors: 'from-gray-50 to-slate-50 dark:from-gray-700/20 dark:to-slate-700/20',
                            borderColors: 'border-gray-200 dark:border-gray-600',
                            badgeColors: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200',
                            icon: 'SESS',
                            label: 'Session'
                          }
                        };

                        const config = sessionConfig[sessionType];

                        return (
                          <div 
                            key={index} 
                            className="relative flex items-start gap-6 group"
                            style={{ 
                              opacity: 0,
                              animation: `slideInUp 0.6s ease-out ${index * 0.2}s forwards`
                            }}
                          >
                            {/* Animated Timeline Dot */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className={`w-6 h-6 bg-gradient-to-r ${config.colors} rounded-full ring-4 ring-white dark:ring-gray-800 shadow-lg transform transition-all duration-500 group-hover:scale-125 group-hover:shadow-xl`}>
                                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping group-hover:animate-pulse"></div>
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 bg-gradient-to-br ${config.bgColors} border-2 ${config.borderColors} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]`}>
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Time Section */}
                                <div className="flex-shrink-0">
                                  <div className={`bg-gradient-to-r ${config.colors} text-white px-4 py-3 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105`}>
                                    <div className="text-lg font-bold">{item.start || item.startTime}</div>
                                    <div className="text-sm opacity-90">to {item.end || item.endTime}</div>
                                  </div>
                                  
                                  {/* Duration Badge */}
                                  <div className="mt-3 text-center">
                                    <span className="inline-block bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium border shadow-sm">
                                      {(() => {
                                        const startTime = item.start || item.startTime;
                                        const endTime = item.end || item.endTime;
                                        if (!startTime || !endTime) return 'TBD';
                                        
                                        const start = startTime.split(':');
                                        const end = endTime.split(':');
                                        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
                                        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                                        const duration = (endMinutes - startMinutes) / 60;
                                        return `${duration}h`;
                                      })()}
                                    </span>
                                  </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-4 mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                      {item.title}
                                    </h3>
                                    
                                    {/* Session Type Badge */}
                                    <span className={`${config.badgeColors} px-4 py-2 rounded-xl text-sm font-semibold border shadow-sm whitespace-nowrap transform transition-all duration-300 hover:scale-105`}>
                                      <span className="mr-2">{config.icon}</span>
                                      {config.label}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  {item.description && (
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                                      {item.description}
                                    </p>
                                  )}

                                  {/* Speakers */}
                                  {Array.isArray(item.speakers) && item.speakers.length > 0 && (
                                    <div className="flex items-start gap-3">
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-8 h-8 bg-gradient-to-r ${config.colors} rounded-lg flex items-center justify-center shadow-sm`}>
                                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                          </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                          Speaker{Array.isArray(item.speakers) && item.speakers.length > 1 ? 's' : ''}:
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-2 flex-1">
                                        {Array.isArray(item.speakers) ? item.speakers.map(spkId => {
                                          const speaker = (event.speakers || []).find(s => s.id === spkId);
                                          return speaker ? (
                                            <span key={spkId} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm border shadow-sm hover:shadow-md transition-shadow duration-200">
                                              {speaker.name}
                                            </span>
                                          ) : null;
                                        }).filter(Boolean) : []}
                                        {(!Array.isArray(item.speakers) || item.speakers.length === 0) && (
                                          <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                                            Open to all attendees
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <style jsx>{`
              @keyframes slideInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes spin-slow {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
              .animate-spin-slow {
                animation: spin-slow 3s linear infinite;
              }
            `}</style>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Speakers</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(event.speakers || []).map((speaker) => (
                    <div key={speaker.id} className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                      {/* Speaker Photo */}
                      <div className="relative mb-4">
                        <div className="relative w-20 h-20 mx-auto">
                          <img
                            src={speaker.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                            alt={speaker.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                            }}
                          />
                          <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300"></div>
                        </div>
                      </div>
                      
                      {/* Speaker Info */}
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {speaker.name}
                        </h4>
                        
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {speaker.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {speaker.company}
                          </p>
                        </div>
                        
                        {/* Bio */}
                        {speaker.bio && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                            {speaker.bio}
                          </p>
                        )}
                        
                        {/* LinkedIn Button */}
                        {speaker.linkedin && (
                          <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`View ${speaker.name}'s LinkedIn profile`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Connect
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location/Virtual Links */}
            {event.mode !== 'virtual' && event.venue && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Event Location</h2>
                      <p className="text-white/70 text-xs">Find us here</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Venue Info Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 mb-4 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{event.venue.name}</h3>
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{event.venue.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.venue.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                    
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(event.venue.address);
                          showToast('Address copied to clipboard!', 'success');
                        } catch (err) {
                          console.error('Failed to copy address:', err);
                          showToast('Failed to copy address. Please try again.', 'error');
                        }
                      }}
                      className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-600 hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Address
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/parking+near+${encodeURIComponent(event.venue.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 font-medium border border-blue-200 dark:border-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z" />
                      </svg>
                      Find Parking
                    </a>
                  </div>

                  {/* Map */}
                  {event.venue.mapEmbedUrl ? (
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                      <iframe
                        src={event.venue.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map to ${event.venue.name}`}
                      ></iframe>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Interactive Map</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Loading location details...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-xs">We look forward to seeing you there!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Links - Only show if user is registered */}
            {(event.mode === 'virtual' || event.mode === 'hybrid') && userRegistered && event.virtualLinks && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-8 border-2 border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Virtual Meeting Links
                </h2>
                <div className="space-y-3">
                  {event.virtualLinks.zoom && (
                    <a
                      href={event.virtualLinks.zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">Z</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">Join via Zoom</span>
                    </a>
                  )}
                  {event.virtualLinks.googleMeet && (
                    <a
                      href={event.virtualLinks.googleMeet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold text-sm">M</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">Join via Google Meet</span>
                    </a>
                  )}
                  {event.virtualLinks.teams && (
                    <a
                      href={event.virtualLinks.teams}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">T</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">Join via Microsoft Teams</span>
                    </a>
                  )}
                  {event.virtualLinks.password && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Meeting Password:</span> {event.virtualLinks.password}
                      </p>
                    </div>
                  )}
                  {event.virtualLinks.instructions && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{event.virtualLinks.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sponsors */}
            <SponsorsGrid sponsors={event.sponsors} />

            {/* Event Updates/Notifications */}
            {event.notifications && event.notifications.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Event Updates</h2>
                <div className="space-y-4">
                  {(event.notifications || []).map((notification) => (
                    <div key={notification.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.body}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Registration Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
                {/* Pricing Section */}
                <div className="p-6 pb-5 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 border-b border-gray-100 dark:border-gray-700">
                  {event.isPaid && event.price ? (
                    <div>
                      {/* Check if member and non-member prices are different */}
                      {typeof event.price === 'object' && event.price.member !== event.price.nonMember ? (
                        <div className="space-y-4">
                          {/* Member Price - Highlighted */}
                          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 rounded-2xl p-6 shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                            <div className="relative">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                                      Member Price
                                    </span>
                                    <div className="text-xs text-white/80">
                                      Exclusive discount
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                                  Save ${(event.price.nonMember || 0) - (event.price.member || 0)}
                                </div>
                              </div>
                              <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-sm text-white/80">$</span>
                                <span className="text-5xl font-black text-white tracking-tight">
                                  {event.price.member || 0}
                                </span>
                              </div>
                              <div className="text-sm text-white/90 font-medium">
                                Best value for ISACA members
                              </div>
                            </div>
                          </div>
                          
                          {/* Non-Member Price */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Non-Member
                                  </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">$</span>
                                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {event.price.nonMember || 0}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Standard rate
                                </div>
                                <div className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                  Public pricing
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 py-2.5 px-4 rounded-xl">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">
                                {event.currency || 'USD'} - Per Person - All fees included
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {getDisplayPrice(event.price)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.currency || 'USD'} - Per Person
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-block bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 shadow-lg">
                        <div className="text-5xl font-black text-white mb-2">
                          Free
                        </div>
                        <p className="text-sm text-white/90">
                          No cost to attend
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-5">
                  {/* Seats Available */}
                  {event.maxCapacity && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                          </svg>
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Seats Available</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {event.seatsLeft || 0} / {event.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                          style={{
                            width: `${Math.max(0, Math.min(100, ((event.maxCapacity - (event.seatsLeft || 0)) / event.maxCapacity) * 100))}%`
                          }}
                        />
                      </div>
                      {event.seatsLeft && event.seatsLeft < 10 && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm font-semibold">
                            Only {event.seatsLeft} seats left!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Registration Button */}
                  {!userRegistered ? (
                    <button
                      onClick={handleRegistration}
                      disabled={event.seatsLeft !== undefined && event.seatsLeft <= 0}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                        event.seatsLeft !== undefined && event.seatsLeft <= 0
                          ? 'bg-gray-400 dark:bg-gray-600 text-gray-100 dark:text-gray-300 cursor-not-allowed opacity-60'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 ring-2 ring-blue-500/20'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {event.seatsLeft !== undefined && event.seatsLeft <= 0 ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Event Full
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Register Now
                          </>
                        )}
                      </span>
                    </button>
                  ) : (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white text-center shadow-lg">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-lg font-bold">Successfully Registered</span>
                      </div>
                      <p className="text-sm text-white/90">
                        You're all set for this event!
                      </p>
                    </div>
                  )}

                  {/* CPE Credits */}
                  {event.cpScore > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/30 rounded-xl p-5 border border-purple-200 dark:border-purple-700 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md ring-2 ring-purple-500/20">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                            {event.cpScore} CPE Credits
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">
                            Earn continuing education credits
                          </div>
                        </div>
                        <div className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full font-semibold">
                          ISACA Approved
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Buttons */}
              <ShareButtons
                event={event}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal - uses shared component */}
      {isEditModalOpen && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          event={event}
          onSave={handleEditSave}
          mode="edit"
        />
      )}
    </PublicLayout>
  );
}; // Close EventDetails component

export default EventDetails;
