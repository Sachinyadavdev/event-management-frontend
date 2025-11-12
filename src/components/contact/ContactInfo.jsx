import React from 'react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
        </svg>
      ),
      title: 'Email Us',
      details: 'info@isaca-sv.org',
      subtitle: 'We typically respond within 24 hours',
      action: 'mailto:info@isaca-sv.org',
      color: 'blue'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
        </svg>
      ),
      title: 'Call Us',
      details: '+1 (650) 555-0123',
      subtitle: 'Mon-Fri, 9AM-6PM PST',
      action: 'tel:+1-650-555-0123',
      color: 'green'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'Visit Us',
      details: 'Silicon Valley, CA',
      subtitle: 'We host events throughout the Bay Area',
      action: '#location-map',
      color: 'purple'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Get in Touch
        </h2>
        
        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.action}
              className={`group block p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                         hover:border-${method.color}-300 dark:hover:border-${method.color}-500
                         hover:bg-${method.color}-50 dark:hover:bg-${method.color}-900/20
                         transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-3 bg-${method.color}-100 dark:bg-${method.color}-900/30 
                               text-${method.color}-600 dark:text-${method.color}-400 rounded-lg
                               group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {method.title}
                  </h3>
                  <p className={`text-${method.color}-600 dark:text-${method.color}-400 font-medium mb-1`}>
                    {method.details}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method.subtitle}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg 
                    className={`w-5 h-5 text-${method.color}-400 group-hover:translate-x-1 transition-transform duration-300`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Office Hours
        </h3>
        
        <div className="space-y-3">
          {officeHours.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {schedule.day}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 
                    border border-red-200 dark:border-red-700 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Emergency Security Incidents
            </h4>
            <p className="text-red-700 dark:text-red-400 text-sm mb-3">
              For urgent cybersecurity incidents or immediate assistance, please contact our emergency hotline.
            </p>
            <a 
              href="tel:+1-650-555-9999"
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white 
                       font-medium rounded-lg transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              Emergency: (650) 555-9999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;