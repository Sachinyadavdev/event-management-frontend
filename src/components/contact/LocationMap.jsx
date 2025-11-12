import React from 'react';

const LocationMap = () => {
  const locations = [
    {
      name: 'Main Office',
      address: '123 Innovation Drive, Palo Alto, CA 94301',
      type: 'Headquarters',
      coordinates: '37.4419° N, 122.1430° W',
      features: ['Meeting Rooms', 'Training Center', 'Parking Available']
    },
    {
      name: 'San Jose Center',
      address: '456 Technology Blvd, San Jose, CA 95110',
      type: 'Training Facility',
      coordinates: '37.3382° N, 121.8863° W',
      features: ['Computer Lab', 'Certification Testing', 'Public Transit']
    },
    {
      name: 'San Francisco Hub',
      address: '789 Financial District, San Francisco, CA 94105',
      type: 'Event Space',
      coordinates: '37.7749° N, 122.4194° W',
      features: ['Conference Rooms', 'Networking Events', 'Downtown Location']
    }
  ];

  return (
    <section id="location-map" className="py-8 lg:py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Locations
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find us across Silicon Valley. We have multiple locations to serve our community better.
          </p>
        </div>

        {/* Interactive Map - Full Width Row */}
        <div className="mb-8 lg:mb-12">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 
                        rounded-2xl overflow-hidden shadow-xl h-64 lg:h-80 relative group">
            
            {/* Map Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 lg:p-8">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full 
                              flex items-center justify-center mb-4 lg:mb-6 mx-auto animate-pulse">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-2 lg:mb-3">
                  Interactive Map
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 lg:mb-4 text-sm lg:text-base">
                  Click below to view our locations on Google Maps
                </p>
                <a
                  href="https://maps.google.com/?q=Silicon+Valley+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white font-semibold rounded-lg shadow-lg hover:shadow-xl 
                           transform hover:scale-105 transition-all duration-300 text-sm lg:text-base"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Floating location pins */}
            <div className="absolute top-12 left-12 lg:top-20 lg:left-16 animate-bounce animation-delay-500">
              <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 right-16 lg:bottom-32 lg:right-20 animate-bounce animation-delay-1000">
              <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute top-20 right-12 lg:top-32 lg:right-16 animate-bounce animation-delay-1500">
              <div className="w-3 h-3 lg:w-4 lg:h-4 bg-purple-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Location Details - Three Columns Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 lg:p-6 border border-gray-200 dark:border-gray-600
                       hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group shadow-sm"
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full 
                              flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {location.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 
                               text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                  {location.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="text-center">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 text-sm text-center">{location.address}</p>
                </div>
                
                <div className="text-center">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-xs text-center">{location.coordinates}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Features:
                </h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {location.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                               text-xs rounded border border-gray-200 dark:border-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white 
                           text-sm font-medium rounded-lg transition-colors duration-300"
                >
                  Get Directions
                </a>
                <button className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                                 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                                 transition-colors duration-300">
                  Call Location
                </button>
              </div>
              </div>
            ))}
        </div>

        {/* Transportation Info */}
        <div className="mt-8 lg:mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 
                      rounded-2xl p-6 lg:p-8 border border-blue-200 dark:border-blue-700">
          <div className="text-center mb-6">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Getting Here
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Multiple transportation options available for all our locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 
                            rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Public Transit</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Caltrain, VTA, and BART accessible</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                            rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Free parking available at all locations</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 
                            rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Accessibility</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">ADA compliant with elevator access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;